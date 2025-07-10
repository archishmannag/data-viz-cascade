import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/lib/axios';

interface User {
    user_id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User, token: string) => void;
    logout: () => Promise<void>;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for stored auth data on initialization
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_data');

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
            }
        }
    }, []);

    const login = (userData: User, authToken: string) => {

        setUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);

        // Store in localStorage
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('user_data', JSON.stringify(userData));
    };

    const logout = async () => {
        // Call signout endpoint if token exists
        if (token) {
            try {
                await axios.post('/auth/signout', {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
            } catch (error) {
                console.error('Error during signout:', error);
                // Continue with logout even if signout API fails
            }
        }

        // Clear local state and storage
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);

        // Remove from localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    };

    const value = {
        user,
        isAuthenticated,
        login,
        logout,
        token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
