import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const AdminDashboard = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👑 Admin Dashboard</Text>

      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate("ApproveBusiness")}
      >
        <Text style={styles.text}>📋 Duyệt doanh nghiệp</Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate("CreateQR")}
      >
        <Text style={styles.text}>📷 Tạo QR Code</Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate("QRLogs")}
      >
        <Text style={styles.text}>📊 Log quét QR</Text>
      </Pressable>
    </View>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    padding: 20,
    backgroundColor: "#f2f2f2",
    marginBottom: 15,
    borderRadius: 12,
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});