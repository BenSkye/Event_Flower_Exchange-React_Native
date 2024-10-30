import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deletePushToken, handleNotification } from '../utils/handleNotification';

interface AuthContextType {
    isLoggedIn: boolean;
    login: (userEmail: string, password: string) => void; // Updated to accept password
    logout: () => void;
    user: any;
    register: (user: any) => Promise<any>; // Update the return type
    updateUser: (userData: any) => Promise<any>; // Thêm phương thức updateUser
    changePassword: (oldPassword: string, newPassword: string, confirmPassword: string) => Promise<any>; // Thêm phương thức changePassword
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

    const logout = async () => {
        const response = await deletePushToken();
        console.log('response69', response)
        if (response.status === 'success') {
            setIsLoggedIn(false);
            AsyncStorage.removeItem('token');
            setUser(null);
        }
    };

    const updateUser = async (userData: any) => {
        try {
            const response = await apiClient.put('/user/update', userData); // Gọi API update
            console.log('Update response:', response.data);
            setUser(response.data.data.user); // Cập nhật thông tin người dùng
            return response.data;
        } catch (error) {
            console.error('Update error:', error);
            throw error;
        }
    };

    const changePassword = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
        const response = await apiClient.patch('/auth/change-password', { 
            oldPassword, 
            newPassword,
            confirmPassword 
        });
        console.log('Change password response:', response.data);
        return response.data;
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user, register, updateUser, changePassword }}>
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
