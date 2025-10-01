import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TasksScreen from '../screens/TasksScreen';

const Stack = createStackNavigator();

export default function TasksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tasks" component={TasksScreen} />
    </Stack.Navigator>
  );
}
