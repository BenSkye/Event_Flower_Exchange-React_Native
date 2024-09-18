import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
    return (
        <Stack.Navigator>
            {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    );
};

export default RootNavigator;
