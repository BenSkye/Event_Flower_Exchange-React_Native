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
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();
  const navigation = useNavigation<LoginScreenProps>();
  const route = useRoute<LoginScreenRouteProp>();

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Validate password
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    // Validate both fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    const response = await login(email, password);
    if (response?.status === 'success') {
      if (route.params?.returnTo) {
        navigation.navigate(route.params.returnTo as never);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }
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

        <View style={[
          styles.inputContainer, 
          emailError ? styles.inputContainerError : null
        ]}>
          <Ionicons name="mail-outline" size={24} color="#006400" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#666"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={[
          styles.inputContainer, 
          passwordError ? styles.inputContainerError : null
        ]}>
          <Ionicons name="lock-closed-outline" size={24} color="#006400" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
          />
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

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
