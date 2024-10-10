import React, { createContext, useState, useContext } from 'react';
import apiClient from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    isLoggedIn: boolean;
    login: (userEmail: string, password: string) => void; // Updated to accept password
    logout: () => void;
    user: any;
    register: (user: any) => Promise<any>; // Update the return type
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);

    const login = async (userEmail: string, password: string) => {
        console.log('Logging in with:', userEmail, password);
        const response = await apiClient.post('/auth/login', { userEmail, password });
        console.log('response', response.data)
        setUser(response.data.user)
        AsyncStorage.setItem('token', response.data.token)
        if (response.data.status === 'success') {
            setIsLoggedIn(true);
        } else {
            console.error('Invalid login attempt');
        }
    };

    const register = async (user: any) => {
        try {
            const response = await apiClient.post('/auth/register', user);
            console.log('Registration response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        AsyncStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user, register }}>
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
