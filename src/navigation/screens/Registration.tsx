import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';  // Import Firebase auth configuration
import { setDoc, doc } from '../../firebase'; // Import Firestore functions
import { db } from '../../firebase';  // Import Firestore database configuration
import Spinner from 'react-native-loading-spinner-overlay';  // Import the spinner
import Icon from 'react-native-vector-icons/FontAwesome';  // Import FontAwesome icon library

const Registration = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);  // State to toggle password visibility
  const [loading, setLoading] = useState(false);  // State to manage loading spinner

  // Handle registration process
  const handleRegistration = async () => {
     // Simple validation: ensure all required fields are filled
     if (!email || !password || !firstName || !lastName || !username) {
      Alert.alert("All fields are required");
      return;
    }
     // Validate the email format
     const emailRegex = /\S+@\S+\.\S+/;
     if (!emailRegex.test(email)) {
       Alert.alert("Invalid email format");
       return;
     }
 
     // Validate password length (Firebase requires at least 6 characters)
     if (password.length < 6) {
       Alert.alert("Password must be at least 6 characters");
       return;
     }
 
    setLoading(true);  // Show the loading spinner
    try {
      // Register new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data (firstName, lastName, email, username) to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        username, // Store the username (user-provided)
        email,
      });
      // If registration is successful, show an alert and navigate to the Login screen
      Alert.alert('Registration Success', 'You have successfully registered!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),  // Navigate to Login screen when OK is pressed
        },
      ]);
    } catch (error) {
      // Handle errors (e.g., weak password, email already in use)
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);  // Hide the loading spinner after the process is done
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Create Account</Text>

        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />

        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}  // Toggle secureTextEntry based on password visibility state
            style={styles.input}
          />

          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}  // Toggle password visibility
          >
            <Icon 
              name={passwordVisible ? 'eye-slash' : 'eye'}  // Change icon based on visibility state
              size={20}
              color="#4CAF50"
            />
          </TouchableOpacity>
        </View>

        <Button title="Register" onPress={handleRegistration} color="#4CAF50" />

        <Text style={styles.loginPrompt}>
          Already have an account?{' '}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Text>
        </Text>

        {/* Loading Spinner */}
        <Spinner visible={loading} textContent="Registering..." textStyle={styles.spinnerText} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color:'black',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  loginPrompt: {
    marginTop: 20,
    color: '#555',
    fontSize: 14,
  },
  loginLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  spinnerText: {
    color: '#fff',  // White text color for spinner
    fontSize: 16,
  },
});

export default Registration;
