import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this dependency for icons

const ProfileScreen = () => {
    const menuItems = [
        { id: '1', title: 'Đăng xuất' },

    ];

    const renderItem = ({ item }: { item: { id: string; title: string; notificationCount?: number } }) => (
        <View style={styles.menuItem}>
            <Text style={styles.menuText}>{item.title}</Text>
            {item.notificationCount && (
                <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>{item.notificationCount}</Text>
                </View>
            )}
            <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>
    );

    return (
        <View style={styles.container}>

            <View style={styles.profileSection}>
                <Image
                    source={{ uri: 'https://your-profile-image-url.com' }} // Placeholder for profile image
                    style={styles.profilePicture}
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.greeting}>Chào</Text>
                    <Text style={styles.userName}>Gia Khánh</Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                    <Ionicons name="pencil" size={24} color="white" />
                </TouchableOpacity>
            </View>


            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="heart" size={32} color="white" />
                    <Text style={styles.actionButtonText}>Yêu thích</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="lock-closed" size={32} color="gray" />
                    <Text style={styles.actionButtonText}>Left Home</Text>
                </TouchableOpacity>


            </View>

            {/* Menu Items */}
            <FlatList
                data={menuItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.menuList}
            />





        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#0A2540',
    },
    profilePicture: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#fff',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 15,
    },
    greeting: {
        color: '#fff',
        fontSize: 18,
    },
    userName: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    editButton: {
        padding: 10,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: '#fff',
    },
    actionButton: {
        alignItems: 'center',
        backgroundColor: '#E74C3C',
        padding: 10,
        borderRadius: 10,
    },
    actionButtonText: {
        marginTop: 10,
        fontSize: 14,
        color: '#fff',
    },
    menuList: {
        marginVertical: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuText: {
        fontSize: 18,
    },
    notificationBadge: {
        backgroundColor: 'red',
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    notificationText: {
        color: '#fff',
        fontSize: 12,
    },
    signOutButton: {
        padding: 15,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    signOutText: {
        color: '#FF3B30',
        fontSize: 18,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
});

export default ProfileScreen;
