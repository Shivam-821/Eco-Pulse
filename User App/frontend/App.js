import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './screens/HomeScreen';
import ReportDumpScreen from './screens/ReportDumpScreen';
import NearbyBinsScreen from './screens/NearbyBinsScreen';
import WasteCollectionScreen from './screens/WasteCollectionScreen';
import CheckRecyclableScreen from './screens/CheckRecyclableScreen';
import RequestPickupScreen from './screens/RequestPickupScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true, // ✅ Show top navbar with title
          tabBarShowLabel: false, // Hide bottom labels
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            elevation: 10,
            height: 60,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Report Dump':
                iconName = focused ? 'trash' : 'trash-outline';
                break;
              case 'Nearby Bins':
                iconName = focused ? 'locate' : 'locate-outline';
                break;
              case 'Waste Collection':
                iconName = focused ? 'leaf' : 'leaf-outline';
                break;
              case 'Check Recyclable':
                iconName = focused ? 'help-circle' : 'help-circle-outline';
                break;
              case 'Request Pickup':
                iconName = focused ? 'cube' : 'cube-outline';
                break;
            }

            return (
              <Ionicons
                name={iconName}
                size={24}
                color={focused ? '#2e7d32' : '#777'}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Report Dump" component={ReportDumpScreen} />
        <Tab.Screen name="Nearby Bins" component={NearbyBinsScreen} />
        <Tab.Screen name="Waste Collection" component={WasteCollectionScreen} />
        <Tab.Screen name="Check Recyclable" component={CheckRecyclableScreen} />
        <Tab.Screen name="Request Pickup" component={RequestPickupScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
