export interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    role: 'Admin' | 'Project Manager' | 'Team Member';
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};
