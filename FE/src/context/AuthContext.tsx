import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleNotification } from '../utils/handleNotification';

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

    useEffect(() => {
        checkToken();
    }, []);

    useEffect(() => {
        if (isLoggedIn && user) {
            handleNotification(user);
        }
    }, [user, isLoggedIn]);

    const checkToken = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log('token', token)
        if (token) {
            const response = await apiClient.get('/user/personal-information');
            console.log('response35', response.data)
            setUser(response.data.data.personal);
            setIsLoggedIn(true);
        }
    }

    const login = async (userEmail: string, password: string) => {
        console.log('Logging in with:', userEmail, password);
        const response = await apiClient.post('/auth/login', { userEmail, password });
        console.log('response', response.data)
        setUser(response.data.data.user)
        AsyncStorage.setItem('token', response.data.data.token)
        if (response.data.status === 'success') {
            setIsLoggedIn(true);
            return response.data
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
