import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleNotification } from '../utils/handleNotification';
import { useAuth } from './AuthContext';

interface AddressContextType {
    selectedAddress: any;
    changeAddress: any
}

export const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const { user } = useAuth();
    const [selectedAddress, setSelectedAddress] = useState<any>(null);

    useEffect(() => {
        getAddress();
    }, [user]);

    const getAddress = async () => {
        const response = await apiClient.get('/address/get-personal-address');
        console.log('addressresponse', response.data);
        setSelectedAddress(response.data.information[0]);
    }

    const changeAddress = async (address: any) => {
        setSelectedAddress(address);
    }

    return (
        <AddressContext.Provider value={{ selectedAddress, changeAddress }}>
            {children}
        </AddressContext.Provider>
    );
};

export const useAddress = () => {
    const context = useContext(AddressContext);
    if (!context) {
        throw new Error('useAddress must be used within an AddressProvider');
    }
    return context;
};
