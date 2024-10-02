import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons"; // Icons
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from "@react-navigation/native";

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
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Image
          source={require("../assets/img/avt.jpg")} // Replace with your image path
          style={styles.profilePicture}
        />
        {/* Username */}
        <Text style={styles.userName}>John Doe</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Đăng kí</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.sectionItem}>
          <Ionicons name="mail-outline" size={24} color="#333" />
          <Text style={styles.sectionText}>john.doe@example.com</Text>
        </View>
        <View style={styles.sectionItem}>
          <Ionicons name="call-outline" size={24} color="#333" />
          <Text style={styles.sectionText}>+123 456 789</Text>
        </View>
        <View style={styles.sectionItem}>
          <Ionicons name="home-outline" size={24} color="#333" />
          <Text style={styles.sectionText}>dai hoc fpt</Text>
        </View>
      </View>

      {/* Mimi Headline Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bài bán hàng</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SellProduct')} style={styles.sectionItem}>
          <Text style={styles.sectionText}>Đăng bài bán</Text>
          <Feather name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ManageProduct')} style={styles.sectionItem}>
          <Text style={styles.sectionText}>Quản lý bài bán</Text>
          <Feather name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  headerSection: {
    alignItems: "center",
    backgroundColor: "#FF6F61",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  editButton: {
    marginTop: 16,
    backgroundColor: "#333",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
});

export default ProfileScreen;
