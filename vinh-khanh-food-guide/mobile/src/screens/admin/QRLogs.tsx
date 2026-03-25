import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const QRLogs = () => {
  const logs = [
    { id: 1, location: "Bún Bò Huế", time: "10:30 AM" },
    { id: 2, location: "Phở Hà Nội", time: "11:00 AM" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Lịch sử quét QR</Text>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.location}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default QRLogs;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginBottom: 10,
  },

  time: {
    marginTop: 5,
    color: "#666",
  },
});