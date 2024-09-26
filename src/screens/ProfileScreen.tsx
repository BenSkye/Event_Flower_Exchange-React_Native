import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install this dependency for icons
import Button from "../components/Button";
import RegisterScreen from "./RegisterScreen";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Profile: undefined;
  Register: undefined;
  Login: undefined;
  // Add other screen names and their param types here
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  
  return (
    <View style={styles.container}>
      {/* Header giữ từ code 2 */}
      <View style={styles.profileSection}>
        <Image
          source={require("../assets/img/kem.png")}
          style={styles.profilePicture}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.greeting}>Chào</Text>
          <Text style={styles.userName}>Gia Khánh</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Thông tin profile từ code 1 */}
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>Số điện thoại: 0123 456 789</Text>
        <Text style={styles.infoText}>Địa chỉ: Hồ Chí Minh</Text>
      </View>

      {/* Nút bấm từ code 1 */}
      <Button
        title="Chỉnh sửa profile"
        color="blue"
        onPress={() => {}}
        style={{ padding: 20, borderRadius: 10 }} // Tùy chỉnh thêm padding và borderRadius
      />
       <Button
        title="Đăng ký"
        color="red"
        onPress={() => navigation.navigate('Register')}
        style={{ padding: 20, borderRadius: 10 }} // Tùy chỉnh thêm padding và borderRadius
      />
      <Button
        title="Đăng nhập"
        color="red"
        onPress={() => navigation.navigate('Login')}
        style={{ padding: 20, borderRadius: 10 }} // Tùy chỉnh thêm padding và borderRadius
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0A2540",
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  greeting: {
    color: "#fff",
    fontSize: 18,
  },
  userName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  editButton: {
    padding: 10,
  },
  infoSection: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  menuList: {
    marginVertical: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 18,
  },
  notificationBadge: {
    backgroundColor: "red",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  notificationText: {
    color: "#fff",
    fontSize: 12,
  },
});

export default ProfileScreen;
