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
    ? "http://localhost:8080/api/auth/register"
    : "http://172.23.200.235:8080/api/auth/register";

export default function RegisterUserScreen({ navigation }: any) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    setError("");

    if (!form.username || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (form.password.length < 6) {
      setError("Mật khẩu phải >= 6 ký tự");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          role: "USER",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      alert("Tạo tài khoản thành công");

      navigation.goBack();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🍜 Vĩnh Khánh Food Guide</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Đăng ký</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={form.username}
          onChangeText={(v) => handleChange("username", v)}
        />

        <TextInput
          placeholder="Mật khẩu"
          secureTextEntry
          style={styles.input}
          value={form.password}
          onChangeText={(v) => handleChange("password", v)}
        />

        <TextInput
          placeholder="Nhập lại mật khẩu"
          secureTextEntry
          style={styles.input}
          value={form.confirmPassword}
          onChangeText={(v) => handleChange("confirmPassword", v)}
        />

        <Pressable style={styles.button} onPress={handleRegister}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Đăng ký</Text>
          )}
        </Pressable>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.loginLink}>Đã có tài khoản? Đăng nhập</Text>
        </Pressable>
      </View>
    </View>
  );
}

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

  loginLink: {
    marginTop: 15,
    textAlign: "center",
    color: "#ea580c",
  },

  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
