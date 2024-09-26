import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Profile: undefined;
  Register: undefined;
  Login: undefined;
  // Add other screen names and their param types here
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Profile">;
};
const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = () => {
    if (username.trim() === "" || password.trim() === "") {
      Alert.alert("Input Error", "Please enter your username and password.");
      return;
    }
    login(username, password); // Pass both username and password
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#d19a6a" // Warm placeholder text color
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#d19a6a" // Warm placeholder text color
        secureTextEntry // Hide the password input
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Button
        title="Profile ss"
        color="blue"
        onPress={() => navigation.navigate("Profile")}
        // style={{ padding: 20, borderRadius: 10 }} // Tùy chỉnh thêm padding và borderRadius
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff", // White background for a clean look
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8e6e53", // Warm color for the title
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    backgroundColor: "#f7d7c4", // Warm background color for input field
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#d19a6a", // Warm border color
    color: "#5a4633", // Dark text color for input
  },
  button: {
    backgroundColor: "#8e6e53", // Warm color for the login button
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // White text for the button
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
