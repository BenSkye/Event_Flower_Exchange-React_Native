import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { getOrderbyOrdercode } from '../services/order';

const OrderDetail = ({ route }: { route: any }) => {
    const { orderCode, pageBack } = route.params;
    const navigation = useNavigation();
    const [orderDetails, setOrderDetails] = useState<any>(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => {
                    if (pageBack) {
                        navigation.navigate(pageBack as never);
                    } else {
                        navigation.goBack();
                    }
                }}>
                    <Icon name="arrow-back" size={24} color='#FFFFFF' style={{ marginLeft: 10 }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, pageBack]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const details = await getOrderbyOrdercode(orderCode);
                setOrderDetails(details);
            } catch (error) {
                console.error('Failed to fetch order details:', error);
            }
        };

        fetchOrderDetails();
    }, [orderCode]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Order Details</Text>
            {orderDetails ? (
                <View style={styles.detailsContainer}>
                    <Text style={styles.label}>Order Code:</Text>
                    <Text style={styles.value}>{orderDetails.orderCode}</Text>
                    <Text style={styles.label}>Price:</Text>
                    <Text style={styles.value}>{orderDetails.price}</Text>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={styles.value}>{orderDetails.status}</Text>
                    <View style={styles.flowerContainer}>
                        <Text style={styles.subHeader}>Flower Details</Text>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{orderDetails.flowerId.name}</Text>
                        <Text style={styles.label}>Description:</Text>
                        <Text style={styles.value}>{orderDetails.flowerId.description}</Text>
                        <Image
                            source={{ uri: orderDetails.flowerId.images[0] }}
                            style={styles.flowerImage}
                        />
                    </View>
                </View>
            ) : (
                <Text style={styles.loadingText}>Loading...</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    detailsContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
    flowerContainer: {
        marginTop: 20,
    },
    flowerImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 10,
    },
    loadingText: {
        fontSize: 18,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default OrderDetail;