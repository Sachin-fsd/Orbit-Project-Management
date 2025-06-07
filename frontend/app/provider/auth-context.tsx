import type { User } from '@/routes/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { queryClient } from './react-query-provider';
import { useLocation, useNavigate } from 'react-router';
import { publicRoutes } from '@/lib';
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (data : any) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const navigate = useNavigate();
    const currentPath = useLocation().pathname;
    const isPublicRoute = publicRoutes.includes(currentPath);

    useEffect(()=>{
        const checkAuth = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const userInfo = localStorage.getItem('user');
            if (token && userInfo) {
                setIsAuthenticated(true);
                setUser(JSON.parse(localStorage.getItem('user') || '{}'));
                // if (isPublicRoute) {
                    navigate('/dashboard');
                // }
            } else {
                setIsAuthenticated(false);
                setUser(null);
                if (!isPublicRoute) {
                    navigate('/sign-in');
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    },[])

    useEffect(() => {
       const handleLogout = () => {
           logout();
           navigate('/sign-in');
       }
       window.addEventListener("force-logout", handleLogout);
       return () => {
           window.removeEventListener("force-logout", handleLogout);
       }
    }, []);

    const login = async (data: any) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
    };

    const logout = async () => {
        console.log('Logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/sign-in');
        queryClient.clear();
    };

    const values = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
    }

    return (
        <AuthContext.Provider
            value={values}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};