import React, { useContext, useEffect, useState, useRef } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SelectedProjectContext } from "./SelectedProjectContext";
import { db } from "./firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

export default function TasksScreen({ navigation }) {
  const { selectedProject, setSelectedProject } = useContext(SelectedProjectContext);
  const [tasks, setTasks] = useState([]);
  const [newText, setNewText] = useState("");
  const projectUnsubRef = useRef(null);
  const tasksUnsubRef = useRef(null);

  useEffect(() => {
    if (!selectedProject) return;

    const projectDocRef = doc(db, "projects", selectedProject.id);
    projectUnsubRef.current = onSnapshot(projectDocRef, (docSnap) => {
      if (!docSnap.exists()) {
        Alert.alert("Project deleted", "This project has been deleted. Returning to Projects screen.");
        setSelectedProject(null);
        navigation.navigate("Projects");
      } else {
        const updated = { id: docSnap.id, ...docSnap.data() };
        setSelectedProject(updated);
      }
    });

    const tasksRef = collection(projectDocRef, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "asc"));
    tasksUnsubRef.current = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setTasks(list);
    });

    return () => {
      if (projectUnsubRef.current) projectUnsubRef.current();
      if (tasksUnsubRef.current) tasksUnsubRef.current();
    };
  }, [selectedProject]);

  const addTask = async () => {
    if (!newText.trim()) return;
    try {
      const tasksRef = collection(doc(db, "projects", selectedProject.id), "tasks");
      await addDoc(tasksRef, { text: newText.trim(), createdAt: serverTimestamp() });
      setNewText("");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not add task.");
    }
  };

  const removeTask = async (taskId) => {
    try {
      const taskDoc = doc(db, "projects", selectedProject.id, "tasks", taskId);
      await deleteDoc(taskDoc);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not delete task.");
    }
  };

  if (!selectedProject) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10 }}>No project selected.</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Projects")} style={styles.button}>
          <Text style={{ color: "#fff" }}>Go to Projects</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{selectedProject.name}</Text>

      {tasks.length === 0 ? (
        <View style={styles.center}>
          <Text>No tasks found for this project.</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskRow}>
              <Text>{item.text}</Text>
              <TouchableOpacity onPress={() => removeTask(item.id)} style={styles.deleteBtn}>
                <Text style={{ color: "#fff" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.addRow}>
        <TextInput
          placeholder="New task..."
          value={newText}
          onChangeText={setNewText}
          style={styles.input}
        />
        <TouchableOpacity onPress={addTask} style={styles.addBtn}>
          <Text style={{ color: "#fff" }}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  taskRow: { flexDirection: "row", justifyContent: "space-between", padding: 12, borderWidth: 1, borderColor: "#eee", borderRadius: 8, marginBottom: 8 },
  deleteBtn: { backgroundColor: "#e74c3c", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  addRow: { flexDirection: "row", marginTop: 12, alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, marginRight: 8 },
  addBtn: { backgroundColor: "#2ecc71", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  button: { backgroundColor: "#3498db", padding: 10, borderRadius: 8 }
});
