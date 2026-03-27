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
    backgroundColor: "#f5f5f5",
  },

  container: {
    maxWidth: 700,
    alignSelf: "center",
    width: "100%",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backBtn: {
    marginBottom: 8,
  },

  backText: {
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: 16,
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginBottom: 8,
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },

  address: {
    color: "#666",
    marginBottom: 10,
  },

  desc: {
    lineHeight: 20,
  },

  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subTitle: {
    fontWeight: "bold",
    marginTop: 10,
  },

  price: {
    color: "red",
    fontWeight: "bold",
    marginVertical: 8,
  },

  foodImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginVertical: 10,
  },

  audioBtn: {
    marginTop: 10,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  audioText: {
    color: "white",
    fontWeight: "bold",
  },
});
