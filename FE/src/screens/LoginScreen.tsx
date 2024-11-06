import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
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
import { styles } from '../styles/LoginScreenStyles';
import { RootStackParamList } from "../navigation/RootNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<any>();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('savedEmail');
      const savedPassword = await AsyncStorage.getItem('savedPassword');
      const savedRememberPassword = await AsyncStorage.getItem('rememberPassword');

      if (savedEmail && savedPassword && savedRememberPassword === 'true') {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberPassword(true);
      }
    } catch (error) {
      console.log('Error loading credentials:', error);
    }
  };

  const handleLogin = async () => {
    try {
      setErrorMessage('');
      const response = await login(email, password);

      if (response?.status === 'success') {
        // Lưu thông tin đăng nhập nếu người dùng chọn ghi nhớ
        if (rememberPassword) {
          await AsyncStorage.setItem('savedEmail', email);
          await AsyncStorage.setItem('savedPassword', password);
          await AsyncStorage.setItem('rememberPassword', 'true');
        } else {
          // Xóa thông tin đã lưu nếu không chọn ghi nhớ
          await AsyncStorage.multiRemove(['savedEmail', 'savedPassword', 'rememberPassword']);
        }

        const returnTo = route.params?.returnTo;
        const returnParams = route.params?.params;
        if (returnTo) {
          switch (returnTo) {
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
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
          }
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        }
      } else {
        setErrorMessage(response?.message || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  }

  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '';
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTMwfHxGbG93ZXJ8ZW58MHx8MHx8fDA%3D' }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.welcomeText}>Chào mừng trở lại</Text>
            <Text style={styles.subText}>Đăng nhập vào tài khoản của bạn</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#2E7D32" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#2E7D32" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#2E7D32"
                />
              </TouchableOpacity>
            </View>

            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}

            <View style={styles.rememberContainer}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={[styles.checkbox, rememberPassword && styles.checkboxChecked]}
                  onPress={() => setRememberPassword(!rememberPassword)}
                >
                  {rememberPassword && <Ionicons name="checkmark" size={16} color="#2E7D32" />}
                </TouchableOpacity>
                <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                !isFormValid() && styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={!isFormValid()}
            >
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Bạn chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.signUpText}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;