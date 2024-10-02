import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Profile: undefined;
  Register: undefined;
  // Add other screen names and their param types here
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

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(false);
    setBirthday(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#d19a6a" // Warm placeholder text color
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#d19a6a" // Warm placeholder text color
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#d19a6a" // Warm placeholder text color
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>
          {birthday ? birthday.toDateString() : 'Select Birthday'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={birthday}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={(itemValue: React.SetStateAction<string>) => setGender(itemValue)}
      >
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Button
        title="Profile Screen ss"
        color="pink"
        onPress={() => navigation.navigate('Profile')}
        style={styles.navigationButton}
      />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background for a clean look
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8e6e53', // Warm color for the title
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f7d7c4', // Warm background color for input fields
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#5a4633', // Darker text color for input
    borderWidth: 1, // Border for better visibility
    borderColor: '#d19a6a', // Warm border color
  },
  datePicker: {
    backgroundColor: '#f7d7c4', // Warm background color for date picker
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#d19a6a', // Warm border color
  },
  dateText: {
    color: '#5a4633', // Darker text color for date
    fontSize: 16,
  },
  picker: {
    height: 50,
    backgroundColor: '#f7d7c4', // Warm background color for the picker
    marginBottom: 15,
    color: '#5a4633', // Darker text color
    borderWidth: 1,
    borderColor: '#d19a6a', // Warm border color
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#8e6e53', // Warm color for the sign-up button
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navigationButton: {
    padding: 20,
    borderRadius: 10,
  },
});
