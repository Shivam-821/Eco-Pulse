import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      
      <Text style={styles.heading}>Hello, Welcome:)</Text>
      
      <Text style={styles.subtext}>
        Together, we can make our cities cleaner, smarter, and more sustainable. By using our app, you're actively contributing to a greener, waste-free environment and supporting India's development towards a sustainable future.
      </Text>

      {/* Image from local assets */}
      <Image 
        source={require('../assets/clean_india_image.jpg')} 
        style={styles.image} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  subtext: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginTop: 30,
  },
});
