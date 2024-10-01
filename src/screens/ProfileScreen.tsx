import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icons
import Button from "../components/Button";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Profile: undefined;
  Register: undefined;
  Login: undefined;
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.profileSection}>
        <Image
          source={require("../assets/img/kem.png")}
          style={styles.profilePicture}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.greeting}>Chào</Text>
          <Text style={styles.userName}>Gia Khánh</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => {}}>
          <Ionicons name="pencil" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>Số điện thoại: 0123 456 789</Text>
        <Text style={styles.infoText}>Địa chỉ: Hồ Chí Minh</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Đăng nhập"
          onPress={() => navigation.navigate('Login')}
          color="#6200EE"
          style={styles.actionButton}
        />
      </View>

      {/* Register Button */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0A2540",
    elevation: 2, // M3 uses shadows and elevation
    borderBottomStartRadius: 16,
    borderBottomEndRadius: 16,
  },
  profilePicture: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  greeting: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400", // M3 regular font weight
  },
  userName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600", // M3 medium weight for headings
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
    color: "#333",
    marginBottom: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  actionButton: {
    marginVertical: 8,
    borderRadius: 28, // M3's more rounded button style
    paddingVertical: 12,
  },
  registerButton: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  registerText: {
    color: '#6200EE',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
