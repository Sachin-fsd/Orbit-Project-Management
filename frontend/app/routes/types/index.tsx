export interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    isEmailVerified: boolean;
    updatedAt: Date;
    profilePicture?: string;
}

export interface Workspace {
    _id: string;
    name: string;
    description: string;
    owner: User | string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    members: {
        user: User | string;
        role: "admin" | "member" | "owner" | "viewer";
        joinedAt: Date;
    };
}