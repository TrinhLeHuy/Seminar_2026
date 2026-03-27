import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LocationCreateScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("10.0");
  const [longitude, setLongitude] = useState("106.0");
  const [imageUrl, setImageUrl] = useState("");

  const createLocation = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Toast.show({ type: "error", text1: "User not logged in!" });
        return;
      }

      const payload = {
        name,
        description,
        latitude,
        longitude,
        imageUrl,
        foods: [],
        audioGuides: [],
        qrCodes: [],
      };

      const res = await fetch("http://localhost:8080/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed");

      Toast.show({ type: "success", text1: "Location created successfully!" });
      setTimeout(() => navigation.goBack(), 3000);
      // Quay lại ngay sau khi tạo thành công
      navigation.navigate("LocationManagementScreen");
    } catch (err) {
      console.log("CREATE ERROR:", err);
      Toast.show({ type: "error", text1: "Error creating location" });
    }
  };
  const inputStyle = {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity
          style={{
            marginBottom: 20,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: "#ef4444",
            alignSelf: "flex-start",
          }}
          onPress={() => navigation.navigate("LocationManagementScreen")} // hoặc navigation.navigate("LocationManagementScreen")
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>⬅ Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
          Create New Location
        </Text>

        <Text style={{ marginBottom: 4, fontWeight: "600" }}>Name</Text>
        <TextInput
          placeholder="Location Name"
          value={name}
          onChangeText={setName}
          style={inputStyle}
        />

        <Text style={{ marginBottom: 4, fontWeight: "600" }}>Description</Text>
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={{ ...inputStyle, height: 80, textAlignVertical: "top" }}
          multiline
        />

        <Text style={{ marginBottom: 4, fontWeight: "600" }}>Latitude</Text>
        <TextInput
          placeholder="Latitude"
          value={latitude}
          onChangeText={setLatitude}
          style={inputStyle}
          keyboardType="numeric"
        />

        <Text style={{ marginBottom: 4, fontWeight: "600" }}>Longitude</Text>
        <TextInput
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
          style={inputStyle}
          keyboardType="numeric"
        />

        <Text style={{ marginBottom: 4, fontWeight: "600" }}>Image URL</Text>
        <TextInput
          placeholder="Image URL"
          value={imageUrl}
          onChangeText={setImageUrl}
          style={inputStyle}
        />

        <TouchableOpacity
          onPress={createLocation}
          style={{
            backgroundColor: "#4CAF50",
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Create Location
          </Text>
        </TouchableOpacity>

        <Toast />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
