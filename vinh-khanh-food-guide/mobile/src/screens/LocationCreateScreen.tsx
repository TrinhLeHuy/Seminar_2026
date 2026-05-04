import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LocationCreateScreen({ onSuccess, onCancel }: any) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    imageUrl: "",

    foodNameVi: "",
    foodNameEn: "",
    foodDescriptionVi: "",
    foodDescriptionEn: "",
    price: "",
    foodImageUrl: "",

    audioUrl: "",
    audioLanguage: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const createLocation = async () => {
    try {
      if (loading) return;

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Toast.show({ type: "error", text1: "User not logged in!" });
        return;
      }

      // ✅ VALIDATE BASIC
      if (!form.name || !form.latitude || !form.longitude) {
        Toast.show({
          type: "error",
          text1: "Missing required fields",
        });
        return;
      }

      setLoading(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        imageUrl: form.imageUrl.trim(),

        foods:
          form.foodNameVi || form.foodNameEn
            ? [
                {
                  nameVi: form.foodNameVi.trim(),
                  nameEn: form.foodNameEn.trim(),
                  descriptionVi: form.foodDescriptionVi.trim(),
                  descriptionEn: form.foodDescriptionEn.trim(),
                  price: Number(form.price || 0),
                  imageUrl: form.foodImageUrl.trim(),
                },
              ]
            : [],

        audioGuides: form.audioUrl
          ? [
              {
                audioUrl: form.audioUrl.trim(),
                language: form.audioLanguage.trim() || "vi",
              },
            ]
          : [],

        qrCodes: [],
      };

      const res = await fetch("http://172.23.200.167:8080/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (!res.ok) throw new Error(text);

      Toast.show({
        type: "success",
        text1: "Location created successfully!",
      });

      setTimeout(() => {
        onSuccess && onSuccess();
      }, 1200);
    } catch (err) {
      console.log("CREATE ERROR:", err);

      Toast.show({
        type: "error",
        text1: "Error creating location",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f6f7fb" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={{ color: "#ef4444", marginBottom: 10 }}>⬅ Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create Location</Text>

        {/* LOCATION */}
        <View style={styles.card}>
          <Text style={styles.section}>📍 Location Info</Text>

          <TextInput
            placeholder="Location name"
            style={styles.input}
            onChangeText={(v) => handleChange("name", v)}
          />

          <TextInput
            placeholder="Description"
            style={styles.input}
            multiline
            onChangeText={(v) => handleChange("description", v)}
          />

          <View style={styles.row}>
            <TextInput
              placeholder="Latitude"
              style={[styles.input, styles.half]}
              keyboardType="numeric"
              onChangeText={(v) => handleChange("latitude", v)}
            />

            <TextInput
              placeholder="Longitude"
              style={[styles.input, styles.half]}
              keyboardType="numeric"
              onChangeText={(v) => handleChange("longitude", v)}
            />
          </View>

          <TextInput
            placeholder="Image URL"
            style={styles.input}
            onChangeText={(v) => handleChange("imageUrl", v)}
          />

          {!!form.imageUrl && (
            <Image source={{ uri: form.imageUrl }} style={styles.preview} />
          )}
        </View>

        {/* FOOD */}
        <View style={styles.card}>
          <Text style={styles.section}>🍜 Food</Text>

          <View style={styles.row}>
            <TextInput
              placeholder="Name VI"
              style={[styles.input, styles.half]}
              onChangeText={(v) => handleChange("foodNameVi", v)}
            />

            <TextInput
              placeholder="Name EN"
              style={[styles.input, styles.half]}
              onChangeText={(v) => handleChange("foodNameEn", v)}
            />
          </View>

          <View style={styles.row}>
            <TextInput
              placeholder="Description VI"
              style={[styles.input, styles.half]}
              onChangeText={(v) => handleChange("foodDescriptionVi", v)}
            />

            <TextInput
              placeholder="Description EN"
              style={[styles.input, styles.half]}
              onChangeText={(v) => handleChange("foodDescriptionEn", v)}
            />
          </View>

          <TextInput
            placeholder="Price"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(v) => handleChange("price", v)}
          />

          <TextInput
            placeholder="Food Image URL"
            style={styles.input}
            onChangeText={(v) => handleChange("foodImageUrl", v)}
          />

          {!!form.foodImageUrl && (
            <Image source={{ uri: form.foodImageUrl }} style={styles.preview} />
          )}
        </View>

        {/* AUDIO */}
        <View style={styles.card}>
          <Text style={styles.section}>🔊 Audio Guide</Text>

          <TextInput
            placeholder="Audio URL"
            style={styles.input}
            onChangeText={(v) => handleChange("audioUrl", v)}
          />

          <TextInput
            placeholder="Language (vi / en / zh / ko...)"
            style={styles.input}
            onChangeText={(v) => handleChange("audioLanguage", v)}
          />
        </View>

        <TouchableOpacity
          style={[styles.createBtn, loading && { opacity: 0.6 }]}
          onPress={createLocation}
          disabled={loading}
        >
          <Text style={styles.createText}>
            {loading ? "Creating..." : "Create Location"}
          </Text>
        </TouchableOpacity>

        <Toast />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  section: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  half: {
    flex: 1,
  },

  preview: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },

  createBtn: {
    backgroundColor: "#ff7a18",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  createText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
