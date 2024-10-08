import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
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
    <View style={styles.container}>
      <StatusBar backgroundColor="#5a61c9" barStyle="light-content" />
      <ScrollView>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image
            source={require("../assets/img/avt.jpg")}
            style={styles.profilePicture}
          />
          <Text style={styles.userName}>John Doe</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Đăng kí</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.card}>
            <View style={styles.sectionItem}>
              <Ionicons name="mail-outline" size={24} color="#5a61c9" />
              <Text style={styles.sectionText}>john.doe@example.com</Text>
            </View>
            <View style={styles.sectionItem}>
              <Ionicons name="call-outline" size={24} color="#5a61c9" />
              <Text style={styles.sectionText}>+123 456 789</Text>
            </View>
            <View style={styles.sectionItem}>
              <Ionicons name="home-outline" size={24} color="#5a61c9" />
              <Text style={styles.sectionText}>dai hoc fpt</Text>
            </View>
          </View>
        </View>

        {/* Mimi Headline Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bài bán hàng</Text>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate('SellProduct')} style={styles.sectionItem}>
              <Text style={styles.sectionText}>Đăng bài bán</Text>
              <Feather name="chevron-right" size={24} color="#5a61c9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ManageProduct')} style={styles.sectionItem}>
              <Text style={styles.sectionText}>Quản lý bài bán</Text>
              <Feather name="chevron-right" size={24} color="#5a61c9" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerSection: {
    alignItems: "center",
    backgroundColor: "#5a61c9",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  userName: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 8,
  },
  actionButton: {
    backgroundColor: "#03DAC6",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 2,
  },
  actionButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#5a61c9",
    marginBottom: 8,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 1,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sectionText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 16,
    flex: 1,
  },
});

export default ProfileScreen;