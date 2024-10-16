import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Modal, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../components/Button';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Localization from 'expo-localization';
import { styles } from '../styles/RegisterScreenStyles';


type RootStackParamList = {
  Profile: undefined;
  Register: undefined;
  // Add other screen names and their param types here
  Login: undefined;

};

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Image
            source={require('../assets/img/avt.jpg')}
            style={styles.logo}
          />
          <Text style={styles.slogan}>Kết nối nở rộ, từng cánh hoa một</Text>

          <Text style={styles.title}>Create Account</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#333"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#333"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#2e7d32" style={styles.icon} />
            <TextInput
              style={styles.input}
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
