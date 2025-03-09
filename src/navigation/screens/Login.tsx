import React, { useState } from 'react'; 
import { View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,ScrollView  } from 'react-native'; 
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../../firebase';  // Firebase config
import Spinner from 'react-native-loading-spinner-overlay';  // Import the spinner
import Icon from 'react-native-vector-icons/FontAwesome';  // Import FontAwesome icon library
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);  // State to manage loading spinner
  const [passwordVisible, setPasswordVisible] = useState(false);  // State to toggle password visibility

  // Handle login process
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);  // Show loading spinner
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // After successful login, navigate to HomeTabs (the tab navigator)
      navigation.replace('HomeTabs');  // Use the screen name of your tab navigator
    } catch (error) {
      let errorMessage = 'Invalid email or password';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'User account is disabled';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);  // Hide loading spinner after login attempt
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Login</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          accessibilityLabel="Email input"
        />

        <ScrollView  style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}  // Toggle secureTextEntry based on password visibility state
            style={styles.input}
            accessibilityLabel="Password input"
          />

          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}  // Toggle password visibility
            accessibilityLabel="Toggle password visibility"
          >
            <Icon 
              name={passwordVisible ? 'eye-slash' : 'eye'}  // Change icon based on visibility state
              size={20}
              color="#4CAF50"
            />
          </TouchableOpacity>
        </ScrollView>

        <Button title="Login" onPress={handleLogin} color="#4CAF50" accessibilityLabel="Login button" />

        <Text style={styles.loginPrompt}>
          Don't have an account?{' '}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('Registration')}
            accessibilityLabel="Sign up link"
          >
            Sign up
          </Text>
          {' '}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('HomeTabs')}
            accessibilityLabel="Back door link"
          >
            Back Door
          </Text>
        </Text>

        {/* Loading Spinner */}
        <Spinner visible={loading} textContent="Logging in..." textStyle={styles.spinnerText} />
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
    color: '#000',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
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

export default Login;