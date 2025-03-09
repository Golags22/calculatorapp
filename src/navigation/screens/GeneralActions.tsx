import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function GeneralAction() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>General Actions</Text>
      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>Help & Support</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>Terms & Conditions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton}>
        <Text style={styles.optionText}>Give Feedback</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  optionText: {
    color: 'white',
  },
});

export default GeneralAction;
