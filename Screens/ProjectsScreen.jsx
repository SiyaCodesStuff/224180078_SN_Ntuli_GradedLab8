import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "./firebase";
import { SelectedProjectContext } from "./SelectedProjectContext";
import { doc, collection as subcollection, onSnapshot as onSubSnapshot } from "firebase/firestore";

export default function ProjectsScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const { setSelectedProject } = useContext(SelectedProjectContext);

  useEffect(() => {
    const q = query(collection(db, "projects"));
    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setProjects(list);
      setLoading(false);

      setCounts(prev => {
        const newPrev = { ...prev };
        Object.keys(newPrev).forEach(pid => {
          if (!list.some(p => p.id === pid)) delete newPrev[pid];
        });
        return newPrev;
      });
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const unsubscribes = [];
    projects.forEach(p => {
      const tasksRef = subcollection(doc(db, "projects", p.id), "tasks");
      const unsub = onSubSnapshot(tasksRef, (snap) => {
        setCounts(prev => ({ ...prev, [p.id]: snap.size }));
      });
      unsubscribes.push(unsub);
    });
    return () => unsubscribes.forEach(u => u && u());
  }, [projects]);

  const handlePressProject = (project) => {
    setSelectedProject(project);
    navigation.navigate("TasksTab", { screen: "Tasks" });
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      {projects.length === 0 ? (
        <View style={styles.center}><Text>No projects yet. Add a project in Firestore to start.</Text></View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} onPress={() => handlePressProject(item)}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.count}>{counts[item.id] ?? 0} tasks</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  row: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#ddd", marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 16 },
  count: { fontSize: 14, color: "#666" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});
