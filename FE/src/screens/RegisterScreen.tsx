import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import RegisterStyle from '../styles/RegisterStyle';

type RootStackParamList = {
  Profile: undefined;
  Register: undefined;
  Login: undefined;
};

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [password, setPassword] = useState('');

  const { register } = useAuth();

  const handleRegister = async () => {
    if (!userName || !userEmail || !password || !userPhone || !userAddress) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const userData = {
        userName,
        userEmail,
        userPhone,
        userAddress,
        avatar: '',
        password
      };

      const response = await register(userData);
      
      if (response.status === 'success') {
        Alert.alert('Success', 'Registration successful!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Error', response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An error occurred during registration. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={RegisterStyle.container}
    >
      <LinearGradient
        colors={['#a8e063', '#56ab2f']}
        style={RegisterStyle.gradient}
      >
        <ScrollView contentContainerStyle={RegisterStyle.scrollView}>
          <Text style={RegisterStyle.title}>Create Account</Text>

          <View style={RegisterStyle.inputContainer}>
            <Ionicons name="person-outline" size={24} color="#2e7d32" style={RegisterStyle.icon} />
            <TextInput
              style={RegisterStyle.input}
              placeholder="Full Name"
              placeholderTextColor="#333"
              value={userName}
              onChangeText={setUserName}
            />
          </View>

          <View style={RegisterStyle.inputContainer}>
            <Ionicons name="mail-outline" size={24} color="#2e7d32" style={RegisterStyle.icon} />
            <TextInput
              style={RegisterStyle.input}
              placeholder="Email Address"
              placeholderTextColor="#333"
              keyboardType="email-address"
              value={userEmail}
              onChangeText={setUserEmail}
            />
          </View>

          <View style={RegisterStyle.inputContainer}>
            <Ionicons name="call-outline" size={24} color="#2e7d32" style={RegisterStyle.icon} />
            <TextInput
              style={RegisterStyle.input}
              placeholder="Phone Number"
              placeholderTextColor="#333"
              keyboardType="phone-pad"
              value={userPhone}
              onChangeText={setUserPhone}
            />
          </View>

          <View style={RegisterStyle.inputContainer}>
            <Ionicons name="location-outline" size={24} color="#2e7d32" style={RegisterStyle.icon} />
            <TextInput
              style={RegisterStyle.input}
              placeholder="Address"
              placeholderTextColor="#333"
              value={userAddress}
              onChangeText={setUserAddress}
            />
          </View>

          <View style={RegisterStyle.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#2e7d32" style={RegisterStyle.icon} />
            <TextInput
              style={RegisterStyle.input}
              placeholder="Password"
              placeholderTextColor="#333"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={RegisterStyle.button} onPress={handleRegister}>
            <Text style={RegisterStyle.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;