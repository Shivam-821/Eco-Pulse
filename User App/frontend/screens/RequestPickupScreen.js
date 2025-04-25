import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import axios from 'axios'; 

const API_URL = 'http://192.168.70.233:5000';

export default function RequestPickupScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name || !address || !contactNumber || !wasteType || !pickupDate) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(pickupDate)) {
      Alert.alert('Invalid Date', 'Please enter date in YYYY-MM-DD format');
      return;
    }

    setLoading(true);

    const data = {
      name,
      address,
      contactNumber,
      wasteType,
      pickupDate,
    };

    try {
      const response = await axios.post(`${API_URL}/pickup-request`, data);

      if (response.status === 200) {
        Alert.alert('Success', 'Pickup request has been sent successfully');
        setName('');
        setAddress('');
        setContactNumber('');
        setWasteType('');
        setPickupDate('');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setError('An error occurred. Please try again.');
      Alert.alert('Error', error.response ? error.response.data.error : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Request Pickup</Text>

        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
        <TextInput style={styles.input} placeholder="Contact Number" keyboardType="phone-pad" value={contactNumber} onChangeText={setContactNumber} />
        <TextInput style={styles.input} placeholder="Waste Type (e.g., plastic, paper)" value={wasteType} onChangeText={setWasteType} />
        <TextInput style={styles.input} placeholder="Pickup Date (YYYY-MM-DD)" value={pickupDate} onChangeText={setPickupDate} />

        <Button title={loading ? 'Submitting...' : 'Submit Request'} onPress={handleSubmit} disabled={loading} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  card: { padding: 20, borderRadius: 10, backgroundColor: '#fff', elevation: 3 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, paddingLeft: 10 },
  error: { color: 'red', textAlign: 'center', marginTop: 10 },
});
