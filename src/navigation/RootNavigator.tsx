import React from 'react';
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
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
);

const TabNavigator = () => (
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
                }


                return (
                    <View style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
                        <View
                            style={{
                                position: 'absolute',
                                width: '45%',
                                top: -11,
                                height: 5,
                                backgroundColor: focused ? '#235d3a' : 'transparent',
                                borderBottomLeftRadius: 15,
                                borderBottomRightRadius: 15,
                            }}
                        />
                        <Icon name={iconName || ''} size={size} color={color} />
                    </View>
                );
            },
            tabBarActiveTintColor: '#235d3a',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: styles.tabBar,
            headerShown: false,
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Orders" component={OrdersScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

const RootNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="HomeStack" component={HomeStack} />
    </Stack.Navigator>
);

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        backgroundColor: 'white',
        height: 60,

    }
})

export default RootNavigator;
