import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    title: string;
}

const Button: React.FC<ButtonProps> = ({ onPress, title }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Button;
