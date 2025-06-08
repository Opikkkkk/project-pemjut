// types/project.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  leader_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;

  // Relationships
  leader?: User;
  created_by_user?: User;
  members?: User[];
  tasks?: Task[];

  // Additional computed properties
  selected_member_ids?: number[];
  tasks_count?: number;
  members_count?: number;
  members_names?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  due_date?: string;
  project_id: number;
  assigned_to_id?: number;
  created_by: number;
  created_at: string;
  updated_at: string;

  // Relationships
  project?: Project;
  assigned_to?: User;
  created_by_user?: User;
}

export interface ProjectFormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  leader_id: number | string;
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
  auth: AuthUser;
}

// Task related interfaces
export interface TaskFormData {
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  due_date?: string;
  project_id: number;
  assigned_to_id?: number;
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
export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Done';
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
