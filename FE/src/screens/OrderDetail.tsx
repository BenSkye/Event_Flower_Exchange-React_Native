import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OrderDetail = ({ route }: { route: any }) => {
    const { orderCode, pageBack } = route.params;
    const navigation = useNavigation();
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

    return (
        <View>
            <Text>Order Code: {orderCode}</Text>
        </View>
    );
}


const styles = StyleSheet.create({})

export default OrderDetail;
