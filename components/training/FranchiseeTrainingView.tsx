import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import { TrainingCourse, TrainingModule, FranchiseUser, UserProgress, FranchiseUserRole } from '../../types';
import { AcademicCapIcon, ClockIcon, CheckCircleIcon, CircleIcon, ArrowLeftIcon } from '../icons';

interface ModuleListItemProps {
    module: TrainingModule;
    isCompleted: boolean;
    onToggle: () => void;
}

const ModuleListItem: React.FC<ModuleListItemProps> = ({ module, isCompleted, onToggle }) => {
    return (
        <div className={`p-4 border rounded-lg flex items-center justify-between transition-colors ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
            <div className="flex items-center">
                 <button onClick={onToggle} className="mr-4 flex-shrink-0">
                    {isCompleted ? (
                        <CheckCircleIcon className="w-7 h-7 text-green-500" solid />
                    ) : (
                        <CircleIcon className="w-7 h-7 text-gray-300 hover:text-gray-400" />
                    )}
                </button>
                <div>
                    <p className={`font-medium text-gray-800 ${isCompleted ? 'line-through text-gray-500' : ''}`}>{module.title}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                        <ClockIcon className="w-4 h-4 mr-1.5"/>
                        <span>Estimativa: {module.estimatedTimeMinutes} min</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


const CourseDetailView: React.FC<{
    course: TrainingCourse;
    modules: TrainingModule[];
    currentUserProgress: UserProgress[];
    onToggleModule: (moduleId: number) => void;
    onBack: () => void;
}> = ({ course, modules, currentUserProgress, onToggleModule, onBack }) => {

    const progressPercent = useMemo(() => {
        if (modules.length === 0) return 0;
        const completedCount = modules.filter(m => currentUserProgress.some(p => p.moduleId === m.id)).length;
        return (completedCount / modules.length) * 100;
    }, [modules, currentUserProgress]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-primary hover:text-blue-800 mb-4">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Voltar para Cursos
            </button>

            <h2 className="text-2xl font-bold text-gray-800">{course.title}</h2>
            <p className="text-gray-600 mt-1 mb-4">{course.description}</p>
            
            <div className="mb-6">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-primary">Seu Progresso</span>
                    <span className="text-sm font-medium text-primary">{progressPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-primary h-4 rounded-full" style={{width: `${progressPercent}%`}}></div>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700">Módulos do Curso</h3>
                {modules.map(module => (
                    <ModuleListItem 
                        key={module.id}
                        module={module}
                        isCompleted={currentUserProgress.some(p => p.moduleId === module.id)}
                        onToggle={() => onToggleModule(module.id)}
                    />
                ))}
            </div>
        </div>
    )
}


const FranchiseeTrainingView: React.FC = () => {
    const { selectedFranchiseData, handlers } = useData();
    const { user: authUser } = useAuth();
    const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);

    if (!selectedFranchiseData || !authUser) return null;

    const { franchiseUsers, trainingCourses, trainingModules, userProgress } = selectedFranchiseData;
    const { toggleModuleCompletion } = handlers;
    
    const currentUser = useMemo(() => {
        if (!authUser) return null;
        return franchiseUsers.find((u: FranchiseUser) => u.email.toLowerCase() === authUser.email.toLowerCase());
    }, [franchiseUsers, authUser]);


    const coursesWithProgress = useMemo(() => {
        if (!currentUser) return [];
        return trainingCourses.map((course: TrainingCourse) => {
            const courseModules = trainingModules.filter((m: TrainingModule) => m.courseId === course.id);
            if (courseModules.length === 0) {
                return { ...course, progress: 0 };
            }
            const completedModules = courseModules.filter((m: TrainingModule) => 
                userProgress.some((p: UserProgress) => p.moduleId === m.id && p.franchiseUserId === currentUser.id)
            ).length;
            
            return {
                ...course,
                progress: (completedModules / courseModules.length) * 100
            };
        });
    }, [trainingCourses, trainingModules, userProgress, currentUser]);
    
    if (!currentUser) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold text-red-600">Erro de Sincronização de Usuário</h2>
                <p className="mt-2 text-gray-600">Seu perfil de autenticação (<span className="font-mono bg-gray-100 p-1 rounded">{authUser?.email}</span>) não foi encontrado na lista de usuários desta franquia.</p>
                <p className="mt-2 text-gray-500 text-sm">Isso pode ser um problema de permissão ou de dados. Por favor, entre em contato com o suporte da franqueadora.</p>
            </div>
        );
    }
    
    if (selectedCourse) {
        return <CourseDetailView 
            course={selectedCourse}
            modules={trainingModules.filter((m: TrainingModule) => m.courseId === selectedCourse.id)}
            currentUserProgress={userProgress.filter((p: UserProgress) => p.franchiseUserId === currentUser.id)}
            onToggleModule={(moduleId: number) => toggleModuleCompletion(moduleId, currentUser.id)}
            onBack={() => setSelectedCourse(null)}
        />
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-3">
                <AcademicCapIcon className="w-8 h-8 text-primary"/>
                <h2 className="text-2xl font-bold text-gray-800">Academia RV7 - Catálogo de Cursos</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesWithProgress.map((course: any) => (
                    <div key={course.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between border-t-4 border-primary hover:shadow-xl transition-shadow">
                        <div>
                            <h3 className="font-bold text-xl text-gray-800">{course.title}</h3>
                            <p className="text-sm text-gray-600 mt-2 h-20">{course.description}</p>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-secondary bg-green-50 mt-2">
                                Para: {course.targetAudience}
                            </span>
                        </div>
                        <div className="mt-6">
                             <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Progresso</span>
                                <span className="text-sm font-medium text-gray-700">{course.progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-secondary h-2.5 rounded-full" style={{width: `${course.progress}%`}}></div>
                            </div>
                            <button onClick={() => setSelectedCourse(course)} className="w-full mt-4 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors">
                                Iniciar / Continuar Curso
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FranchiseeTrainingView;
