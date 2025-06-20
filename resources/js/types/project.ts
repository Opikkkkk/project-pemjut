export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Project Manager' | 'Team Member'|'Admin';
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  start_date: string;
  end_date: string;
  leader_id: number | null;
  leader?: User;
  members?: User[];
  selected_member_ids?: number[];
  created_by: number;
  created_by_user?: User;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: string;
    priority: string;
    due_date?: string;
    assignedTo?: {
        id: number;
        name: string;
        email: string;
    } | null;
    project?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

export interface TaskComment {
  id: number;
  comment: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  leader_id: number | null;
  member_ids: number[];
}

// Pagination interface for Laravel pagination
export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  links: PaginationLink[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Auth interface
export interface AuthUser {
  user: User;
}

// Filters interface
export interface ProjectFilters {
  search?: string;
  status?: string;
}

// Component Props Interfaces
export interface ProjectIndexProps {
  projects: PaginatedData<Project>;
  filters: ProjectFilters;
  auth: AuthUser;
}

export interface ProjectShowProps {
    project: Project;
    auth: AuthUser;
    tasks: PaginatedData<Task>;
}


export interface ProjectCreateProps {
  projectManagers: User[];
  teamMembers: User[];
  auth: AuthUser;
}

export interface ProjectEditProps {
  project: Project;
  projectManagers: User[];
  teamMembers: User[];
  auth: {
    user: User;
  };
}

// Task related interfaces
export interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  assigned_to: string;
  due_date: string;
}

export interface TaskIndexProps {
  tasks: PaginatedData<Task>;
  filters: TaskFilters;
  auth: AuthUser;
}

export interface TaskShowProps {
  task: Task;
  auth: AuthUser;
}

export interface TaskCreateProps {
  projects: Project[];
  teamMembers: User[];
  auth: AuthUser;
  project_id?: number;
}

export interface TaskEditProps {
  task: Task;
  projects: Project[];
  teamMembers: User[];
  auth: AuthUser;
}

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  project_id?: number;
  assigned_to?: number;
}

// Dashboard interfaces
export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_tasks: number;
  pending_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
}

export interface DashboardProps {
  stats: DashboardStats;
  recent_projects: Project[];
  recent_tasks: Task[];
  user_tasks: Task[];
  auth: AuthUser;
}

// Additional utility types
export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
export type TaskStatus = 'To Do' | 'In Progress'| 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

// Form validation error types
export interface ValidationErrors {
  [key: string]: string | string[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: ValidationErrors;
}

// Route parameters
export interface RouteParams {
  [key: string]: string | number;
}

// Inertia.js specific types
export interface InertiaSharedProps {
  auth: AuthUser;
  flash?: {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
  };
errors?: ValidationErrors;
canManage?: boolean;
asset_url?: string;
}
export interface TaskComment {
    id: number;
    task_id: number;
    user_id: number;
    comment: string;
    created_at: string;
    updated_at: string;
    user: User;
}

export interface TaskStatistics {
    total: number;
    todo: number;
    inProgress: number;
    inReview: number;
    done: number;
    overdue: number;
    dueSoon: number;
}

export interface ProjectStatistics {
    total: number;
    planning: number;
    active: number;
    onHold: number;
    completed: number;
    cancelled: number;
}

export interface Notification {
    id: number;
    user_id: number;
    title: string;
    message: string;
    type: 'task_assigned' | 'task_due' | 'project_update' | 'comment_added';
    read_at?: string;
    data?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface TeamMember {
    id: number;
    user: User;
    project_id: number;
    role: 'member' | 'manager' | 'viewer';
    joined_at: string;
}

export interface ActivityLog {
    id: number;
    user: User;
    action: string;
    description: string;
    model_type: 'project' | 'task' | 'comment';
    model_id: number;
    changes?: Record<string, { old: any; new: any }>;
    created_at: string;
}

