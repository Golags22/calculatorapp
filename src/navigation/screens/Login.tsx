import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text,StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase'; // Firebase config

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // After successful login, navigate to HomeTabs (the tab navigator)
      navigation.replace('HomeTabs');  // Use the screen name of your tab navigator
      
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  return (
  <View style={styles.container}>
          <Text style={styles.header}>Login</Text>
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
               
      <Button title="Login" onPress={handleLogin}  color="#4CAF50"/>
       <Text style={styles.loginPrompt}>
       Create an account
                <Text
                  style={styles.loginLink}
                  onPress={() => navigation.navigate('Registration')}
                >
                  Signin 
                </Text>
              </Text>
    </View>
  );
};
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

export default Login;
