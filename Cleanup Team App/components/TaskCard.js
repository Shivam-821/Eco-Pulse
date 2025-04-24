import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { getDistance } from 'geolib';

const TaskCard = ({ task, currentLocation }) => {
  const [isCompleted, setIsCompleted] = useState(task.completed || false);
  const [distance, setDistance] = useState('Calculating...');

  useEffect(() => {
    if (currentLocation) {
      const distanceInMeters = getDistance(
        {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
        {
          latitude: task.location.latitude,
          longitude: task.location.longitude,
        }
      );
      setDistance(`${(distanceInMeters / 1000).toFixed(2)} km`);
    }
  }, [currentLocation]);

  const openGoogleMaps = () => {
    const { latitude, longitude } = task.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.taskTitle}>Assigned Cleanup Task</Text>
      <Text style={styles.info}>Location: {task.location.address}</Text>
      <Text style={styles.info}>Type of Waste: {task.typeOfWaste}</Text>
      <Text style={styles.info}>Deadline: {task.deadline}</Text>
      <Text style={styles.info}>Distance: {distance}</Text>

      <TouchableOpacity onPress={openGoogleMaps}>
        <Text style={styles.guideLink}>🧭 Get Direction</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isCompleted ? styles.completedButton : styles.activeButton]}
        onPress={() => setIsCompleted(!isCompleted)}
      >
        <Text style={styles.buttonText}>
          {isCompleted ? ' Completed' : 'Mark as Completed'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 4,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
  guideLink: {
    fontSize: 15,
    marginTop: 10,
    color: '#1E88E5',
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  completedButton: {
    backgroundColor: '#d3d3d3',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default TaskCard;
