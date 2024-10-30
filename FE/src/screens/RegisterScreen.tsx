import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, Alert, ScrollView, StatusBar, Image, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
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
  const [errors, setErrors] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    userAddress: '',
    password: '',
  });

  const { register } = useAuth();

  const validateName = (name: string) => {
    if (!name) {
      setErrors(prev => ({ ...prev, userName: 'Name is required' }));
      return false;
    }
    if (/\d/.test(name)) {
      setErrors(prev => ({ ...prev, userName: 'Name cannot contain numbers' }));
      return false;
    }
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      setErrors(prev => ({ ...prev, userName: 'Name can only contain letters and spaces' }));
      return false;
    }
    setErrors(prev => ({ ...prev, userName: '' }));
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors(prev => ({ ...prev, userEmail: 'Email is required' }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, userEmail: 'Invalid email format' }));
      return false;
    }
    setErrors(prev => ({ ...prev, userEmail: '' }));
    return true;
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) {
      setErrors(prev => ({ ...prev, userPhone: 'Phone number is required' }));
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setErrors(prev => ({ ...prev, userPhone: 'Invalid phone number (10 digits required)' }));
      return false;
    }
    setErrors(prev => ({ ...prev, userPhone: '' }));
    return true;
  };

  const validateAddress = (address: string) => {
    if (!address) {
      setErrors(prev => ({ ...prev, userAddress: 'Address is required' }));
      return false;
    }
    if (address.length < 5) {
      setErrors(prev => ({ ...prev, userAddress: 'Address is too short' }));
      return false;
    }
    setErrors(prev => ({ ...prev, userAddress: '' }));
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return false;
    }
    if (password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: '' }));
    return true;
  };

  const handleRegister = async () => {
    // Validate all fields
    const isNameValid = validateName(userName);
    const isEmailValid = validateEmail(userEmail);
    const isPhoneValid = validatePhone(userPhone);
    const isAddressValid = validateAddress(userAddress);
    const isPasswordValid = validatePassword(password);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isAddressValid || !isPasswordValid) {
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

          <View style={[
            styles.inputContainer, 
            errors.userName ? styles.inputContainerError : null
          ]}>
            <Ionicons name="person-outline" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input} // Use the input style
              placeholder="Full Name"
              placeholderTextColor="#333"
              value={userName}
              onChangeText={(text) => {
                setUserName(text);
                validateName(text);
              }}
            />
          </View>
          {errors.userName ? <Text style={styles.errorText}>{errors.userName}</Text> : null}

          <View style={[
            styles.inputContainer, 
            errors.userEmail ? styles.inputContainerError : null
          ]}>
            <Ionicons name="mail-outline" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input} // Use the input style
              placeholder="Email Address"
              placeholderTextColor="#333"
              keyboardType="email-address"
              value={userEmail}
              onChangeText={(text) => {
                setUserEmail(text);
                validateEmail(text);
              }}
            />
          </View>
          {errors.userEmail ? <Text style={styles.errorText}>{errors.userEmail}</Text> : null}

          <View style={[
            styles.inputContainer, 
            errors.userPhone ? styles.inputContainerError : null
          ]}>
            <Ionicons name="call-outline" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input} // Use the input style
              placeholder="Phone Number"
              placeholderTextColor="#333"
              keyboardType="phone-pad"
              value={userPhone}
              onChangeText={(text) => {
                setUserPhone(text);
                validatePhone(text);
              }}
            />
          </View>
          {errors.userPhone ? <Text style={styles.errorText}>{errors.userPhone}</Text> : null}

          <View style={[
            styles.inputContainer, 
            errors.userAddress ? styles.inputContainerError : null
          ]}>
            <Ionicons name="location-outline" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input} // Use the input style
              placeholder="Address"
              placeholderTextColor="#333"
              value={userAddress}
              onChangeText={(text) => {
                setUserAddress(text);
                validateAddress(text);
              }}
            />
          </View>
          {errors.userAddress ? <Text style={styles.errorText}>{errors.userAddress}</Text> : null}

          <View style={[
            styles.inputContainer, 
            errors.password ? styles.inputContainerError : null
          ]}>
            <Ionicons name="lock-closed-outline" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input} // Use the input style
              placeholder="Password"
              placeholderTextColor="#333"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                validatePassword(text);
              }}
            />
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

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
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
