import React, { useState } from "react";
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

// type RootStackParamList = {
//   Profile: undefined;
//   Register: undefined;
//   Login: undefined;
//   // Add other screen names and their param types here
// };

type LoginScreenProps = {
  navigate(arg0: never): unknown;
  reset(arg0: { index: number; routes: { name: string; }[]; }): unknown;
  navigation: NativeStackNavigationProp<RootStackParamList, "Profile">;

};
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigation = useNavigation<LoginScreenProps>();
  const route = useRoute<LoginScreenRouteProp>();
  const handleLogin = async () => {
    const response = await login(email, password)
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={['#8061e0', '#ae9edf']} style={styles.backgroundLinearGradient}
      />

      <ScrollView contentContainerStyle={styles.scrollView}>

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
