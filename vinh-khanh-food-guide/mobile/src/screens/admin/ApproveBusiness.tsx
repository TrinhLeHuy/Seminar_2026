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

const API_BASE =
  Platform.OS === "web" ? "http://localhost:8080" : "http://192.168.2.23:8080";

export default function ApproveBusinessScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = Platform.OS === "web" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const token = await getToken();

      const res = await fetch(`${API_BASE}/api/admin/business/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      console.log("DATA:", json);

      setData(json);
    } catch (err) {
      console.log("ERROR:", err);
      Alert.alert("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id: number) => {
    try {
      await fetch(`${API_BASE}/api/admin/business/${id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("✅ Đã duyệt");
      setData(data.filter((b) => b.id !== id));
    } catch {
      Alert.alert("Lỗi duyệt");
    }
  };

  const reject = async (id: number) => {
    try {
      await fetch(`${API_BASE}/api/admin/business/${id}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("❌ Đã từ chối");
      setData(data.filter((b) => b.id !== id));
    } catch {
      Alert.alert("Lỗi từ chối");
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>

        <Text style={styles.food}>🍜 {item.foodName}</Text>

        <Text style={styles.price}>{item.price}đ</Text>

        <Text style={styles.address}>{item.address}</Text>

        <Text style={styles.status}>
          {item.status === "PENDING" && "🟠 Chờ duyệt"}
          {item.status === "APPROVED" && "🟢 Đã duyệt"}
          {item.status === "REJECTED" && "🔴 Từ chối"}
        </Text>

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.approve]}
            onPress={() =>
              Alert.alert("Duyệt quán?", "", [
                { text: "Huỷ" },
                { text: "Duyệt", onPress: () => approve(item.id) },
              ])
            }
          >
            <Text style={styles.btnText}>Duyệt</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.reject]}
            onPress={() =>
              Alert.alert("Từ chối?", "", [
                { text: "Huỷ" },
                { text: "Từ chối", onPress: () => reject(item.id) },
              ])
            }
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
      <Text style={styles.title}>🛠️ Duyệt quán ăn</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fafafa",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 150,
  },

  info: {
    padding: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  food: {
    marginTop: 4,
    color: "#555",
  },

  price: {
    marginTop: 4,
    fontWeight: "bold",
    color: "#ef4444",
  },

  address: {
    marginTop: 4,
    color: "#666",
  },

  status: {
    marginTop: 6,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  approve: {
    backgroundColor: "#22c55e",
  },

  reject: {
    backgroundColor: "#ef4444",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  center: {
    flex: 1,
    justifyContent: "center",
  },
});
