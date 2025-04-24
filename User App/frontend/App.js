// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import ReportDumpScreen from './screens/ReportDumpScreen';
import NearbyBinsScreen from './screens/NearbyBinsScreen';
import ChatbotScreen from './screens/ChatbotScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Report Dump') {
              iconName = focused ? 'trash' : 'trash-outline';
            } else if (route.name === 'Nearby Bins') {
              iconName = focused ? 'locate' : 'locate-outline';
            } else if (route.name === 'Chatbot') {
              iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Report Dump" component={ReportDumpScreen} />
        <Tab.Screen name="Nearby Bins" component={NearbyBinsScreen} />
        <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
