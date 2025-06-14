import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from './auth-context';
import { ThemeProvider } from './theme-context';
import { PusherProvider } from './pusher-context';
// This file sets up the React Query provider for the application.

export const queryClient = new QueryClient();

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <PusherProvider>
                    <ThemeProvider>
                        {children}
                        <Toaster position="top-center" richColors />
                    </ThemeProvider>
                </PusherProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;
// This component wraps the application with the QueryClientProvider, allowing React Query to manage server state.