import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

const CreateQR = () => {
  const [text, setText] = useState("");

  const handleCreateQR = () => {
    alert("QR đã được tạo cho: " + text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📷 Tạo QR Code</Text>

      <TextInput
        placeholder="Nhập nội dung QR"
        value={text}
        onChangeText={setText}
        style={styles.input}
      />

      <Pressable style={styles.btn} onPress={handleCreateQR}>
        <Text style={{ color: "#fff" }}>Tạo QR</Text>
      </Pressable>
    </View>
  );
};

export default CreateQR;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  btn: {
    backgroundColor: "#ff6b00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});