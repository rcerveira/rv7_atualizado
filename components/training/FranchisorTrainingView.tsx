import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { TrainingCourse, TrainingModule, UserProgress, Franchise, FranchiseUser } from '../../types';
import Modal from '../Modal';
import { AcademicCapIcon } from '../icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CourseCompletionChartProps {
    data: { name: string, progress: number }[];
}

const CourseCompletionChart: React.FC<CourseCompletionChartProps> = ({ data }) => (
    <div className="h-96 w-full">
        <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${(value as number).toFixed(0)}%`, 'Progresso']} />
                <Bar dataKey="progress" name="Progresso" fill="#1E3A8A" barSize={30} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);


const FranchisorTrainingView: React.FC = () => {
    const { data } = useData();
    const { trainingCourses, trainingModules, userProgress, franchises, franchiseUsers } = data;
    const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
    
    const courseStats = useMemo(() => {
        return trainingCourses.map(course => {
            const courseModules = trainingModules.filter(m => m.courseId === course.id);
            if (courseModules.length === 0 || franchiseUsers.length === 0) {
                return { ...course, completion: 0 };
            }

            let totalCompletions = 0;
            franchiseUsers.forEach((user: FranchiseUser) => {
                const completedModules = courseModules.filter(m => 
                    userProgress.some(p => p.moduleId === m.id && p.franchiseUserId === user.id)
                ).length;
                totalCompletions += (completedModules / courseModules.length);
            });
            
            const overallCompletion = (totalCompletions / franchiseUsers.length) * 100;
            return { ...course, completion: overallCompletion };
        });
    }, [trainingCourses, trainingModules, userProgress, franchiseUsers]);


    const selectedCourseChartData = useMemo(() => {
        if (!selectedCourse) return [];

        const courseModules = trainingModules.filter(m => m.courseId === selectedCourse.id);
        if (courseModules.length === 0) return [];
        
        return franchises.map((franchise: Franchise) => {
            const franchiseUsersInFranchise = franchiseUsers.filter((u: FranchiseUser) => u.franchiseId === franchise.id);
            if (franchiseUsersInFranchise.length === 0) {
                return { name: franchise.name, progress: 0 };
            }

            let totalProgress = 0;
            franchiseUsersInFranchise.forEach((user: FranchiseUser) => {
                const completedCount = userProgress.filter(p => 
                    p.franchiseUserId === user.id && courseModules.some(m => m.id === p.moduleId)
                ).length;
                totalProgress += (completedCount / courseModules.length);
            });
            
            return {
                name: franchise.name,
                progress: (totalProgress / franchiseUsersInFranchise.length) * 100
            };
        });

    }, [selectedCourse, trainingModules, userProgress, franchises, franchiseUsers]);


    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-3 mb-6">
                    <AcademicCapIcon className="w-8 h-8 text-primary"/>
                    <h2 className="text-2xl font-bold text-gray-800">Acompanhamento de Treinamentos</h2>
                </div>
                <div className="space-y-4">
                    {courseStats.map(course => (
                         <div key={course.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between" onClick={() => setSelectedCourse(course)}>
                            <div>
                                <h3 className="font-bold text-lg text-primary">{course.title}</h3>
                                <p className="text-sm text-gray-600">{course.description}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                 <div className="w-40 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${course.completion.toFixed(0)}%`}}></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-700 w-12 text-right">{course.completion.toFixed(0)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedCourse && (
                <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} title={`Progresso do Curso: ${selectedCourse.title}`}>
                    <div className="w-[700px] max-w-full">
                         <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Taxa de Conclusão por Franquia</h3>
                         <CourseCompletionChart data={selectedCourseChartData} />
                    </div>
                </Modal>
            )}
        </>
    );
};

export default FranchisorTrainingView;