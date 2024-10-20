import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    bidContainer: {
        marginBottom: 12,
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    bidderText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    amountText: {
        color: '#4CAF50',
        fontSize: 14,
    },
    timeText: {
        color: '#888',
        fontSize: 12,
    },
});

