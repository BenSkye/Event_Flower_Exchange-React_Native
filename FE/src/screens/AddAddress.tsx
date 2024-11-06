import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { addAddress } from '../services/address';

const AddAddress = () => {
    const navigation = useNavigation();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const handleComplete = async () => {
        if (!name || !phone || !address || !selectedAddress) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }
        console.log('name', name);
        console.log('phone', phone);
        console.log('address', selectedAddress + ',' + address);
        const response = await addAddress({ name, phone, address: selectedAddress + ',' + address });
        console.log('response', response);
        if (response.status === 'success') {
            navigation.goBack();
        }
    }


    return (
        <ScrollView style={styles.container}>


            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Liên hệ</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Họ và Tên"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Số điện thoại"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={phone}
                    onChangeText={setPhone}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Địa chỉ</Text>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('AddressPicker', { onSelect: setSelectedAddress });
                }}>
                    <View style={styles.input}>
                        <Text style={{ color: '#999', fontSize: 16 }}>
                            {selectedAddress ? selectedAddress : 'Tỉnh/Thành phố, Quận/Huyện, Phường/Xã'}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Tên đường, Tòa nhà, Số nhà"
                    placeholderTextColor="#999"
                    value={address}
                    onChangeText={setAddress}
                />
            </View>

            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                <Text style={styles.completeButtonText}>HOÀN THÀNH</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    section: {
        marginVertical: 16,
    },
    sectionTitle: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    addressTypeText: {
        fontSize: 16,
    },
    typeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#ccc',
        marginHorizontal: 4,
    },
    typeButtonActive: {
        backgroundColor: '#FF4C29',
        borderColor: '#FF4C29',
    },
    typeButtonText: {
        fontSize: 16,
        color: '#333',
    },
    typeButtonTextActive: {
        color: '#fff',
    },
    completeButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    completeButtonText: {
        fontSize: 16,
        color: '#fff',
    },
});

export default AddAddress;
