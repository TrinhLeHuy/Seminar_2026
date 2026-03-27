import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
const API = "http://localhost:8080/api/locations";

export default function LocationDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { locationId } = route.params;

  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [audioGuides, setAudioGuides] = useState<
    { language: string; audioUrl: string }[]
  >([]);
  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const res = await fetch(`${API}/${locationId}`);
      const data = await res.json();

      setLocation(data);

      setName(data.name || "");
      setDescription(data.description || "");
      setLatitude(String(data.latitude || ""));
      setLongitude(String(data.longitude || ""));

      // Update audioGuides từ API
      setAudioGuides(
        data.audioGuides?.length
          ? data.audioGuides
          : [{ language: "", audioUrl: "" }],
      );
    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ...

  const updateLocation = async () => {
    try {
      // Gửi request PUT lên server
      const res = await fetch(`${API}/${location.locationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          latitude: Number(latitude),
          longitude: Number(longitude),
        }),
      });

      console.log("STATUS:", res.status);
      const text = await res.text(); // lấy raw text
      console.log("RESPONSE:", text);

      if (res.ok) {
        // Nếu thành công, hiển thị toast
        Toast.show({
          type: "success",
          text1: "Location updated successfully",
          position: "top",
          visibilityTime: 1500, // hiển thị 1.5s
        });

        // Delay nhỏ để toast kịp hiển thị rồi mới back
        setTimeout(() => {
          navigation.goBack();
        }, 1600);
      } else {
        // Nếu thất bại, hiển thị toast lỗi
        Toast.show({
          type: "error",
          text1: "Update failed",
          position: "top",
          visibilityTime: 1500,
        });
      }
    } catch (err) {
      console.log("UPDATE ERROR:", err);
      Toast.show({
        type: "error",
        text1: "An error occurred",
        position: "top",
        visibilityTime: 1500,
      });
    }
  };
  /* LOADING SCREEN */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <Text>Location not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* BACK BUTTON */}

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>⬅ Back</Text>
      </TouchableOpacity>

      {/* LOCATION INFO */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📍 Location</Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Location name"
        />

        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
        />

        <TextInput
          style={styles.input}
          value={latitude}
          onChangeText={setLatitude}
          placeholder="Latitude"
        />

        <TextInput
          style={styles.input}
          value={longitude}
          onChangeText={setLongitude}
          placeholder="Longitude"
        />
      </View>

      {/* FOODS */}

      {/* FOODS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🍜 Food Info</Text>

        {(location.foods && location.foods.length > 0
          ? location.foods
          : [{}]
        ).map((food: any, index: number) => (
          <View key={index} style={styles.foodBlock}>
            <Text style={styles.foodTitle}>Food #{index + 1}</Text>

            <TextInput
              style={styles.input}
              defaultValue={food.name || ""}
              placeholder="Food name"
              onChangeText={(text) => {
                if (!location.foods) location.foods = [];
                location.foods[index] = {
                  ...location.foods[index],
                  name: text,
                };
              }}
            />

            <TextInput
              style={styles.input}
              defaultValue={food.price ? String(food.price) : ""}
              placeholder="Price"
              keyboardType="numeric"
              onChangeText={(text) => {
                if (!location.foods) location.foods = [];
                location.foods[index] = {
                  ...location.foods[index],
                  price: Number(text),
                };
              }}
            />

            <TextInput
              style={styles.input}
              defaultValue={food.description || ""}
              placeholder="Food description"
              multiline
              onChangeText={(text) => {
                if (!location.foods) location.foods = [];
                location.foods[index] = {
                  ...location.foods[index],
                  description: text,
                };
              }}
            />
          </View>
        ))}
      </View>
      {/* AUDIO GUIDES */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🎧 Audio Guides</Text>

        {audioGuides.map((audio, index) => (
          <View key={index} style={styles.audioBlock}>
            <Text style={styles.audioTitle}>Audio #{index + 1}</Text>

            <TextInput
              style={styles.input}
              placeholder="Language (vi/en)"
              value={audio.language}
              onChangeText={(text) => {
                const updated = [...audioGuides];
                updated[index].language = text;
                setAudioGuides(updated);
              }}
            />

            <TextInput
              style={styles.input}
              placeholder="Audio URL"
              value={audio.audioUrl}
              onChangeText={(text) => {
                const updated = [...audioGuides];
                updated[index].audioUrl = text;
                setAudioGuides(updated);
              }}
            />
          </View>
        ))}

        {/* Nút thêm Audio mới */}
        <TouchableOpacity
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 8,
            backgroundColor: "#3498db",
            alignItems: "center",
          }}
          onPress={() =>
            setAudioGuides([...audioGuides, { language: "", audioUrl: "" }])
          }
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Add Audio</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📷 QR Code</Text>

        <TextInput
          style={styles.input}
          defaultValue={location.qrCode?.qrValue}
          placeholder="QR value"
        />
      </View>
      {/* SAVE BUTTON */}

      <TouchableOpacity style={styles.saveBtn} onPress={updateLocation}>
        <Text style={styles.saveText}>💾 Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  foodBlock: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  foodTitle: { fontWeight: "bold", fontSize: 16 },
  audioBlock: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  audioTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  saveBtn: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  backBtn: {
    marginBottom: 15,
  },

  backText: {
    fontSize: 16,
    color: "#ef4444",
  },

  foodCard: {
    marginBottom: 12,
  },

  itemRow: {
    marginBottom: 8,
  },

  qr: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
