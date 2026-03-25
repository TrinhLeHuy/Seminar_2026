import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:8080/api/auth/login"
    : "http://192.168.66.14:8080/api/auth/login";

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      alert("Đăng nhập thành công!");

      if (data.role === "ADMIN") {
        navigation.replace("AdminDashboard");
      } else {
        navigation.replace("RegisterBusiness");
      }

    } catch {
      alert("Sai tài khoản hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🍜 Food Guide</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.loginBtn} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.text}>Đăng nhập</Text>
        )}
      </Pressable>

      {/* ✅ QUAN TRỌNG: name phải là RegisterUser */}
      <Pressable
        style={styles.registerBtn}
        onPress={() => navigation.navigate("RegisterUser")}
      >
        <Text style={styles.text}>📝 Tạo tài khoản</Text>
      </Pressable>

      <Pressable
        style={styles.guestBtn}
        onPress={() =>
          navigation.replace("MainTabs", {
            screen: "Home",
            params: { guest: true },
          })
        }
      >
        <Text style={styles.text}>
          🚀 Vào ứng dụng (không cần đăng nhập)
        </Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },

  logo: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  loginBtn: {
    backgroundColor: "#ff6b00",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  registerBtn: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  guestBtn: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
  },

  text: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});