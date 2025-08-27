import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native'; 
import { Picker } from '@react-native-picker/picker'; 
import { useNavigation } from '@react-navigation/native'; 
import { Card } from 'react-native-paper';

export default function CheckRecyclableScreen() {
  const navigation = useNavigation();

  const items = [
    { label: 'Select an item...', value: '' },
    { label: 'Plastic Bottle', value: 'plastic' },
    { label: 'Glass Jar', value: 'glass' },
    { label: 'Food Waste', value: 'food' },
    { label: 'Paper', value: 'paper' },
    { label: 'Styrofoam', value: 'styrofoam' },
  ];

  const recyclableItems = ['plastic', 'glass', 'paper'];

  const [selectedItem, setSelectedItem] = useState('');
  const [isRecyclable, setIsRecyclable] = useState(null);

  const handleSelection = (value) => {
    setSelectedItem(value);
    if (recyclableItems.includes(value)) {
      setIsRecyclable(true);
    } else if (value === '') {
      setIsRecyclable(null);
    } else {
      setIsRecyclable(false);
    }
  };

  const handleRequestPickup = () => {
    navigation.navigate('Request Pickup');
    setSelectedItem('');
    setIsRecyclable(null);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
       
        <Picker
          selectedValue={selectedItem}
          onValueChange={handleSelection}
          style={styles.picker}
        >
          {items.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>

        {isRecyclable === false && (
          <Text style={styles.notRecyclable}> Not Recyclable</Text>
        )}

        {isRecyclable === true && (
          <Button title="✅ Request Pickup" onPress={handleRequestPickup} />
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5', // Light background for better readability
  },
  card: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3, // Adding elevation for shadow effect
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4CAF50', // Green color for the title
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  notRecyclable: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

