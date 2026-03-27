// import React, { useState } from "react";
// import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";

// const ApproveBusiness = () => {
//   const [businesses, setBusinesses] = useState([
//     { id: 1, name: "Quán Bún Bò Huế" },
//     { id: 2, name: "Phở Hà Nội 24h" },
//   ]);

//   const handleApprove = (id: number) => {
//     alert("Đã duyệt!");
//     setBusinesses(businesses.filter((b) => b.id !== id));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>📋 Duyệt doanh nghiệp</Text>

//       <FlatList
//         data={businesses}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Text>{item.name}</Text>

//             <Pressable
//               style={styles.btn}
//               onPress={() => handleApprove(item.id)}
//             >
//               <Text style={{ color: "#fff" }}>Duyệt</Text>
//             </Pressable>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// export default ApproveBusiness;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },

//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },

//   card: {
//     padding: 15,
//     backgroundColor: "#eee",
//     borderRadius: 10,
//     marginBottom: 10,
//   },

//   btn: {
//     marginTop: 10,
//     backgroundColor: "green",
//     padding: 10,
//     borderRadius: 8,
//     alignItems: "center",
//   },
// });
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";

interface Business {
  id: number;
  name: string;
  imageUrl: string;
  foodName: string;
  price: number;
  address: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const API_BASE =
  Platform.OS === "web" ? "http://localhost:8080" : "http://192.168.2.23:8080";

export default function ApproveBusinessScreen() {
  const [data, setData] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const getToken = async (): Promise<string | null> => {
    if (Platform.OS === "web") {
      return localStorage.getItem("token");
    } else {
      return await AsyncStorage.getItem("token");
    }
  };

  const fetchPending = async () => {
    try {
      const token = await getToken();

      console.log("TOKEN:", token);

      const res = await fetch(`${API_BASE}/api/business/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      console.log("PENDING DATA:", json);

      setData(json);
    } catch (err) {
      console.log("FETCH ERROR", err);
      Alert.alert("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id: number) => {
    console.log("APPROVE FUNCTION RUN:", id);

    try {
      const token = await getToken();

      const res = await fetch(`${API_BASE}/api/business/approve/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text();

      console.log("APPROVE RESPONSE:", text);

      if (!res.ok) {
        throw new Error(text);
      }

      setData((prev) => prev.filter((b) => b.id !== id));

      Alert.alert("✅ Đã duyệt quán");
    } catch (err) {
      console.log("APPROVE ERROR:", err);
      Alert.alert("Duyệt thất bại");
    }
  };

  const reject = async (id: number) => {
    console.log("REJECT FUNCTION RUN:", id);

    try {
      const token = await getToken();

      const res = await fetch(`${API_BASE}/api/business/reject/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Reject failed");
      }

      setData((prev) => prev.filter((b) => b.id !== id));

      Alert.alert("❌ Đã từ chối");
    } catch (err) {
      console.log(err);
      Alert.alert("Từ chối thất bại");
    }
  };

  const renderItem = ({ item }: { item: Business }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{item.name}</Text>
        <Text>🍜 {item.foodName}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
        <Text style={styles.address}>{item.address}</Text>

        <View style={styles.row}>
          <Pressable
            style={styles.approve}
            onPress={() => {
              console.log("CLICK APPROVE", item.id);
              approve(item.id);
            }}
          >
            <Text style={styles.btnText}>Duyệt</Text>
          </Pressable>

          <Pressable
            style={styles.reject}
            onPress={() => {
              console.log("CLICK REJECT", item.id);
              reject(item.id);
            }}
          >
            <Text style={styles.btnText}>Từ chối</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛠️ Duyệt quán ăn</Text>
        <Text style={styles.headerSubtitle}>
          Xem danh sách các quán đang chờ phê duyệt
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text>Không có quán chờ duyệt</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 160,
  },

  content: {
    padding: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  price: {
    color: "red",
    fontWeight: "bold",
  },

  address: {
    color: "gray",
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },

  approve: {
    flex: 1,
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  reject: {
    flex: 1,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
});
