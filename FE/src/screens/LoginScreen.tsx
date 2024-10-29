import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from "../context/AuthContext";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
// import { RootStackParamList } from "../navigation/RootNavigator";

import { styles } from '../styles/LoginScreenStyles';
import { RootStackParamList } from "../navigation/RootNavigator";
import { LinearGradient } from "expo-linear-gradient";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
// type RootStackParamList = {
//   Profile: undefined;
//   Register: undefined;
//   Login: undefined;
//   // Add other screen names and their param types here
// };

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
}

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<any>();

  useEffect(() => {
    console.log('route', route)
  }, [])

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      if (response?.status === 'success') {
        const returnTo = route.params?.returnTo;
        const returnParams = route.params?.params;
        if (returnTo) {
          // Xử lý điều hướng sau đăng nhập
          switch (returnTo) {
            // Các tab screens
            case 'Home':
            case 'Orders':
            case 'Notifications':
            case 'Profile':
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'MainTabs',
                    state: {
                      routes: [{ name: returnTo }],
                    },
                  },
                ],
              });
              break;

            // Các stack screens
            case 'OrderDetail':
            case 'Checkout':
            case 'EditProfile':
            case 'SellProduct':
            case 'ManageProduct':
            case 'ChooseOrderAddress':
            case 'AddAddress':
              navigation.reset({
                index: 1,
                routes: [
                  { name: 'MainTabs' },
                  {
                    name: returnTo,
                    params: returnParams
                  },
                ],
              });
              break;

            default:
              // Mặc định về MainTabs
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
          }
        } else {
          // Không có returnTo, về MainTabs
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      // Thêm xử lý hiển thị lỗi cho người dùng ở đây
    }
  };

  const handleBackPress = () => {
    // Không có returnTo, thực hiện goBack bình thường
    navigation.goBack();
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={['#8061e0', '#ae9edf']} style={styles.backgroundLinearGradient}
      />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Image
          source={require('../../assets/splashDaisy.png')}
          style={styles.logo}
        />
        <Text style={styles.slogan}>Kết nối nở rộ, từng cánh hoa một</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#006400" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#666"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#006400" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.footerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
