// ReportDumpScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

export default function ReportDumpScreen() {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // Here you can send this data to your backend
    console.log({ location, description });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} placeholder="Enter location" value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} placeholder="Describe the dump" value={description} onChangeText={setDescription} multiline />

      <Button title="Report Dump" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});
