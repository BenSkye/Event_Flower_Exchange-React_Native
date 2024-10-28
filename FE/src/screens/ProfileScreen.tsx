import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProfileStyle from '../styles/ProfileStyle';
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/RootNavigator";
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../utils/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import defaultAvatar from '../assets/img/avt.jpg';

type ProfileScreenProps = {
  navigate(arg0: string): void;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenProps>();
  const { user, updateUser, logout } = useAuth();

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      try {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const avatarRef = ref(storage, `avatar/${user?.userEmail}.jpg`);
        await uploadBytes(avatarRef, blob);
        const avatarUrl = await getDownloadURL(avatarRef);

        await updateUser({ avatar: avatarUrl });
        Alert.alert("Thành công", "Avatar đã được cập nhật");
      } catch (error) {
        console.error("Error updating avatar: ", error);
        Alert.alert("Lỗi", "Không thể cập nhật avatar. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <View style={ProfileStyle.container}>

      <ScrollView>
        {/* Header Section */}
        <View style={ProfileStyle.headerSection}>
          <TouchableOpacity onPress={handleImagePicker}>
            <Image
              source={user?.avatar ? { uri: user.avatar } : defaultAvatar}
              style={ProfileStyle.profilePicture}
            />
            <View style={ProfileStyle.editIconContainer}>
              <Feather name="edit-2" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={ProfileStyle.userName}>{user?.userName}</Text>
        </View>

        {/* Action Buttons */}
        <View style={ProfileStyle.actionButtons}>
          {!user ? ( // If user is not logged in
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={ProfileStyle.actionButton}
              >
                <Text style={ProfileStyle.actionButtonText}>Đăng nhập</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={ProfileStyle.actionButton}
              >
                <Text style={ProfileStyle.actionButtonText}>Đăng kí</Text>
              </TouchableOpacity>
            </>
          ) : ( // If user is logged in
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')}
                style={ProfileStyle.actionButton}
              >
                <Text style={ProfileStyle.actionButtonText}>Chỉnh sửa thông tin</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Contact Section */}
        <View style={ProfileStyle.section}>
          <Text style={ProfileStyle.sectionTitle}>Thông tin liên lạc</Text>
          <View style={ProfileStyle.card}>
            <View style={ProfileStyle.sectionItem}>
              <Ionicons name="mail-outline" size={24} color="#5a61c9" />
              <Text style={ProfileStyle.sectionText}>{user?.userEmail}</Text>
            </View>
            <View style={ProfileStyle.sectionItem}>
              <Ionicons name="call-outline" size={24} color="#5a61c9" />
              <Text style={ProfileStyle.sectionText}>{user?.userPhone}</Text>
            </View>
            <View style={ProfileStyle.sectionItem}>
              <Ionicons name="home-outline" size={24} color="#5a61c9" />
              <Text style={ProfileStyle.sectionText}>{user?.userAddress}</Text>
            </View>
          </View>
        </View>

        {/* Mimi Headline Section */}
        {user && ( // Kiểm tra nếu người dùng đã đăng nhập
          <View style={ProfileStyle.section}>
            <Text style={ProfileStyle.sectionTitle}>Bài bán hàng</Text>
            <View style={ProfileStyle.card}>
              <TouchableOpacity onPress={() => navigation.navigate('SellProduct')} style={ProfileStyle.sectionItem}>
                <Text style={ProfileStyle.sectionText}>Đăng bài bán</Text>
                <Feather name="chevron-right" size={24} color="#5a61c9" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ManageProduct')} style={ProfileStyle.sectionItem}>
                <Text style={ProfileStyle.sectionText}>Quản lý bài bán</Text>
                <Feather name="chevron-right" size={24} color="#5a61c9" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => logout()} style={ProfileStyle.sectionItem}>
                <Text style={ProfileStyle.sectionText}>Đăng xuất</Text>
                <Feather name="chevron-right" size={24} color="#5a61c9" />
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
