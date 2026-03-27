import React from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AdminDashboard = () => {
  const navigation = useNavigation<any>();

  // Hàm logout trực tiếp

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
      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate("LocationManagementScreen")}
      >
        {" "}
        <Text style={styles.text}>📍 Quản lý Location</Text>{" "}
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
  logoutCard: {
    backgroundColor: "#ffdddd",
  },
  logoutText: {
    color: "#d00",
    fontWeight: "700",
  },
});
