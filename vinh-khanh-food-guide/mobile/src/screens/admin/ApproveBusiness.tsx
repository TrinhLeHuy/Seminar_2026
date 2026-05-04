import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import BusinessDetailScreen from "./BusinessDetailScreen";

interface Business {
  id: number;
  name: string;
  foodNameVi: string;
  price: number;
  address: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface Column {
  key: keyof Business | "actions" | "detail";
  label: string;
  flex?: number;
}

const columns: Column[] = [
  { key: "name", label: "Tên quán", flex: 2 },
  { key: "foodNameVi", label: "Món ăn", flex: 2 },
  { key: "price", label: "Giá", flex: 1 },
  { key: "address", label: "Địa chỉ", flex: 2 },
  { key: "status", label: "Trạng thái", flex: 1 },
  { key: "actions", label: "Hành động", flex: 2 },
  { key: "detail", label: "Xem chi tiết", flex: 1 },
];

export default function ApproveBusinessScreen() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const loadToken = async () => {
      const t = await AsyncStorage.getItem("token");
      setToken(t);
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchBusinesses = async () => {
      try {
        const res = await fetch("http://172.23.200.167/api/business/pending", {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (Array.isArray(data)) setBusinesses(data);
        else console.warn("Dữ liệu trả về không phải mảng:", data);
      } catch (err) {
        console.error("Lỗi fetch businesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [token]);

  const handleApprove = (id: number) =>
    setBusinesses((prev) => prev.filter((b) => b.id !== id));

  const handleReject = (id: number) =>
    setBusinesses((prev) => prev.filter((b) => b.id !== id));

  const handleViewDetail = (id: number) => {
    setSelectedBusinessId(id);
  };

  const getStatusColor = (status: Business["status"]) => {
    switch (status) {
      case "APPROVED":
        return "#10b981";
      case "REJECTED":
        return "#ef4444";
      default:
        return "#f59e0b";
    }
  };

  const renderCell = (item: Business, col: Column) => {
    const commonStyle = [styles.cell, { flex: col.flex ?? 1 }];

    switch (col.key) {
      case "actions":
        return (
          <View key={col.key} style={[...commonStyle, styles.actions]}>
            <Pressable
              style={styles.approve}
              onPress={() => handleApprove(item.id)}
            >
              <Text style={styles.btnText}>Duyệt</Text>
            </Pressable>

            <Pressable
              style={styles.reject}
              onPress={() => handleReject(item.id)}
            >
              <Text style={styles.btnText}>Từ chối</Text>
            </Pressable>
          </View>
        );

      case "detail":
        return (
          <Pressable
            key={col.key}
            style={[...commonStyle, styles.detail]}
            onPress={() => handleViewDetail(item.id)}
          >
            <Text style={styles.btnText}>Xem chi tiết</Text>
          </Pressable>
        );

      case "status":
        return (
          <Text
            key={col.key}
            style={[
              ...commonStyle,
              { color: getStatusColor(item.status), fontWeight: "bold" },
            ]}
          >
            {item.status}
          </Text>
        );

      case "price":
        return (
          <Text key={col.key} style={commonStyle}>
            {item.price.toLocaleString()} đ
          </Text>
        );

      default:
        return (
          <Text key={col.key} style={commonStyle}>
            {item[col.key as keyof Business]}
          </Text>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛠️ Duyệt quán ăn</Text>
        <Text style={styles.headerSubtitle}>
          Danh sách các quán đang chờ phê duyệt
        </Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#3b82f6" />
          <Text>Đang tải dữ liệu...</Text>
        </View>
      ) : selectedBusinessId ? (
        <View style={{ flex: 1 }}>
          <Pressable
            style={{ padding: 12 }}
            onPress={() => setSelectedBusinessId(null)}
          >
            <Text style={{ color: "#ef4444", fontWeight: "bold" }}>
              ← Quay lại danh sách
            </Text>
          </Pressable>

          <BusinessDetailScreen businessId={selectedBusinessId} />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.tableContainer}>
            <View style={[styles.row, styles.tableHeader]}>
              {columns.map((col) => (
                <Text
                  key={col.key}
                  style={[styles.cell, { flex: col.flex ?? 1 }]}
                >
                  {col.label}
                </Text>
              ))}
            </View>

            {businesses.length === 0 ? (
              <View style={styles.noData}>
                <Text>Không có quán chờ duyệt</Text>
              </View>
            ) : (
              businesses.map((item) => (
                <View key={item.id} style={styles.row}>
                  {columns.map((col) => renderCell(item, col))}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },

  loading: {
    padding: 20,
    alignItems: "center",
  },

  tableContainer: {
    flex: 1,
    margin: 8,
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 12,
    alignItems: "center",
  },

  tableHeader: {
    backgroundColor: "#f3f4f6",
  },

  cell: {
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#111827",
    textAlign: "left",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  approve: {
    backgroundColor: "#10b981",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 4,
  },

  reject: {
    backgroundColor: "#ef4444",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  detail: {
    backgroundColor: "#3b82f6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  noData: {
    padding: 20,
    alignItems: "center",
  },
});
