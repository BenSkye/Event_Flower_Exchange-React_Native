import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getPersonalAddress } from '../services/address';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAddress } from '../context/AddressContext';
import { RadioButton } from 'react-native-paper';
import Button from '../components/Button';

const ChooseOrderAddress = () => {
    const { selectedAddress, changeAddress } = useAddress();
    const [listAddress, setListAddress] = useState([]);
    const navigate = useNavigation();

    const fetchAddress = async () => {
        const response = await getPersonalAddress();
        console.log('response 11', response);
        setListAddress(response.information);
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchAddress();
        }, [])
    )
    const handleSelectAddress = (address: any) => {
        changeAddress(address);
        navigate.goBack();
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => handleSelectAddress(item)}>
            <View style={styles.addressItem}>
                <RadioButton
                    value={item._id}
                    status={selectedAddress?._id === item._id ? 'checked' : 'unchecked'}
                    onPress={() => handleSelectAddress(item)}
                />

                <View>

                    <Text style={styles.text}>{item.name} | {item.phone}</Text>
                    <Text style={styles.text}>{item.address}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            <FlatList
                data={listAddress}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                ListFooterComponent={
                    <Button title="Thêm địa chỉ mới" icon='pluscircleo' onPress={() => { navigate.navigate('AddAddress') }} />
                }
            />

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
    text: {
        fontSize: 16,
        color: '#909497',
        marginBottom: 4,
    },

})

export default ChooseOrderAddress;
