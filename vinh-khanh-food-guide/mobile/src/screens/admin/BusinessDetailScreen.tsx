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

export default function BusinessDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { id } = route.params as { id: number };

  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    if (Platform.OS === "web") {
      return localStorage.getItem("token");
    }
    return await AsyncStorage.getItem("token");
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = await getToken();

        const res = await fetch(`${API_BASE}/api/business/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const text = await res.text();

        if (!text) return;

        const data = JSON.parse(text);

        setBusiness(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy dữ liệu</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{ padding: 16, paddingTop: 0 }}
    >
      <View style={styles.container}>
        {/* BACK BUTTON */}
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Quay lại</Text>
        </Pressable>

        {/* IMAGE
        <Image
          source={{
            uri: business.imageUrl || "https://via.placeholder.com/500",
          }}
          style={styles.image}
        /> */}

        {/* LOCATION INFO */}
        <View style={styles.card}>
          <Text style={styles.title}>{business.name}</Text>

          <Text style={styles.address}>📍 {business.address}</Text>

          <Text style={styles.desc}>
            {business.description || "Chưa có mô tả"}
          </Text>
        </View>

        {/* FOOD */}
        <View style={styles.card}>
          <Text style={styles.section}>🍜 Thông tin món ăn</Text>

          <Text>🇻🇳 {business.foodNameVi}</Text>
          <Text>🇬🇧 {business.foodNameEn}</Text>

          <Text style={styles.price}>
            💰 {business.price?.toLocaleString()} đ
          </Text>

          <Image
            source={{
              uri: business.foodImageUrl || "https://via.placeholder.com/500",
            }}
            style={styles.foodImage}
          />

          <Text style={styles.subTitle}>Mô tả VI</Text>
          <Text>{business.foodDescriptionVi}</Text>

          <Text style={styles.subTitle}>Description EN</Text>
          <Text>{business.foodDescriptionEn}</Text>
        </View>

        {/* AUDIO */}
        <View style={styles.card}>
          <Text style={styles.section}>🎧 Audio</Text>

          <Text>Language: {business.audioLanguage}</Text>
        </View>

        {/* TIME */}
        <View style={styles.card}>
          <Text style={styles.section}>📅 Thời gian</Text>

          <Text>Created: {business.createdAt}</Text>
          <Text>Approved: {business.approvedAt || "Chưa duyệt"}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },

  container: {
    maxWidth: 700,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backBtn: {
    marginBottom: 12,
  },

  backText: {
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111827",
  },

  address: {
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 12,
  },

  desc: {
    lineHeight: 22,
    fontSize: 15,
    color: "#374151",
  },

  section: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111827",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 6,
  },

  subTitle: {
    fontWeight: "bold",
    marginTop: 12,
    fontSize: 16,
    color: "#111827",
  },

  price: {
    color: "#ef4444",
    fontWeight: "bold",
    marginVertical: 8,
    fontSize: 16,
  },

  foodImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginVertical: 10,
    resizeMode: "cover",
  },

  audioBtn: {
    marginTop: 12,
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  audioText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
