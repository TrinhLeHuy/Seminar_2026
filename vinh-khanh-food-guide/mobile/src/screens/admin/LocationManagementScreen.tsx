import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";

export default function LocationManagementScreen({ navigation }: any) {
  const [locations, setLocations] = useState<any[]>([]);
  const totalPOI = locations.length;
  const totalFood = locations.reduce(
    (sum, loc) => sum + (loc.foods?.length || 0),
    0,
  );
  const totalAudio = locations.reduce(
    (sum, loc) => sum + (loc.audioGuides?.length || 0),
    0,
  );

  const API = "http://localhost:8080/api/locations";

  const fetchLocations = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const deleteLocation = async (id: number) => {
    Alert.alert("Xóa Location", "Bạn chắc chắn muốn xóa?", [
      { text: "Cancel" },
      {
        text: "OK",
        onPress: async () => {
          await fetch(`${API}/${id}`, {
            method: "DELETE",
          });
          fetchLocations();
        },
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      {/* Location Info */}
      <Text style={styles.title}>{item.name}</Text>

      <Text style={styles.description}>
        {item.description || "No description"}
      </Text>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("LocationDetailScreen", {
              locationId: item.locationId,
            })
          }
        >
          <Text style={styles.buttonText}>✏️ Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteLocation(item.locationId)}
        >
          <Text style={styles.buttonText}>🗑 Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topRow}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("LocationCreate")}
        >
          <Text style={styles.addText}>+ Add Location</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList với header */}
      <FlatList
        data={locations}
        keyExtractor={(item) => item.locationId.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <View
            style={{
              padding: 12,
              backgroundColor: "#f0f0f0",
              borderBottomWidth: 1,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Tổng POI: {totalPOI}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Tổng Food: {totalFood}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Tổng Audio: {totalAudio}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  description: {
    marginTop: 6,
    color: "#666",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
  },

  editButton: {
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 10,
  },

  backBtn: {
    padding: 8,
  },

  backText: {
    fontSize: 18,
    color: "blue",
  },

  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
