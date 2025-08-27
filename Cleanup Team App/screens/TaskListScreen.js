import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import TaskCard from '../components/TaskCard';

const TaskListScreen = () => {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      location: { latitude: 37.78825, longitude: -122.4324, address: '123 Main St' },
      deadline: '2025-04-30 10:00 AM',
      typeOfWaste: 'Plastic',
      guide: 'Turn left at the corner, continue for 200 meters.',
      completed: false,
    },
    {
      id: '2',
      location: { latitude: 37.78925, longitude: -122.4314, address: '456 Elm St' },
      deadline: '2025-04-30 02:00 PM',
      typeOfWaste: 'Glass',
      guide: 'Turn right at the next intersection.',
      completed: false,
    },
  ]);

  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Assigned Cleanup Tasks</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard task={item} currentLocation={currentLocation} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default TaskListScreen;
