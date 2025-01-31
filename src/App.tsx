import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './firebase'; // Make sure your firebase config is correct
import Login from './navigation/screens/Login'; // Import Login screen
import Registration from './navigation/screens/Registration'; // Import Registration screen
import HomeTabs from './navigation/HomeTabs'; // Import the HomeTabs navigator

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }} // Hide header for tabs
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
