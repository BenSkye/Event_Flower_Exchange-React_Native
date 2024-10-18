import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, Alert, ScrollView, StatusBar, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/RegisterScreenStyles'; // Import the styles

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
      style={styles.container} // Use the container style
    >
      <LinearGradient
        colors={['#8061e0', '#ae9edf']} 
        style={styles.backgroundLinearGradient} // Use the background style
      />
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <StatusBar backgroundColor="#5a61c9" barStyle="light-content" />
          <Image
            source={require('../../assets/splashDaisy.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Create Account</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input} // Use the input style
              placeholder="Full Name"
              placeholderTextColor="#333"
              value={userName}
              onChangeText={setUserName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input} // Use the input style
              placeholder="Email Address"
              placeholderTextColor="#333"
              keyboardType="email-address"
              value={userEmail}
              onChangeText={setUserEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input} // Use the input style
              placeholder="Phone Number"
              placeholderTextColor="#333"
              keyboardType="phone-pad"
              value={userPhone}
              onChangeText={setUserPhone}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input} // Use the input style
              placeholder="Address"
              placeholderTextColor="#333"
              value={userAddress}
              onChangeText={setUserAddress}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input} // Use the input style
              placeholder="Password"
              placeholderTextColor="#333"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Navigation to Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Optional: Uncomment if you want to keep the Profile button */}
          {/* <Button
            title="Go to Profile"
            color="#000000"
            onPress={() => navigation.navigate('Profile')}
            style={styles.navigationButton}
          /> */}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
