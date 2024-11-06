import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import DetailScreen from '../screens/buyer/ProductDetail';
import Icon from 'react-native-vector-icons/Ionicons';
import OrdersScreen from '../screens/OrdersScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { StyleSheet, View } from 'react-native';
import RegisterScreen from '../screens/RegisterScreen';
import EditProfile from '../screens/EditProfile';
import ProductDetail from '../screens/buyer/ProductDetail';
import PostProduct from '../screens/seller/PostProductScreen';
import ManageProduct from '../screens/seller/ManageProductScreen';
import Checkout from '../screens/Checkout';
import ChooseOrderAddress from '../screens/ChooseOrderAddress';
import AddAddress from '../screens/AddAddress';
import AddressPicker from '../screens/AddressPicker';
import OrderDetail from '../screens/OrderDetail';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import EditProductScreen from '../screens/seller/EditProductScreen';
import ChangePassword from '../screens/ChangePassword';
import ManageOrder from '../screens/seller/ManageOrder';
import ChatScreen from '../screens/ChatScreen';
import ConversationListScreen from '../screens/ConversationListScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export type RootStackParamList = {
    MainTabs: undefined;
    HomeStack: undefined;
    HomeScreen: undefined;
    Detail: { id: string };
    Register: undefined;
    Profile: undefined;
    Login: {
        returnTo?: keyof RootStackParamList;
        params?: any;
    };
    EditProfile: undefined;
    SellProduct: undefined;
    ManageProduct: undefined;
    Orders: undefined;
    Notifications: undefined;
    Checkout: { flowerId: string };
    ChooseOrderAddress: undefined;
    AddAddress: undefined;
    AddressPicker: undefined;
    OrderDetail: { orderCode: number, pageBack: string };
    ChangePassword: undefined;
    Chat: { conversationId: string, sellerId: string, buyerId: string };
}

const PROTECTED_SCREENS = [
    'Orders',
    'Notifications',
    'EditProfile',
    'SellProduct',
    'ManageProduct',
    'ChooseOrderAddress',
    'AddAddress',
    'OrderDetail',
    'Checkout',
    'Conversation'
];

// Material Design 3 color palette
const colors = {
    primary: '#4CAF50',
    secondary: '#4CAF50',
    background: '#4CAF50',
    surface: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
};


const TabNavigator = () => {
    const { isLoggedIn } = useAuth();
    const navigation = useNavigation<any>();

    const handleProtectedNavigation = (screenName: string) => {
        console.log('handleProtectedNavigation', screenName, isLoggedIn)
        if (!isLoggedIn && PROTECTED_SCREENS.includes(screenName)) {
            navigation.navigate('Login', {
                returnTo: screenName
            });
            return false; // Ngăn chặn navigation
        }
        return true; // Cho phép navigation
    };
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Orders') {
                        iconName = focused ? 'bag' : 'bag-outline';
                    } else if (route.name === 'Notifications') {
                        iconName = focused ? 'notifications' : 'notifications-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Conversation') {
                        iconName = focused ? 'chatbox' : 'chatbox-outline';
                    }

                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
                            <View
                                style={{
                                    position: 'absolute',
                                    width: '45%',
                                    top: -11,
                                    height: 5,
                                    backgroundColor: focused ? colors.primary : 'transparent',
                                    borderBottomLeftRadius: 15,
                                    borderBottomRightRadius: 15,
                                }}
                            />
                            <Icon name={iconName || ''} size={size} color={color} />
                        </View>
                    );
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: styles.tabBar,
                tabBarHideOnKeyboard: true,
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen}
            />
            <Tab.Screen name="Orders" component={OrdersScreen}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault(); // Ngăn chặn navigation mặc định
                        if (handleProtectedNavigation('Orders')) {
                            navigation.navigate('Orders');
                        }
                    },
                }}
                options={{
                    headerShown: true,
                    title: 'Đơn Hàng',
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.onPrimary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }} />
            <Tab.Screen name="Notifications" component={NotificationsScreen}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault(); // Ngăn chặn navigation mặc định
                        if (handleProtectedNavigation('Notifications')) {
                            navigation.navigate('Notifications');
                        }
                    },
                }}
                options={{
                    headerShown: true,
                    title: 'Thông Báo',
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.onPrimary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }} />
            <Tab.Screen name="Conversation" component={ConversationListScreen}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault(); // Ngăn chặn navigation mặc định
                        if (handleProtectedNavigation('Conversation')) {
                            navigation.navigate('Conversation');
                        }
                    },
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const withProtectedScreen = (WrappedComponent: React.ComponentType<any>, screenName: string) => {
    return (props: any) => {
        const { isLoggedIn } = useAuth();
        const navigation = useNavigation();

        if (!isLoggedIn) {
            // Sử dụng requestAnimationFrame để đảm bảo navigation diễn ra sau current frame
            requestAnimationFrame(() => {
                navigation.replace('Login', {
                    returnTo: screenName,
                    params: props.route.params
                });
            });
            // Return null để không render component gốc
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

const RootNavigator = () => {
    const { isLoggedIn } = useAuth();
    const navigation = useNavigation<any>();

    // Hàm kiểm tra và xử lý navigation cho màn hình được bảo vệ
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: colors.background }
            }}
        >
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="Detail" component={DetailScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="EditProduct" component={EditProductScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name='SellProduct' component={PostProduct} />
            <Stack.Screen name='ManageProduct' component={ManageProduct} />
            <Stack.Screen name='ManageOrder' component={ManageOrder} />
            <Stack.Screen
                name="Checkout"
                component={withProtectedScreen(Checkout, 'Checkout')}
                options={{
                    headerShown: true,
                    title: 'Thanh Toán',
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.onPrimary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleVisible: false,
                    headerBackImage: () => (
                        <Icon name="arrow-back" size={24} color={colors.onPrimary} style={{ marginLeft: 10 }} />
                    ),
                }}
            />
            <Stack.Screen name="ChooseOrderAddress" component={ChooseOrderAddress} options={{
                headerShown: true,
                title: 'Chọn địa chỉ nhận hàng',
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: colors.onPrimary,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <Icon name="arrow-back" size={24} color={colors.onPrimary} style={{ marginLeft: 10 }} />
                ),
            }} />
            <Stack.Screen name="AddAddress" component={AddAddress} options={{
                headerShown: true,
                title: 'Địa chỉ mới',
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: colors.onPrimary,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <Icon name="arrow-back" size={24} color={colors.onPrimary} style={{ marginLeft: 10 }} />
                ),
            }} />
            <Stack.Screen name="AddressPicker" component={AddressPicker} />
            <Stack.Screen name="OrderDetail" component={OrderDetail} options={{
                headerShown: true,
                title: 'Thông tin đơn hàng',
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: colors.onPrimary,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerBackTitleVisible: false
            }}
            />
            <Stack.Screen
                name='ChangePassword'
                component={ChangePassword}
                options={{
                    headerShown: true,
                    title: 'Đổi mật khẩu',
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTintColor: colors.onPrimary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitleVisible: false,
                    headerBackImage: () => (
                        <Icon name="arrow-back" size={24} color={colors.onPrimary} style={{ marginLeft: 10 }} />
                    ),
                }}
            />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        height: 60,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
        elevation: 8,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
    }
})

export default RootNavigator;
