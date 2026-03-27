// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   ActivityIndicator,
//   Platform,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// const API_URL =
//   Platform.OS === "web"
//     ? "http://localhost:8080/api/auth/login"
//     : "http://192.168.2.23:8080/api/auth/login";

// const LoginScreen = ({ navigation }: any) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   // const handleLogin = async () => {
//   //   if (!username || !password) {
//   //     alert("Nhập đầy đủ thông tin");
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);

//   //     const res = await fetch(API_URL, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ username, password }),
//   //     });

//   //     const data = await res.json();

//   //     if (!res.ok) throw new Error();

//   //     alert("Đăng nhập thành công!");

//   //     if (data.role === "ADMIN") {
//   //       navigation.replace("AdminDashboard");
//   //     } else {
//   //       navigation.replace("RegisterBusiness");
//   //     }
//   //   } catch {
//   //     alert("Sai tài khoản hoặc mật khẩu");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

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
import AsyncStorage from "@react-native-async-storage/async-storage";
const API_URL =
  Platform.OS === "web"
    ? "http://localhost:8080/api/auth/login"
    : "http://192.168.2.23:8080/api/auth/login";

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

      if (!res.ok) throw new Error("Sai tài khoản hoặc mật khẩu");

      await AsyncStorage.setItem("token", data.token);

      alert("Đăng nhập thành công!");

      if (data.role === "ADMIN") {
        navigation.replace("AdminDashboard");
      } else {
        navigation.replace("RegisterBusiness");
      }
    } catch (err: any) {
      alert("❌ Lỗi login: " + (err.message || "Sai tài khoản hoặc mật khẩu"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🍜 Vĩnh Khánh Food Guide</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Đăng nhập</Text>

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

        <Pressable style={styles.button} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Đăng nhập</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("RegisterUser")}
        >
          <Text style={styles.secondaryText}>📝 Tạo tài khoản</Text>
        </Pressable>

        <Pressable
          style={styles.guestButton}
          onPress={() =>
            navigation.replace("MainTabs", {
              screen: "Home",
              params: { guest: true },
            })
          }
        >
          <Text style={styles.buttonText}>
            🚀 Vào ứng dụng (không cần đăng nhập)
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff7ed",
  },

  logo: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  secondaryButton: {
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },

  secondaryText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  guestButton: {
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
});
