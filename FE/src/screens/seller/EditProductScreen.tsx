import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, Chip } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getFlowerById, updateFlowerById } from '../../services/flower';
import PostProductStyle from '../../styles/PostProductStyle';

interface Product {
    _id: string;
    name: string;
    description: string;
    images: string[];
    saleType: string;
    price?: number;
    startPrice?: number;
    freshness: string;
}

const EditProductScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { productId } = route.params as { productId: string };

    const [product, setProduct] = useState<Product | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [saleType, setSaleType] = useState('fixed_price');
    const [price, setPrice] = useState('');
    const [startPrice, setStartPrice] = useState('');
    const [freshness, setFreshness] = useState('new');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            setIsLoading(true);
            const response = await getFlowerById(productId);
            setProduct(response);
            setName(response.name);
            setDescription(response.description);
            setImages(response.images);
            setSaleType(response.saleType);
            setPrice(response.price?.toString() || '');
            setStartPrice(response.startPrice?.toString() || '');
            setFreshness(response.freshness);
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const updatedProduct = {
                name,
                description,
                images,
                saleType,
                price: saleType === 'fixed_price' ? Number(price) : undefined,
                startPrice: saleType === 'auction' ? Number(startPrice) : undefined,
                freshness,
            };

            await updateFlowerById(productId, updatedProduct);
            navigation.goBack();
        } catch (error) {
            console.error('Error updating product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={PostProductStyle.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#5a61c9" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chỉnh sửa bài đăng</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    label="Tên sản phẩm"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    label="Mô tả"
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                />

                <Text style={styles.label}>Hình ảnh sản phẩm</Text>
                <View style={styles.imageContainer}>
                    {images.map((uri, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image source={{ uri }} style={styles.image} />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeImage(index)}
                            >
                                <Ionicons name="close-circle" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {images.length < 5 && (
                        <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                            <Ionicons name="add" size={40} color="#5a61c9" />
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.label}>Hình thức bán</Text>
                <SegmentedButtons
                    value={saleType}
                    onValueChange={setSaleType}
                    buttons={[
                        { value: 'fixed_price', label: 'Giá cố định' },
                        { value: 'auction', label: 'Đấu giá' },
                    ]}
                    style={styles.segmentedButtons}
                />

                {saleType === 'fixed_price' ? (
                    <TextInput
                        label="Giá bán"
                        value={price}
                        onChangeText={setPrice}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                    />
                ) : (
                    <TextInput
                        label="Giá khởi điểm"
                        value={startPrice}
                        onChangeText={setStartPrice}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                    />
                )}

                <Text style={styles.label}>Độ tươi mới</Text>
                <SegmentedButtons
                    value={freshness}
                    onValueChange={setFreshness}
                    buttons={[
                        { value: 'new', label: 'Mới' },
                        { value: 'medium', label: 'Trung bình' },
                        { value: 'old', label: 'Cũ' },
                    ]}
                    style={styles.segmentedButtons}
                />

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Cập nhật
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    form: {
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    imageWrapper: {
        position: 'relative',
        margin: 4,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    addImageButton: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#5a61c9',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
    },
    segmentedButtons: {
        marginBottom: 16,
    },
    submitButton: {
        marginTop: 16,
    },
});

export default EditProductScreen;