import React from "react";
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

type RootStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Login: undefined;
  Register: undefined;
  SellProduct: undefined;
  ManageProduct: undefined;
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  return (
    <View style={ProfileStyle.container}>
      <StatusBar backgroundColor="#5a61c9" barStyle="light-content" />
      <ScrollView>
        {/* Header Section */}
        <View style={ProfileStyle.headerSection}>
          <Image
            source={require("../assets/img/avt.jpg")}
            style={ProfileStyle.profilePicture}
          />
          <Text style={ProfileStyle.userName}>John Doe 123</Text>
        </View>

        {/* Action Buttons */}
        <View style={ProfileStyle.actionButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={ProfileStyle.actionButton}
          >
            <Text style={ProfileStyle.actionButtonText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
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
        </View>

        {/* Contact Section */}
        <View style={ProfileStyle.section}>
          <Text style={ProfileStyle.sectionTitle}>Liên lạc</Text>
          <View style={ProfileStyle.card}>
            <View style={ProfileStyle.sectionItem}>
              <Ionicons name="mail-outline" size={24} color="#5a61c9" />
              <Text style={ProfileStyle.sectionText}>john.doe@example.com</Text>
            </View>
            <View style={ProfileStyle.sectionItem}>
              <Ionicons name="call-outline" size={24} color="#5a61c9" />
              <Text style={ProfileStyle.sectionText}>+123 456 789</Text>
            </View>
            <View style={ProfileStyle.sectionItem}>
              <Ionicons name="home-outline" size={24} color="#5a61c9" />
              <Text style={ProfileStyle.sectionText}>dai hoc fpt</Text>
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