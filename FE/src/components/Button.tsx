import React from 'react';
import { Text, TouchableOpacity, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
interface ButtonProps {
    onPress: () => void;
    title: string;
    color?: string; // Tùy chọn để chỉ định màu nền
    style?: StyleProp<ViewStyle>; // Thêm thuộc tính style để tùy chỉnh style cho button
    icon?: string; // Tùy chọn để thêm icon cho button
}

const Button: React.FC<ButtonProps> = ({ onPress, title, color = '#5a61c9', style, icon }) => (
    <TouchableOpacity
        style={[styles.button, { backgroundColor: color }, style]} // Kết hợp style của button với props.style
        onPress={onPress}
    >
        <Text style={styles.text}>{title}  {icon && <AntDesign name={icon} size={24} color="white" />}</Text>

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
        justifyContent: 'center',
    },
});

export default Button;
