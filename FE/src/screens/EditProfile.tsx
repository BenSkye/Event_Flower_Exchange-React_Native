import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import EditProfileStyles from '../styles/EditProfileStyles';
import { useNavigation } from '@react-navigation/native';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.userName || '');
  const [phone, setPhone] = useState(user?.userPhone || '');
  const [address, setAddress] = useState(user?.userAddress || '');

  const navigation = useNavigation();
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleUpdateProfile = async () => {
    const updatedUser = {
      userName: username,
      userPhone: phone,
      userAddress: address,
    };

    await updateUser(updatedUser);
    
    navigation.navigate('Profile');
  };

  const handlePhoneChange = (text: string) => {
    // Chỉ cho phép số và giữ lại số 0 ở đầu
    const numericText = text.replace(/[^0-9]/g, '');
    // Giới hạn độ dài số điện thoại (ví dụ: 11 số)
    const truncatedText = numericText.slice(0, 11);
    setPhone(truncatedText);
  };

  return (
    <View style={EditProfileStyles.container}>
      <TouchableOpacity style={EditProfileStyles.backButton} onPress={handleBackPress}>
        <Text style={EditProfileStyles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={EditProfileStyles.title}>Edit Profile</Text>
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
