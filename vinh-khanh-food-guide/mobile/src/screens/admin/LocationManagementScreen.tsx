// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   Pressable,
// } from "react-native";

// export default function LocationManagementScreen({ navigation }: any) {
//   const [locations, setLocations] = useState<any[]>([]);
//   const totalPOI = locations.length;
//   const totalFood = locations.reduce(
//     (sum, loc) => sum + (loc.foods?.length || 0),
//     0,
//   );
//   const totalAudio = locations.reduce(
//     (sum, loc) => sum + (loc.audioGuides?.length || 0),
//     0,
//   );

//   const API = "http://localhost:8080/api/locations";

//   const fetchLocations = async () => {
//     try {
//       const res = await fetch(API);
//       const data = await res.json();
//       setLocations(data);
//     } catch (err) {
//       console.log("ERROR:", err);
//     }
//   };

//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   const deleteLocation = async (id: number) => {
//     Alert.alert("Xóa Location", "Bạn chắc chắn muốn xóa?", [
//       { text: "Cancel" },
//       {
//         text: "OK",
//         onPress: async () => {
//           await fetch(`${API}/${id}`, {
//             method: "DELETE",
//           });
//           fetchLocations();
//         },
//       },
//     ]);
//   };

//   const renderItem = ({ item }: any) => (
//     <View style={styles.card}>
//       {/* Location Info */}
//       <Text style={styles.title}>{item.name}</Text>

//       <Text style={styles.description}>
//         {item.description || "No description"}
//       </Text>

//       {/* Buttons */}
//       <View style={styles.buttonRow}>
//         <TouchableOpacity
//           style={styles.editButton}
//           onPress={() =>
//             navigation.navigate("LocationDetailScreen", {
//               locationId: item.locationId,
//             })
//           }
//         >
//           <Text style={styles.buttonText}>✏️ Edit</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.deleteButton}
//           onPress={() => deleteLocation(item.locationId)}
//         >
//           <Text style={styles.buttonText}>🗑 Delete</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       <View style={styles.topRow}>
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={() => navigation.navigate("LocationCreate")}
//         >
//           <Text style={styles.addText}>+ Add Location</Text>
//         </TouchableOpacity>
//       </View>

//       {/* FlatList với header */}
//       <FlatList
//         data={locations}
//         keyExtractor={(item) => item.locationId.toString()}
//         renderItem={renderItem}
//         ListHeaderComponent={
//           <View
//             style={{
//               padding: 12,
//               backgroundColor: "#f0f0f0",
//               borderBottomWidth: 1,
//               marginBottom: 8,
//             }}
//           >
//             <Text style={{ fontSize: 16, fontWeight: "bold" }}>
//               Tổng POI: {totalPOI}
//             </Text>
//             <Text style={{ fontSize: 16, fontWeight: "bold" }}>
//               Tổng Food: {totalFood}
//             </Text>
//             <Text style={{ fontSize: 16, fontWeight: "bold" }}>
//               Tổng Audio: {totalAudio}
//             </Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,

//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 3,
//   },

//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },

//   description: {
//     marginTop: 6,
//     color: "#666",
//   },

//   buttonRow: {
//     flexDirection: "row",
//     marginTop: 12,
//   },

//   editButton: {
//     backgroundColor: "#3498db",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   topRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     marginTop: 10,
//   },

//   backBtn: {
//     padding: 8,
//   },

//   backText: {
//     fontSize: 18,
//     color: "blue",
//   },

//   addButton: {
//     backgroundColor: "#4CAF50",
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },

//   addText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   deleteButton: {
//     backgroundColor: "#e74c3c",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },

