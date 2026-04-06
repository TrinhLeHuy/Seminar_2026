import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Platform,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE =
  Platform.OS === "web" ? "http://localhost:8080" : "http://192.168.2.23:8080";

interface Business {
  id: number;
  name: string;
  address: string;
  description?: string;
  foodNameVi?: string;
  foodNameEn?: string;
  price?: number;
  foodImageUrl?: string;
  foodDescriptionVi?: string;
  foodDescriptionEn?: string;
  audioUrl?: string;
  createdAt?: string;
  approvedAt?: string;
}

export default function BusinessDetailScreen({
  businessId,
  onBack,
}: {
  businessId: number;
  onBack?: () => void;
}) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    if (Platform.OS === "web") return localStorage.getItem("token");
    return await AsyncStorage.getItem("token");
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = await getToken();
        if (!token) return setLoading(false);

        const res = await fetch(`${API_BASE}/api/business/${businessId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return setLoading(false);

        const data: Business = await res.json();
        setBusiness(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [businessId]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!business)
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy dữ liệu</Text>
      </View>
    );

  const openAudio = () => {
    if (business.audioUrl) {
      Linking.openURL(business.audioUrl).catch(console.log);
    }
  };
  return (
    <View style={styles.page}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chi tiết quán ăn</Text>
          <Text style={styles.headerSubtitle}>
            Thông tin được người dùng đăng ký
          </Text>
        </View>

        {/* BUSINESS INFO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🏪 Thông tin quán</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Tên quán</Text>
              <Text style={styles.value}>{business.name}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Địa chỉ</Text>
              <Text style={styles.value}>{business.address}</Text>
            </View>

            <View style={styles.infoItemFull}>
              <Text style={styles.label}>Mô tả</Text>
              <Text style={styles.value}>
                {business.description || "Chưa có mô tả"}
              </Text>
            </View>
          </View>
        </View>

        {/* FOOD INFO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🍜 Thông tin món ăn</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Tên món (VI)</Text>
              <Text style={styles.value}>
                {business.foodNameVi || "Chưa có"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Food (EN)</Text>
              <Text style={styles.value}>
                {business.foodNameEn || "No name"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Giá</Text>
              <Text style={styles.price}>
                {business.price
                  ? business.price.toLocaleString() + " đ"
                  : "Chưa có"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.subTitle}>Mô tả (VI)</Text>
          <Text style={styles.textBlock}>
            {business.foodDescriptionVi || "Chưa có mô tả"}
          </Text>

          <Text style={styles.subTitle}>Description (EN)</Text>
          <Text style={styles.textBlock}>
            {business.foodDescriptionEn || "No description"}
          </Text>
        </View>

        {/* TIME */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📅 Thời gian</Text>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Created</Text>
            <Text style={styles.timeValue}>
              {business.createdAt
                ? new Date(business.createdAt).toLocaleString()
                : "N/A"}
            </Text>
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Approved</Text>
            <Text style={styles.timeValue}>
              {business.approvedAt
                ? new Date(business.approvedAt).toLocaleString()
                : "Chưa duyệt"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },

  headerSubtitle: {
    color: "#6b7280",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  infoItem: {
    width: "48%",
  },

  infoItemFull: {
    width: "100%",
  },

  label: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ef4444",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  page: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },

  content: {
    padding: 20,
    paddingBottom: 50,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  heroImage: {
    width: "100%",
    height: 260,
    borderRadius: 20,
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 4,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  address: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },

  desc: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },

  section: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  foodRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  foodBadge: {
    backgroundColor: "#eef2ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  foodBadgeText: {
    fontWeight: "600",
    color: "#3730a3",
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 14,
  },

  subTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 4,
  },

  textBlock: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },

  audioBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 18,
  },

  audioText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  timeLabel: {
    fontWeight: "600",
    color: "#6b7280",
  },

  timeValue: {
    fontWeight: "600",
    color: "#111827",
  },
});
