// types/project.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Project Manager' | 'Team Member';
}

export interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  leader_id: number;
  member_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  leader?: User;
  member?: User;
  created_by_user?: User;
  status_color?: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  leader_id: number | '';
  member_id: number | '';
}

export interface ProjectIndexProps {
  projects: Project[];
  auth: {
    user: User;
  };
  flash?: {
    success?: string;
    error?: string;
  };
}

export interface ProjectCreateProps {
  projectManagers: User[];
  teamMembers: User[];
  auth: {
    user: User;
  };
}

export interface ProjectEditProps {
  project: Project;
  projectManagers: User[];
  teamMembers: User[];
  auth: {
    user: User;
  };
}

export interface ProjectShowProps {
  project: Project;
  auth: {
    user: User;
  };
}
