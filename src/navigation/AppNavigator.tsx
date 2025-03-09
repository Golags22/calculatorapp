import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';  // Firebase configuration file
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

import HomeTabs from './HomeTabs';  // Your HomeTabs component
import Login from './screens/Login';  // Login screen component
import Registration from './screens/Registration';  // Registration screen component

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check AsyncStorage for authentication state when the app starts
    const checkAuthState = async () => {
      try {
        const storedAuthState = await AsyncStorage.getItem('isAuthenticated');
        if (storedAuthState === 'true') {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication state from AsyncStorage', error);
      }
    };

    checkAuthState();

    // Listen for Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        AsyncStorage.setItem('isAuthenticated', 'true');  // Store authentication state in AsyncStorage
      } else {
        setIsAuthenticated(false);
        AsyncStorage.setItem('isAuthenticated', 'false');  // Clear authentication state from AsyncStorage
      }
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          // If authenticated, show HomeTabs
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            {/* If not authenticated, show Login and Registration screens */}
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Registration"
              component={Registration}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
