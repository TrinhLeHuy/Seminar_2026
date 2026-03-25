import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";

const ApproveBusiness = () => {
  const [businesses, setBusinesses] = useState([
    { id: 1, name: "Quán Bún Bò Huế" },
    { id: 2, name: "Phở Hà Nội 24h" },
  ]);

  const handleApprove = (id: number) => {
    alert("Đã duyệt!");
    setBusinesses(businesses.filter((b) => b.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Duyệt doanh nghiệp</Text>

      <FlatList
        data={businesses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.name}</Text>

            <Pressable
              style={styles.btn}
              onPress={() => handleApprove(item.id)}
            >
              <Text style={{ color: "#fff" }}>Duyệt</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

export default ApproveBusiness;

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

  btn: {
    marginTop: 10,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});