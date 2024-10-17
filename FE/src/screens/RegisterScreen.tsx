import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import RegisterStyle from '../styles/RegisterStyle';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/RegisterScreenStyles';

import * as Localization from 'expo-localization';


type RootStackParamList = {
  Profile: undefined;
  Register: undefined;
  Login: undefined;

  // Add other screen names and their param types here
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
  const [birthday, setBirthday] = useState(new Date());
  const [gender, setGender] = useState('Male');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(false);
    setBirthday(currentDate);
  };
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(Localization.locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
  
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
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Image
            source={require('../assets/img/avt.jpg')}
            style={styles.logo}
          />
          <Text style={styles.slogan}>Kết nối nở rộ, từng cánh hoa một</Text>

          <Text style={styles.title}>Create Account</Text>

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

          <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={24} color="#2e7d32" style={styles.icon} />
            <Text style={styles.pickerButtonText}>
              {birthday ? formatDate(birthday) : 'Select Birthday'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pickerButton} onPress={() => setShowGenderPicker(true)}>
            <Ionicons name="person-outline" size={24} color="#2e7d32" style={styles.icon} />
            <Text style={styles.pickerButtonText}>{gender}</Text>
          </TouchableOpacity>

          {/* Date Picker Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showDatePicker}
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Birthday</Text>
                <DateTimePicker
                  value={birthday}
                  mode="date"
                  display="spinner"
                  onChange={onChangeDate}
                  style={styles.datePicker}
                />
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Gender Picker Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showGenderPicker}
            onRequestClose={() => setShowGenderPicker(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Gender</Text>
                {['Male', 'Female', 'Other'].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.genderOption,
                      gender === item && styles.selectedGenderOption
                    ]}
                    onPress={() => {
                      setGender(item);
                      setShowGenderPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      gender === item && styles.selectedGenderOptionText
                    ]}>{item}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowGenderPicker(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.footerLink}>Login</Text>
          </TouchableOpacity>
        </View>
          <Button
            title="Go to Profile"
            color="#000000"
            onPress={() => navigation.navigate('Profile')}
            style={styles.navigationButton}
          />
          
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
