import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity, Image, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../utils/firebase/firebase';
import { getFlowerById, updateFlowerById } from '../../services/flower';
import PostProductStyle from '../../styles/PostProductStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatInputPrice } from '../../utils';

interface RouteParams {
    productId: string;
}

const EditProductScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { productId } = route.params as RouteParams;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [price, setPrice] = useState('');
    const [freshness, setFreshness] = useState('fresh');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            setIsLoading(true);
            const product = await getFlowerById(productId);
            setName(product.name);
            setDescription(product.description);
            setImages(product.images);
            setPrice(product.fixedPrice?.toString() || '');
            setFreshness(product.freshness);
        } catch (error) {
            console.error('Error fetching product details:', error);
            Alert.alert('Lỗi', 'Không thể tải thông tin sản phẩm');
        } finally {
            setIsLoading(false);
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setIsLoading(true);
                const uploadedUrls = await uploadImages(result.assets.map(asset => asset.uri));
                setImages([...images, ...uploadedUrls]);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Lỗi', 'Không thể tải ảnh lên');
            setIsLoading(false);
        }
    };

    const uploadImages = async (uris: string[]) => {
        const uploadPromises = uris.map(async (uri) => {
            const response = await fetch(uri);
            const blob = await response.blob();
            const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
            const storageRef = ref(storage, `products/${filename}`);

            return new Promise<string>((resolve, reject) => {
                const uploadTask = uploadBytesResumable(storageRef, blob);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                    },
                    (error) => {
                        console.error("Upload error:", error);
                        reject(error);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(downloadURL);
                        } catch (error) {
                            console.error("Get download URL error:", error);
                            reject(error);
                        }
                    }
                );
            });
        });

        try {
            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error("Error uploading images:", error);
            throw error;
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const validateForm = () => {
        if (!name.trim()) {
            setErrorMessage('Vui lòng nhập tên sản phẩm');
            return false;
        }
        if (!description.trim()) {
            setErrorMessage('Vui lòng nhập mô tả sản phẩm');
            return false;
        }
        if (images.length === 0) {
            setErrorMessage('Vui lòng thêm ít nhất một ảnh');
            return false;
        }
        if (!price || Number(price) <= 0) {
            setErrorMessage('Vui lòng nhập giá hợp lệ');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        try {
            if (!validateForm()) {
                return;
            }

            setIsLoading(true);
            const updatedProduct = {
                name,
                description,
                images,
                fixedPrice: Number(price),
                freshness,
            };

            await updateFlowerById(productId, updatedProduct);
            Alert.alert('Thành công', 'Cập nhật sản phẩm thành công', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Error updating product:', error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật sản phẩm');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={PostProductStyle.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#5a61c9" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Chỉnh sửa sản phẩm</Text>
                </View>
            </View>

            <ScrollView style={styles.container}>
                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                <View style={styles.form}>
                    <TextInput
                        label="Tên sản phẩm"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            setErrorMessage('');
                        }}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Mô tả"
                        value={description}
                        onChangeText={(text) => {
                            setDescription(text);
                            setErrorMessage('');
                        }}
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        style={styles.input}
                    />

                    <Text style={styles.label}>Hình ảnh sản phẩm</Text>
                    <FlatList
                        data={images}
                        renderItem={({ item, index }) => (
                            <View style={styles.imageWrapper}>
                                <Image source={{ uri: item }} style={styles.image} />
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeImage(index)}
                                >
                                    <Ionicons name="close-circle" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        )}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        ListFooterComponent={() => (
                            images.length < 5 && (
                                <TouchableOpacity
                                    style={styles.addImageButton}
                                    onPress={pickImage}
                                    disabled={isLoading}
                                >
                                    <Ionicons name="add" size={40} color="#666" />
                                </TouchableOpacity>
                            )
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.imageContainer}
                    />

                    <TextInput
                        label="Giá bán"
                        value={formatInputPrice(price)}
                        onChangeText={(text) => {
                            setPrice(text.replace(/[^0-9]/g, ''));
                            setErrorMessage('');
                        }}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Độ tươi mới</Text>
                    <SegmentedButtons
                        value={freshness}
                        onValueChange={setFreshness}
                        buttons={[
                            { value: 'fresh', label: 'Mới' },
                            { value: 'slightly_wilted', label: 'Vừa' },
                            { value: 'wilted', label: 'Cũ' },
                            { value: 'expired', label: 'Hết hạn' },
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
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    form: {
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#666',
    },
    imageContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
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
        right: -10,
        top: -10,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 2,
    },
    addImageButton: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
    },
    errorText: {
        color: 'red',
        padding: 16,
        textAlign: 'center',
    },
    segmentedButtons: {
        marginBottom: 16,
    },
    submitButton: {
        marginTop: 16,
    },
});

export default EditProductScreen;