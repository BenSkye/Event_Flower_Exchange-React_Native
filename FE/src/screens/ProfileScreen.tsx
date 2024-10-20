import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProfileStyle from '../styles/ProfileStyle';
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/RootNavigator";

type ProfileScreenProps = {
  navigate(arg0: string): void;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenProps>();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Log user information to check if avatar is updated
    console.log('Current user:', user);
  }, [user]); // This will run every time user changes

  return (
    <View style={ProfileStyle.container}>
      <StatusBar backgroundColor="#5a61c9" barStyle="light-content" />
      <ScrollView>
        {/* Header Section */}
        <View style={ProfileStyle.headerSection}>
          <Image
            source={{ uri: user?.avatar }} // Sử dụng avatar
            style={ProfileStyle.profilePicture}
          />
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
              <TouchableOpacity
                onPress={() => logout()}
                style={ProfileStyle.actionButton}
              >
                <Text style={ProfileStyle.actionButtonText}>Đăng xuất</Text>
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
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
