import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { registerRootComponent } from 'expo';
import App from '../App';  // Import your App.tsx

// Load assets (images, icons, etc.)
Asset.loadAsync([
  require('./assets/icons/home.png'),
  require('./assets/icons/calculate.png'),
  require('./assets/icons/result.png'),
]);

// Prevent the splash screen from hiding until assets are loaded
SplashScreen.preventAutoHideAsync();

export default function Main() {
  return (
    <App
      onReady={() => {
        // Hide splash screen once everything is ready
        SplashScreen.hideAsync();
      }}
    />
  );
}

// Register the app's root component
registerRootComponent(Main);
