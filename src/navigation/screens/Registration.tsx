import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';  // Import Firebase auth configuration

const Registration = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle registration process
  const handleRegistration = async () => {
    try {
      // Register new user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      // If registration is successful, navigate to the Login screen
      Alert.alert('Registration Success', 'You have successfully registered!');
      navigation.navigate('Login');
    } catch (error) {
      // Handle errors (e.g., weak password, email already in use)
      Alert.alert('Error', error.message);
    }
  };

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Create Account</Text>
    
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
    
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
    
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
      </View>
    );};
    const styles = StyleSheet.create({
      container: {
        flex: 1,
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
    });


export default Registration;
