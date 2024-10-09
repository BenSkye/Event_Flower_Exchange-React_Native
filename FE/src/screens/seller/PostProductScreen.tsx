import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from '../../utils/firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PostProduct = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [uploading, setUploading] = useState(false);
  const scrollViewRef = useRef<ScrollView>();

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const uploadImages = async (uris) => {
    const uploadPromises = uris.map(async (uri) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const storageRef = ref(storage, `products/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            // You can use this to show upload progress if needed
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    if (!name || !type || !description || images.length === 0 || !condition || !price) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin và chọn ít nhất một hình ảnh");
      return;
    }

    setUploading(true);
    try {
      const imageUrls = await uploadImages(images);
      const docRef = await addDoc(collection(db, "products"), {
        name,
        type,
        description,
        imageUrls,
        condition,
        price: parseFloat(price),
        createdAt: new Date()
      });
      console.log("Document written with ID: ", docRef.id);
      Alert.alert("Thành công", "Sản phẩm đã được đăng bán");
      // Reset form
      setName('');
      setType('');
      setDescription('');
      setImages([]);
      setCondition('');
      setPrice('');
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Lỗi", "Không thể đăng bán sản phẩm. Vui lòng thử lại sau.");
    }
    setUploading(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#5a61c9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng bán hoa</Text>
      </View>
      <ScrollView 
        style={styles.container}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        <Text style={styles.label}>Tên hoa</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập tên hoa"
        />

        <Text style={styles.label}>Loại hoa</Text>
        <Picker
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Chọn loại hoa" value="" />
          <Picker.Item label="Hoa hồng" value="rose" />
          <Picker.Item label="Hoa cúc" value="daisy" />
          <Picker.Item label="Hoa lan" value="orchid" />
        </Picker>

        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Nhập mô tả hoa"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Hình ảnh</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
          <Text>Chọn hình ảnh</Text>
        </TouchableOpacity>
        <FlatList
          data={images}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.label}>Tình trạng</Text>
        <Picker
          selectedValue={condition}
          onValueChange={(itemValue) => setCondition(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Chọn tình trạng" value="" />
          <Picker.Item label="Mới" value="new" />
          <Picker.Item label="Đã sử dụng" value="used" />
        </Picker>

        <Text style={styles.label}>Giá</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Nhập giá"
          keyboardType="numeric"
          onFocus={() => {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, uploading && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>{uploading ? 'Đang xử lý...' : 'Đăng bán'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5a61c9',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#5a61c9',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imagePicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#5a61c9',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5a61c9',
    marginLeft: 10,
  },
});

export default PostProduct;