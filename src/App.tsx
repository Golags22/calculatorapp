import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./firebase"; // Make sure your firebase config is correct
import Login from "./navigation/screens/Login"; // Import Login screen
import Registration from "./navigation/screens/Registration"; // Import Registration screen
import HomeTabs from "./navigation/HomeTabs"; // Import the HomeTabs navigator
import Gp from "./navigation/screens/Gp";
import Cgpa from "./navigation/screens/Cgpa";
import { Profile } from "./navigation/screens/Profile";
import Logout from "./navigation/screens/Logout";


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
        <Stack.Screen name="Gp" component={Gp} />
        <Stack.Screen name="Cgpa" component={Cgpa} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Logout" component={Logout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
