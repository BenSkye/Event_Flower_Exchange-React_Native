import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../utils/firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PostProductStyle from '../../styles/PostProductStyle';
import { getCategory, createFlower } from '../../services/flower';

const PostProduct = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [uploading, setUploading] = useState(false);
  const scrollViewRef = useRef<ScrollView>();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [saleType, setSaleType] = useState('fixed_price');
  const [startingPrice, setStartingPrice] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategory();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Lỗi", "Không thể tải danh mục hoa. Vui lòng thử lại sau.");
    }
  };

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
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
            // You can use this to show upload progress if needed
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

  const handleSubmit = async () => {
    if (!name || !categoryId || !description || images.length === 0 || !condition || !price) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin và chọn ít nhất một hình ảnh");
      return;
    }

    setUploading(true);
    try {
      const imageUrls = await uploadImages(images);
      const flowerData = {
        name,
        description,
        categoryId,
        images: imageUrls,
        saleType,
        status: "available",
        freshness: condition,
        ...(saleType === 'fixed_price' 
          ? { fixedPrice: parseFloat(price) }
          : { 
              startingPrice: parseFloat(startingPrice),
              startTime,
              endTime
            }
        )
      };

      const response = await createFlower(flowerData);
      console.log("Flower created with ID: ", response.id);
      Alert.alert("Thành công", "Hoa đã được đăng bán");
      // Reset form
      setName('');
      setType('');
      setDescription('');
      setImages([]);
      setCondition('');
      setPrice('');
    } catch (error) {
      console.error("Error creating flower: ", error);
      Alert.alert("Lỗi", "Không thể đăng bán hoa. Vui lòng thử lại sau.");
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={PostProductStyle.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={PostProductStyle.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5a61c9" />
        </TouchableOpacity>
        <Text style={PostProductStyle.headerTitle}>Đăng bán hoa</Text>
      </View>
      <ScrollView 
        style={PostProductStyle.container}
        ref={scrollViewRef as React.RefObject<ScrollView>}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        <Text style={PostProductStyle.label}>Tên hoa</Text>
        <TextInput
          style={PostProductStyle.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập tên hoa"
        />
        <Text style={PostProductStyle.label}>Mô tả</Text>
        <TextInput
          style={[PostProductStyle.input, PostProductStyle.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Nhập mô tả hoa"
          multiline
          numberOfLines={4}
        />

        <Text style={PostProductStyle.label}>Hình ảnh</Text>
        <TouchableOpacity style={PostProductStyle.imagePicker} onPress={pickImages}>
          <Text>Chọn hình ảnh</Text>
        </TouchableOpacity>
        <FlatList
          data={images}
          renderItem={({ item, index }) => (
            <View style={PostProductStyle.imageContainer}>
              <Image source={{ uri: item }} style={PostProductStyle.image} />
              <TouchableOpacity
                style={PostProductStyle.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close-circle" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <Text style={PostProductStyle.label}>Danh mục</Text>
        <Picker
          selectedValue={categoryId}
          onValueChange={(itemValue) => setCategoryId(itemValue)}
          style={PostProductStyle.picker}
        >
          <Picker.Item label="Chọn danh mục" value="" />
          {categories.map((category: any) => (
            <Picker.Item key={category._id} label={category.name} value={category._id} />
          ))}
        </Picker>

        <Text style={PostProductStyle.label}>Loại bán</Text>
        <Picker
          selectedValue={saleType}
          onValueChange={(itemValue) => setSaleType(itemValue)}
          style={PostProductStyle.picker}
        >
          <Picker.Item label="Giá cố định" value="fixed_price" />
          <Picker.Item label="Đấu giá" value="auction" />
        </Picker>

        {saleType === 'fixed_price' ? (
          <>
            <Text style={PostProductStyle.label}>Giá cố định</Text>
            <TextInput
              style={PostProductStyle.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Nhập giá cố định"
              keyboardType="numeric"
            />
          </>
        ) : (
          <>
            <Text style={PostProductStyle.label}>Giá khởi điểm</Text>
            <TextInput
              style={PostProductStyle.input}
              value={startingPrice}
              onChangeText={setStartingPrice}
              placeholder="Nhập giá khởi điểm"
              keyboardType="numeric"
            />
            <Text style={PostProductStyle.label}>Thời gian bắt đầu</Text>
            <TextInput
              style={PostProductStyle.input}
              value={startTime}
              onChangeText={setStartTime}
              placeholder="YYYY-MM-DD"
            />
            <Text style={PostProductStyle.label}>Thời gian kết thúc</Text>
            <TextInput
              style={PostProductStyle.input}
              value={endTime}
              onChangeText={setEndTime}
              placeholder="YYYY-MM-DD"
            />
          </>
        )}

        <Text style={PostProductStyle.label}>Độ tươi</Text>
        <Picker
          selectedValue={condition}
          onValueChange={(itemValue) => setCondition(itemValue)}
          style={PostProductStyle.picker}
        >
          <Picker.Item label="Chọn độ tươi" value="" />
          <Picker.Item label="Tươi" value="fresh" />
          <Picker.Item label="Hơi héo" value="slightly_wilted" />
          <Picker.Item label="Héo" value="wilted" />
          <Picker.Item label="Hết hạn" value="expired" />
        </Picker>

        <View style={PostProductStyle.buttonContainer}>
          <TouchableOpacity 
            style={[PostProductStyle.button, uploading && PostProductStyle.disabledButton]} 
            onPress={handleSubmit}
            disabled={uploading}
          >
            <Text style={PostProductStyle.buttonText}>{uploading ? 'Đang xử lý...' : 'Đăng bán'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PostProduct;
