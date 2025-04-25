import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";

// API URL for the backend
const API_URL = 'http://192.168.70.233:5000'; // Replace with your local IP address for mobile testing

const WasteCollectionScreen = () => {
  // State variables
  const [location, setLocation] = useState(""); // For location input
  const [schedule, setSchedule] = useState(null); // To store fetched schedule
  const [billNumber, setBillNumber] = useState(""); // For bill number input
  const [billDetails, setBillDetails] = useState(null); // To store fetched bill details

  // Fetch schedule based on location
  const fetchSchedule = async () => {
    try {
      console.log("Location entered:", location.toLowerCase()); // Log input to verify it's correct

      const response = await fetch(`${API_URL}/api/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: location.toLowerCase() }), // Ensure lowercase input is passed
      });

      const data = await response.json();
      if (data.success) {
        setSchedule(data.schedule);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch schedule.");
    }
  };

  // Fetch bill details based on bill number
  const fetchBill = async () => {
    try {
      const response = await fetch(`${API_URL}/api/bill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billNumber }),
      });

      const data = await response.json();
      if (data.success) {
        setBillDetails(data.bill);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch bill.");
    }
  };

  // Simulate the payment action
  const handlePayment = () => {
    Alert.alert("Payment", "Redirecting to payment gateway...");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📅 Waste Collection Schedule</Text>

      {/* Location Input */}
      <TextInput
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      <Button title="Fetch Schedule" onPress={fetchSchedule} />

      {/* Schedule display */}
      {schedule && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Schedule:</Text>
          {Object.entries(schedule).map(([day, time]) => (
            <Text key={day}>- {day}: {time}</Text>
          ))}
        </View>
      )}

      <Text style={styles.header}>💳 Pay Waste Fees</Text>

      {/* Bill Number Input */}
      <TextInput
        placeholder="Enter Bill Number"
        value={billNumber}
        onChangeText={setBillNumber}
        style={styles.input}
      />
      <Button title="Check Bill" onPress={fetchBill} />

      {/* Bill details display */}
      {billDetails && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Bill Info:</Text>
          <Text>Amount Due: ₹{billDetails.amount}</Text>
          <Text>Status: {billDetails.status}</Text>
          {billDetails.status === "unpaid" && (
            <Button title="Pay Now" onPress={handlePayment} />
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 20,
    marginVertical: 15,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  resultBox: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  resultTitle: {
    fontWeight: "600",
    marginBottom: 6,
  },
});

export default WasteCollectionScreen;
