import React, { createContext, useState, useContext } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    login: (username: string, password: string) => void; // Updated to accept password
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = (username: string, password: string) => {
        // Here, you can add your logic to validate the username and password
        console.log('Logging in with:', username, password);
        
        // For example purposes, let's just log in if the username is not empty
        if (username && password) {
            setIsLoggedIn(true);
            // Handle additional login logic (e.g., API calls)
        } else {
            console.error('Invalid login attempt');
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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
