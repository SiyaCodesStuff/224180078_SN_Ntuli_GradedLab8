import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SelectedProjectProvider } from "./SelectedProjectContext";
import ProjectsScreen from "./ProjectsScreen";
import TasksScreen from "./TasksScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TasksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tasks" component={TasksScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SelectedProjectProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Projects" component={ProjectsScreen} />
          <Tab.Screen name="TasksTab" component={TasksStack} options={{ title: "Tasks" }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SelectedProjectProvider>
  );
}
