export type TrainingTargetAudience = 'Proprietário' | 'Vendedor' | 'Todos';

export interface TrainingModule {
    id: number;
    courseId: number;
    title: string;
    estimatedTimeMinutes: number;
    content: string; // Could be markdown, video URL, etc.
}

export interface TrainingCourse {
    id: number;
    title: string;
    description: string;
    targetAudience: TrainingTargetAudience;
}

export interface UserProgress {
    franchiseUserId: number;
    moduleId: number;
    completedAt: string; // ISO Date
}
