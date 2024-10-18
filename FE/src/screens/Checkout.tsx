import { useFocusEffect, useRoute } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { getFlowerById } from '../services/flower';
import { useAddress } from '../context/AddressContext';
import { formatPrice } from '../utils';
import AntDesign from '@expo/vector-icons/AntDesign';

const Checkout = () => {
    const { selectedAddress } = useAddress();
    const route = useRoute();
    const routeParams = route.params;
    const [flower, setFlower] = React.useState<any>(null);

    const fetchFlower = async () => {
        const response = await getFlowerById(routeParams.flowerId.toString());
        setFlower(response);
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchFlower();
        }, [routeParams, selectedAddress])
    );

    return (
        <View style={styles.wrapper}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.sectionAddress}>
                    <AntDesign name="enviromento" size={24} color="#5a61c9" style={styles.sallerIcon} />
                    <View>
                        <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
                        {selectedAddress ? (
                            <>
                                <Text style={styles.text}>{selectedAddress.name} | {selectedAddress.phone}</Text>
                                <Text style={styles.text}>{selectedAddress.address}</Text>
                            </>
                        ) : (
                            <Text style={styles.text}>Chưa có địa chỉ nhận hàng</Text>
                        )}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin sản phẩm</Text>
                    {flower ? (
                        <View style={styles.productRow}>
                            <Image source={{ uri: flower.images[0] }} style={styles.image} />
                            <View style={styles.productDetails}>
                                <Text style={styles.textName}>{flower.name}</Text>
                                {flower.saleType === 'fixed_price' && <Text style={styles.text}>{formatPrice(flower.fixedPrice)}</Text>}
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.text}>Đang tải thông tin sản phẩm...</Text>
                    )}
                </View>
            </ScrollView>

            <View style={styles.fixedBottom}>
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutText}>Đặt hàng</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        padding: 16,
        marginTop: 16,
        backgroundColor: '#f5f5f5',
        paddingBottom: 80, // To avoid overlap with the button
    },
    section: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionAddress: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        flexDirection: 'row',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    text: {
        fontSize: 16,
        color: '#909497',
        marginBottom: 4,
    },
    textName: {
        fontSize: 16,
        marginBottom: 4,
    },
    productRow: {
        flexDirection: 'row',
    },
    image: {
        width: '30%',
        height: 110,
        resizeMode: 'cover',
        borderRadius: 8,
        marginRight: 16,
    },
    productDetails: {
        flex: 1,
    },
    sallerIcon: {
        marginRight: 10,
    },
    fixedBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    checkoutButton: {
        backgroundColor: '#5a61c9',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Checkout;
