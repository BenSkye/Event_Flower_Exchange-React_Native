import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ setSearch }: { setSearch: (search: string) => void }) => {
    const [searchText, setSearchText] = useState('');

    const handleSearchChange = (text: string) => {
        setSearchText(text);
        setSearch(text);
    };
    return (
        <View style={styles.header}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Enter search ..."
                    placeholderTextColor="#666"
                    onChangeText={handleSearchChange}
                />
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    searchIcon: {
        paddingLeft: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    cartButton: {
        padding: 5,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: -5,
        top: -5,
        backgroundColor: '#a9dfbf',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});