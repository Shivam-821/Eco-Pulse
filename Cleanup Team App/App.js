import React from 'react';
import { StatusBar } from 'expo-status-bar';
import TaskListScreen from './screens/TaskListScreen';

export default function App() {
  return (
    <>
      <TaskListScreen />
      <StatusBar style="auto" />
    </>
  );
}
