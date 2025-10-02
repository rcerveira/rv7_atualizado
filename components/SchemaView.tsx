import React from 'react';

// Icons for keys
const PKIcon = () => <span className="text-yellow-400 font-bold text-xs" title="Primary Key">PK</span>;
const FKIcon = () => <span className="text-cyan-400 font-bold text-xs" title="Foreign Key">FK</span>;

interface Column {
  name: string;
  type: string;
  pk?: boolean;
  fk?: boolean;
}

interface TableProps {
  name: string;
  columns: Column[];
  color: string;
  position: { top: string; left: string };
  width?: string;
}

const Table: React.FC<TableProps> = ({ name, columns, color, position, width = "w-60" }) => {
  return (
    <div
      className={`absolute bg-white rounded-lg shadow-xl border-t-4 ${width}`}
      style={{ ...position, borderColor: color }}
    >
      <h3 className="text-md font-bold text-white p-2 rounded-t-sm" style={{ backgroundColor: color }}>
        {name}
      </h3>
      <ul className="text-sm p-2 space-y-1">
        {columns.map(col => (
          <li key={col.name} className="flex justify-between items-center text-gray-700 border-b border-gray-100 last:border-b-0 py-1">
            <div className="flex items-center space-x-2">
              {col.pk && <PKIcon />}
              {col.fk && <FKIcon />}
              <span>{col.name}</span>
            </div>
            <span className="text-gray-500 font-mono text-xs">{col.type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const groupColors = {
    core: '#1E3A8A', // Blue
    crm: '#059669', // Emerald
    operations: '#D97706', // Amber
    support: '#7C3AED', // Violet
    system: '#64748B' // Slate
};

const schema = {
    // Core
    franchises: { name: 'franchises', color: groupColors.core, position: { top: '20px', left: '620px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'name', type: 'string' }, { name: 'owner_name', type: 'string' }] },
    franchise_users: { name: 'franchise_users', color: groupColors.core, position: { top: '300px', left: '620px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'franchise_id', type: 'integer', fk: true }, { name: 'name', type: 'string' }, { name: 'role', type: 'enum' }] },
    system_users: { name: 'system_users', color: groupColors.core, position: { top: '20px', left: '20px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'name', type: 'string' }, { name: 'role', type: 'enum' }] },
    goals: { name: 'goals', color: groupColors.core, position: { top: '300px', left: '320px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'franchise_id', type: 'integer', fk: true }, {name: 'revenue_target', type: 'number'}] },


    // CRM
    clients: { name: 'clients', color: groupColors.crm, position: { top: '300px', left: '920px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'franchise_id', type: 'integer', fk: true }, { name: 'name', type: 'string' }] },
    leads: { name: 'leads', color: groupColors.crm, position: { top: '300px', left: '1220px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'client_id', type: 'integer', fk: true }, { name: 'franchise_id', type: 'integer', fk: true }] },
    lead_notes: { name: 'lead_notes', color: groupColors.crm, position: { top: '540px', left: '1220px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'lead_id', type: 'integer', fk: true }, { name: 'text', type: 'string' }] },
    franchisee_leads: { name: 'franchisee_leads', color: groupColors.crm, position: { top: '20px', left: '920px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'candidate_name', type: 'string' }, { name: 'status', type: 'enum' }] },

    // Operations
    consortiums: { name: 'consortiums', color: groupColors.operations, position: { top: '540px', left: '920px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'client_id', type: 'integer', fk: true }, { name: 'salesperson_id', type: 'integer', fk: true }] },
    credit_recovery: { name: 'credit_recovery_cases', color: groupColors.operations, position: { top: '540px', left: '620px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'client_id', type: 'integer', fk: true }, { name: 'salesperson_id', type: 'integer', fk: true }] },
    
    // Support / Training
    training_courses: { name: 'training_courses', color: groupColors.support, position: { top: '540px', left: '320px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'title', type: 'string' }] },
    training_modules: { name: 'training_modules', color: groupColors.support, position: { top: '780px', left: '320px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'course_id', type: 'integer', fk: true }] },
    user_progress: { name: 'user_progress', color: groupColors.support, position: { top: '780px', left: '620px' }, columns: [{ name: 'franchise_user_id', type: 'integer', fk: true }, { name: 'module_id', type: 'integer', fk: true }] },
    
    // System
    products: { name: 'products', color: groupColors.system, position: { top: '20px', left: '320px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'name', type: 'string' }] },
    marketing_campaigns: { name: 'marketing_campaigns', color: groupColors.system, position: { top: '300px', left: '20px' }, columns: [{ name: 'id', type: 'integer', pk: true }, { name: 'title', type: 'string' }] },
};

const connections = [
    // Core connections
    { from: 'franchise_users', to: 'franchises', path: 'M 720,300 V 212' }, // Adjusted path
    { from: 'goals', to: 'franchises', path: 'M 470,300 C 520,300 570,250 620,212' }, // Adjusted curve
    
    // CRM connections
    { from: 'clients', to: 'franchises', path: 'M 920,300 H 860 V 212' }, // Adjusted path
    { from: 'leads', to: 'clients', path: 'M 1220,388 H 1160' },
    { from: 'leads', to: 'franchises', path: 'M 1220,300 C 1100,200 900,200 860,212' }, // Adjusted curve
    { from: 'lead_notes', to: 'leads', path: 'M 1220,540 V 458' },
    
    // Operations connections
    { from: 'consortiums', to: 'clients', path: 'M 1020,540 V 458' },
    { from: 'consortiums', to: 'franchise_users', path: 'M 920,628 H 860 V 458' },
    { from: 'credit_recovery', to: 'clients', path: 'M 770,540 C 820,540 870,500 920,458' }, // Adjusted curve
    { from: 'credit_recovery', to: 'franchise_users', path: 'M 720,540 V 458' },
    
    // Training connections
    { from: 'training_modules', to: 'training_courses', path: 'M 420,780 V 688' }, // Adjusted path
    { from: 'user_progress', to: 'training_modules', path: 'M 620,868 H 560 V 858' },
    { from: 'user_progress', to: 'franchise_users', path: 'M 720,780 V 458' },
];

const SchemaView: React.FC = () => {
    return (
        <div>
             <div className="flex items-center space-x-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Diagrama do Banco de Dados</h2>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg overflow-auto" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)',
                backgroundSize: '20px 20px',
            }}>
                <div className="relative w-[1500px] h-[1000px]">
                    {Object.values(schema).map(table => (
                        <Table key={table.name} {...table} />
                    ))}
                    <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
                        <defs>
                            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
                            </marker>
                        </defs>
                        {connections.map((conn, i) => (
                             <path key={i} d={conn.path} stroke="#9ca3af" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default SchemaView;