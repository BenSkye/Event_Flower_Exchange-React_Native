import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface QuickLinkButtonProps {
    text: string;
    onPress: () => void;
}

const QuickLinkButton: React.FC<QuickLinkButtonProps> = ({ text, onPress }) => {
    return (
        <TouchableOpacity style={styles.quickLinkButton} onPress={onPress}>
            <Text style={styles.quickLinkText}>{text}</Text>
        </TouchableOpacity>
    );
};

export default QuickLinkButton;

const styles = StyleSheet.create({
    quickLinkButton: {
        backgroundColor: '#4caf50',
        padding: 12,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    quickLinkText: {
        fontSize: 14,
        color: '#fff',
    },
});
