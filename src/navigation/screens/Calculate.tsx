import React from 'react';
import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function Calculator() {
  const navigation = useNavigation(); // Hook for navigation

  return (
    <ImageBackground
      source={require('../../assets/images/calbg.jpg')} // Adjust the path if needed
      style={styles.background}
    >
      <View style={styles.layout}></View>
      <View style={styles.container}>
        <Text style={styles.text}>What will you be calculating Today?</Text>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Gp')}
          >
            <Text style={styles.buttonText}>Calculate GPA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Cgpa')}
          >
            <Text style={styles.buttonText}>Calculate CGPA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  layout: {
    width: '100%',
    backgroundColor: 'rgba(32, 29, 87, 0.77)',
    height: '100%',
    position: 'absolute',
  },
  background: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover', // Ensures the background image covers the screen
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    color: 'white',
    fontFamily: 'Arial', // Use a default font or load a custom one
    fontSize: 24, // Use numbers instead of 'rem'
    textAlign: 'center',
    padding: 20, // Use numbers instead of 'px'
  },
  btnContainer: {
    width: '100%',
    alignItems: 'center', // Centers buttons horizontally
    gap: 15, // Adds space between the buttons
  },
  button: {
    width: '80%', // Button width makes it responsive
    padding: 15, // Padding for the buttons to make them look better
    borderRadius: 8, // Rounded corners for buttons
    backgroundColor: 'rgba(141, 136, 241, 0.77)', // Button background color
    marginVertical: 10, // Adds space between buttons
    justifyContent: 'center', // Vertically centers the text in the button
    alignItems: 'center', // Horizontally centers the text in the button
  },
  buttonText: {
    color: 'white', // Button text color
    fontSize: 18, // Button text size
    fontWeight: '600',
  },
});