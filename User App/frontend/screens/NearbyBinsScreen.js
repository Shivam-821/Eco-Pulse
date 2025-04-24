import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine-distance';
import * as Linking from 'expo-linking';

export default function NearbyBinsScreen() {
  const [location, setLocation] = useState(null);
  const [selectedBin, setSelectedBin] = useState(null);

  // Dummy bin data (3 locations)
  const bins = [
    {
      id: 1,
      title: 'Imphal West Smart Bin',
      latitude: 24.8162,
      longitude: 93.9368,
      wasteType: 'Dry & Wet Waste',
    },
    {
      id: 2,
      title: 'NIT Manipur Smart Bin',
      latitude: 24.8054,
      longitude: 93.9442,
      wasteType: 'Plastic Waste',
    },
    {
      id: 3,
      title: 'MIT Takyelpat Smart Bin',
      latitude: 24.7861,
      longitude: 93.9238,
      wasteType: 'Organic Waste',
    },
  ];

  // Get user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  // Calculate distance in KM
  const getDistance = (userLocation, bin) => {
    if (!userLocation) return '...';
    const dist = haversine(userLocation, {
      latitude: bin.latitude,
      longitude: bin.longitude,
    }) / 1000;
    return dist.toFixed(2) + ' km';
  };

  // Open in Google Maps
  const openGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
        >
          {bins.map((bin) => (
            <Marker
              key={bin.id}
              coordinate={{ latitude: bin.latitude, longitude: bin.longitude }}
              title={bin.title}
              onPress={() => setSelectedBin(bin)} // Set the selected bin on marker press
            />
          ))}
        </MapView>
      )}

      {/* Modal for custom callout */}
      {selectedBin && (
        <Modal
          visible={!!selectedBin}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedBin(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedBin.title}</Text>
              <Text style={styles.modalText}>Distance: {getDistance(location, selectedBin)}</Text>
              <Text style={styles.modalText}>Waste Type: {selectedBin.wasteType}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => openGoogleMaps(selectedBin.latitude, selectedBin.longitude)}
              >
                <Text style={styles.buttonText}>Get Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedBin(null)} // Close the modal
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 250,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    padding: 6,
    backgroundColor: 'gray',
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
