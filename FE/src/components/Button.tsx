import React from 'react';
import { Text, TouchableOpacity, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    title: string;
    color?: string; // Tùy chọn để chỉ định màu nền
    style?: StyleProp<ViewStyle>; // Thêm thuộc tính style để tùy chỉnh style cho button
}

const Button: React.FC<ButtonProps> = ({ onPress, title, color = '#4CAF50', style }) => (
    <TouchableOpacity
        style={[styles.button, { backgroundColor: color }, style]} // Kết hợp style của button với props.style
        onPress={onPress}
    >
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
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
