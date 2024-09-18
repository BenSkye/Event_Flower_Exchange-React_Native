import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const { login } = useAuth();

    const handleLogin = () => {
        login(username);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default LoginScreen;
