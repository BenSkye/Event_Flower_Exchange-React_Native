import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface CategoryCardProps {
    title: string;
    image: any;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, image }) => {
    return (
        <View style={styles.categoryCard}>
            <Image source={image} style={styles.categoryImage} />
            <Text style={styles.categoryTitle}>{title}</Text>
        </View>
    );
};

export default CategoryCard;

const styles = StyleSheet.create({
    categoryCard: {
        width: 120,
        marginRight: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
    },
    categoryImage: {
        width: '100%',
        height: 80,
    },
    categoryTitle: {
        fontSize: 14,
        textAlign: 'center',
        padding: 8,
        color: '#444',
    },
});
