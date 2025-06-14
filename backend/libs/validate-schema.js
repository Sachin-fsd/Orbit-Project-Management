import { z } from "zod";


const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(5, 'Password must be at least 5 characters long')
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(5, 'Password must be at least 5 characters long')
});

const verifyEmailSchema = z.object({
    token: z.string().min(1, 'Token is required')
});

const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z.string().min(5, 'Password must be at least 5 characters long'),
    confirmPassword: z.string().min(5, 'Password must be at least 5 characters long')
});

const emailSchema = z.object({
    email: z.string().email('Invalid email address')
});

const workspaceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    color: z.string().min(1, 'Color is required'),
    description: z.string().optional(),
});

const inviteMemberSchema = z.object({
    email: z.string().email('Invalid email address'),
    role: z.enum(["admin", "member", "viewer"])
});

const projectSchema = z.object({
    title: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    status: z.enum(['PLANNING', 'IN PROGRESS', 'ON HOLD', 'COMPLETED', 'CANCELLED']),
    startDate: z.string(),
    dueDate: z.string().optional(),
    members: z.array(z.object({ user: z.string(), role: z.enum(["contributor", "manager", "viewer"]) })).optional(),
    tags: z.string().optional(),
});

const taskSchema = z.object({
    title: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    status: z.enum(['To Do', 'In Progress', 'Review', 'Done']),
    priority: z.enum(['Low', 'Medium', 'High']),
    assignees: z.array(z.string()).min(1, 'Assignees are required'),
    dueDate: z.string().min(1, 'Due date is required'),
})

export { 
    registerSchema, 
    loginSchema, 
    verifyEmailSchema, 
    resetPasswordSchema, 
    emailSchema, 
    workspaceSchema, 
    projectSchema, 
    taskSchema,
    inviteMemberSchema 

};