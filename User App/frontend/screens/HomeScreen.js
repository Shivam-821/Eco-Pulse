import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Hello, Welcome :)</Text>

        <Text style={styles.subtext}>
          Be a part of the change. Together, we can create cleaner, smarter, and more sustainable cities. 
          Your actions contribute to a greener India and a better tomorrow.
        </Text>

        <Image 
          source={require('../assets/clean_india_image.jpg')} 
          style={styles.image} 
        />

        <Text style={styles.tagline}>
           Clean India. Green India. Smart India.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#e8f5e9', // Light green background for the whole screen
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtext: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  tagline: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600',
    color: '#1b5e20',
    textAlign: 'center',
  },
});