//   buttonText: {
//     color: "#fff",
//     fontWeight: "600",
//   },
// });
import React, { useEffect, useState } from "react";
import LocationDetailScreen from "../LocationDetailScreen";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import LocationCreateScreen from "../LocationCreateScreen";
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
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editLocation, setEditLocation] = useState<any | null>(null);
  // const API = "http://localhost:8080/api/locations";
  const API_BASE =
    Platform.OS === "web"
      ? "http://localhost:8080"
      : "http://192.168.2.23:8080";
  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/locations`);
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
    if (Platform.OS === "web") {
      const ok = window.confirm("Bạn chắc chắn muốn xóa?");
      if (!ok) return;
      await callDelete(id);
    } else {
      Alert.alert("Xóa Location", "Bạn chắc chắn muốn xóa?", [
        { text: "Cancel" },
        {
          text: "OK",
          onPress: () => callDelete(id),
        },
      ]);
    }
  };

  const callDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/locations/${id}`, {
        method: "DELETE",
      });

      console.log("DELETE STATUS:", res.status);

      fetchLocations();
    } catch (err) {
      console.log(err);
    }
  };
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`${API_BASE}/api/locations/${deleteId}`, {
        method: "DELETE",
      });

      setLocations((prev) => prev.filter((l) => l.locationId !== deleteId));

      setShowConfirm(false);
    } catch (err) {
      console.log(err);
    }
  };
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.poiTag}>POI</Text>
      </View>

      <Text style={styles.description}>
        {item.description || "No description"}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>🍜 {item.foods?.length || 0} foods</Text>

        <Text style={styles.infoText}>
          🔊 {item.audioGuides?.length || 0} audio
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditLocation(item)}
        >
          <Text style={styles.buttonText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            setDeleteId(item.locationId);
            setShowConfirm(true);
          }}
        >
          <Text style={styles.buttonText}>🗑 Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>📍 Location Management</Text>
          <Text style={styles.pageSubtitle}>
            Manage POI locations for Vĩnh Khánh Food Guide
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreate(true)}
        >
          <Text style={styles.addText}>+ Add Location</Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalPOI}</Text>
          <Text style={styles.statLabel}>POI</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalFood}</Text>
          <Text style={styles.statLabel}>Foods</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalAudio}</Text>
          <Text style={styles.statLabel}>Audio</Text>
        </View>
      </View>

      {/* LIST */}
      {/* LIST */}
      {showCreate ? (
        <LocationCreateScreen
          onSuccess={() => {
            setShowCreate(false);
            fetchLocations();
          }}
          onCancel={() => setShowCreate(false)}
        />
      ) : editLocation ? (
        <LocationDetailScreen
          location={editLocation}
          onSuccess={() => {
            setEditLocation(null);
            fetchLocations();
          }}
          onCancel={() => setEditLocation(null)}
        />
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.locationId.toString()}
          ListHeaderComponent={
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.nameCol]}>Name</Text>
              <Text style={[styles.tableCell, styles.descCol]}>
                Description
              </Text>
              <Text style={[styles.tableCell, styles.coordCol]}>
                Coordinates
              </Text>
              <Text style={[styles.tableCell, styles.numCol]}>Foods</Text>
              <Text style={[styles.tableCell, styles.numCol]}>Audio</Text>
              <Text style={[styles.tableCell, styles.actionsCol]}>Actions</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.nameCol]}>
                {item.name}
              </Text>
              <Text style={[styles.tableCell, styles.descCol]}>
                {item.description || "-"}
              </Text>
              <Text style={[styles.tableCell, styles.coordCol]}>
                {item.latitude && item.longitude
                  ? `${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)}`
                  : "-"}
              </Text>
              <Text style={[styles.tableCell, styles.numCol]}>
                {item.foods?.length || 0}
              </Text>
              <Text style={[styles.tableCell, styles.numCol]}>
                {item.audioGuides?.length || 0}
              </Text>
              <View style={[styles.tableCell, styles.actionsCol]}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditLocation(item)}
                >
                  <Text style={styles.buttonText}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    setDeleteId(item.locationId);
                    setShowConfirm(true);
                  }}
                >
                  <Text style={styles.buttonText}>🗑 Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      {showConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Xóa Location</Text>

            <Text style={styles.modalText}>
              Bạn chắc chắn muốn xóa location này?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={{ color: "#555" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={confirmDelete}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  coordCol: {
    flex: 2,
    textAlign: "center",
    color: "#111827",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  tableCell: {
    paddingHorizontal: 8,
  },
  nameCol: { flex: 2, fontWeight: "bold", color: "#111827" },
  descCol: { flex: 3, color: "#374151" },
  numCol: { flex: 1, textAlign: "center", color: "#111827" },
  actionsCol: { flex: 2, flexDirection: "row", justifyContent: "flex-end" },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f6f7fb",
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  pageSubtitle: {
    color: "#6b7280",
    marginTop: 4,
  },

  addButton: {
    backgroundColor: "#f97316",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22, // pill button
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // STATS
  statsRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginRight: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  statLabel: {
    marginTop: 4,
    color: "#6b7280",
  },

  // CARD TABLE
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  poiTag: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    color: "#0369a1",
    fontWeight: "600",
  },
  description: {
    marginTop: 8,
    color: "#6b7280",
  },

  // INFO ROW
  infoRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  infoText: {
    marginRight: 16,
    color: "#374151",
    fontWeight: "500",
  },

  // BUTTONS
  buttonRow: {
    flexDirection: "row",
    marginTop: 14,
  },
  editButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // MODAL
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 14,
    width: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },
  modalText: {
    color: "#6b7280",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
});
