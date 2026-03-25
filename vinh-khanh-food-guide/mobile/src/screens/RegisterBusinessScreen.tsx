import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";

const RegisterBusinessScreen = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  const handleSubmit = async () => {
    if (!name || !description) {
      alert("Nhập đầy đủ thông tin");
      return;
    }

    try {
      // TODO: call API create location (pending)
      console.log({ name, description, latitude, longitude });

      alert("Đăng ký thành công! Chờ admin duyệt");
    } catch {
      alert("Lỗi gửi đăng ký");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏪 Đăng ký doanh nghiệp</Text>

      <TextInput
        placeholder="Tên quán"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Mô tả"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        placeholder="Latitude (vd: 10.74277)"
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
      />

      <TextInput
        placeholder="Longitude (vd: 106.69918)"
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.btnText}>Gửi đăng ký</Text>
      </Pressable>
    </ScrollView>
  );
};

export default RegisterBusinessScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});