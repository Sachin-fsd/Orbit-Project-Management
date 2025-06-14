import { ProjectStatus } from '@/types';
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters long"),
});

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters long"),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(5, "Password must be at least 5 characters long"),
  confirmPassword: z.string().min(5, "Password must be at least 5 characters long"),

}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const workspaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  description: z.string().optional(),
});


export const projectSchema = z.object({
  title: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  startDate: z.string(),
  dueDate: z.string(),
  members: z.array(z.object({ user: z.string(), role: z.enum(["manager", "contributor", "viewer"]) })).min(1, "Members are required"),
  tags: z.string().optional(),
});


export const createTaskSchema = z.object({
  title: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Done"]),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["Low", "Medium", "High"]),
  assignees: z.array(z.string()).min(1, "Assignees are required"),
});

export const inviteMemberSchema = z.object({
    email: z.string().email('Invalid email address'),
    role: z.enum(['admin', 'member', 'viewer'])
});