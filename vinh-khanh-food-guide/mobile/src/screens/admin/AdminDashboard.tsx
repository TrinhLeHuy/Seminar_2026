import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApproveBusiness from "./ApproveBusiness";
import LocationManagementScreen from "./LocationManagementScreen";
import CreateQR from "./CreateQR";
import QRLogs from "./QRLogs";

const AdminDashboard = () => {
  const navigation = useNavigation<any>();
  const [activeScreen, setActiveScreen] = React.useState("dashboard");
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      {/* SIDEBAR */}
      <View style={styles.sidebar}>
        <View>
          <Text style={styles.logo}>🍜 Food Admin</Text>

          <Pressable
            style={[
              styles.menuItem,
              activeScreen === "dashboard" && styles.activeMenu,
            ]}
            onPress={() => setActiveScreen("dashboard")}
          >
            <Text style={styles.icon}>📊</Text>
            <Text
              style={
                activeScreen === "dashboard"
                  ? styles.activeText
                  : styles.menuText
              }
            >
              Dashboard
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.menuItem,
              activeScreen === "approve" && styles.activeMenu,
            ]}
            onPress={() => setActiveScreen("approve")}
          >
            <Text style={styles.icon}>📋</Text>
            <Text
              style={
                activeScreen === "approve" ? styles.activeText : styles.menuText
              }
            >
              Duyệt doanh nghiệp
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.menuItem,
              activeScreen === "location" && styles.activeMenu,
            ]}
            onPress={() => setActiveScreen("location")}
          >
            <Text style={styles.icon}>🍜</Text>
            <Text
              style={
                activeScreen === "location"
                  ? styles.activeText
                  : styles.menuText
              }
            >
              Quản lý quán
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.menuItem,
              activeScreen === "qr" && styles.activeMenu,
            ]}
            onPress={() => setActiveScreen("qr")}
          >
            <Text style={styles.icon}>📷</Text>
            <Text
              style={
                activeScreen === "qr" ? styles.activeText : styles.menuText
              }
            >
              Tạo QR Code
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.menuItem,
              activeScreen === "logs" && styles.activeMenu,
            ]}
            onPress={() => setActiveScreen("logs")}
          >
            <Text style={styles.icon}>📊</Text>
            <Text
              style={
                activeScreen === "logs" ? styles.activeText : styles.menuText
              }
            >
              QR Analytics
            </Text>
          </Pressable>
        </View>

        {/* LOGOUT */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Đăng xuất</Text>
        </Pressable>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {activeScreen === "dashboard" && (
          <View style={styles.card}>
            <Text style={styles.title}>Admin Dashboard</Text>
          </View>
        )}

        {activeScreen === "approve" && <ApproveBusiness />}

        {activeScreen === "location" && (
          <LocationManagementScreen navigation={navigation} />
        )}

        {activeScreen === "qr" && <CreateQR />}

        {activeScreen === "logs" && <QRLogs />}
      </View>
    </View>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f6f7fb",
  },

  sidebar: {
    width: 250,
    backgroundColor: "#ffffff",
    paddingTop: 35,
    paddingHorizontal: 18,
    borderRightWidth: 1,
    borderColor: "#ececec",
    justifyContent: "space-between",
  },

  logo: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 28,
    color: "#222",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
  },

  activeMenu: {
    backgroundColor: "#eef2ff",
  },

  icon: {
    fontSize: 16,
    marginRight: 10,
  },

  menuText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  activeText: {
    fontSize: 15,
    color: "#4338ca",
    fontWeight: "600",
  },

  content: {
    flex: 1,
    padding: 40,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
  },

  logoutButton: {
    backgroundColor: "#ff7a18",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
