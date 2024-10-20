import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import EditProfileStyles from '../styles/EditProfileStyles'; // Nhập các kiểu
import { useNavigation } from '@react-navigation/native';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.userName || '');
  const [phone, setPhone] = useState(user?.userPhone || '');
  const [address, setAddress] = useState(user?.userAddress || '');
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const navigation = useNavigation();
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleUpdateProfile = async () => {
    let avatarUrl = user?.avatar; // Giữ nguyên avatar nếu không có avatar mới

    if (avatar) {
      const response = await fetch(avatar);
      const blob = await response.blob();
      const avatarRef = ref(storage, `avatar/${user?.userEmail}.jpg`);
      await uploadBytes(avatarRef, blob);
      avatarUrl = await getDownloadURL(avatarRef);
    }

    const updatedUser = {
      userName: username,
      userPhone: phone,
      userAddress: address,
      avatar: avatarUrl, // Sử dụng avatar thay vì userAvatar
    };

    await updateUser(updatedUser);
    
    // Điều hướng về màn hình ProfileScreen sau khi cập nhật thành công
    navigation.navigate('Profile');
  };

  const handlePhoneChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, ''); // Chỉ giữ lại số
    setPhone(numericText);
  };

  return (
    <View style={EditProfileStyles.container}>
      <TouchableOpacity style={EditProfileStyles.backButton} onPress={handleBackPress}>
        <Text style={EditProfileStyles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={EditProfileStyles.title}>Edit Profile</Text>
      <TouchableOpacity style={EditProfileStyles.avatarContainer} onPress={handleImagePicker}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={EditProfileStyles.avatar} />
        ) : (
          <Text>chọn ảnh đại diện</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={EditProfileStyles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={EditProfileStyles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={handlePhoneChange}
        keyboardType="numeric"
      />
      <TextInput
        style={EditProfileStyles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={EditProfileStyles.button} onPress={handleUpdateProfile}>
        <Text style={EditProfileStyles.buttonText}>Cập nhật thông tin</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfile;
