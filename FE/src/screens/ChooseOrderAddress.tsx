import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getPersonalAddress } from '../services/address';
import { useFocusEffect } from '@react-navigation/native';
import { useAddress } from '../context/AddressContext';
import { RadioButton } from 'react-native-paper';
import Button from '../components/Button';

const ChooseOrderAddress = () => {
    const { selectedAddress, changeAddress } = useAddress();
    const [listAddress, setListAddress] = useState([]);

    const fetchAddress = async () => {
        const response = await getPersonalAddress();
        console.log('response 11', response);
        setListAddress(response.address.information);
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchAddress();
        }, [])
    )
    const handleSelectAddress = (address: any) => {
        changeAddress(address);
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => handleSelectAddress(item)}>
            <View style={styles.addressItem}>
                <RadioButton
                    value={item.id}
                    status={selectedAddress?._id === item._id ? 'checked' : 'unchecked'}
                    onPress={() => handleSelectAddress(item)}
                />
                <Text>{item.information}</Text>
            </View>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            <FlatList
                data={listAddress}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
            <Button title="Add Address" onPress={() => {/* Navigate to add address screen */ }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    addressItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
})

export default ChooseOrderAddress;
