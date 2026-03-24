import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
  Platform,
} from "react-native";
import * as Speech from "expo-speech";
import { useLanguage } from "../i18n/LanguageContext";
import { getFoods } from "../api/food";
import { voiceMap } from "../i18n/translations";
import { Ionicons } from "@expo/vector-icons";
import MapComponent from "../components/Map";

import QRScannerMobile from "../components/QRScanner.native";
import QRScannerWeb from "../components/QRScanner.web";

const BASE_URL = "http://172.20.10.12:8080";

export default function QRScannerScreen() {
  const { lang } = useLanguage();

  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [region, setRegion] = useState({
    latitude: 10.742774,
    longitude: 106.699181,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // ✅ Load foods theo ngôn ngữ
  useEffect(() => {
    const loadFoods = async () => {
      const data = await getFoods(lang);
      setFoods(data);
    };
    loadFoods();
  }, [lang]);

  // ✅ Sync food sau khi scan (fix web chậm)
  useEffect(() => {
    if (!selectedLocation || !foods.length) return;

    const food = foods.find(
      (f) => String(f.locationId) === String(selectedLocation.locationId)
    );

    setSelectedFood(food);

    if (food) {
      speak(food, selectedLocation);
    }
  }, [selectedLocation, foods]);

  // ✅ STOP khi đổi ngôn ngữ
  useEffect(() => {
    Speech.stop();
    setIsPlaying(false);
  }, [lang]);

  // ✅ Đổi ngôn ngữ → đọc lại (giống Home)
  useEffect(() => {
    if (selectedFood || selectedLocation) {
      speak(selectedFood, selectedLocation);
    }
  }, [lang]);

  // ✅ Hàm đọc (fix web + fallback)
  const speak = (food?: any, loc?: any) => {
    let text = "";

    if (food?.description) text = food.description;
    else if (loc?.description) text = loc.description;
    else text = loc?.name;

    if (!text) return;

    Speech.stop();

    let language = voiceMap[lang] || "vi-VN";

    // 🔥 FIX WEB
    if (Platform.OS === "web") {
      const supported = ["vi-VN", "en-US", "ja-JP", "ko-KR", "zh-CN"];
      if (!supported.includes(language)) {
        language = "en-US";
      }
    }

    Speech.speak(text, {
      language,
      rate: 0.9,
      pitch: 1.0,
      onDone: () => setIsPlaying(false),
    });

    setIsPlaying(true);
  };

  // ✅ Scan
  const handleScan = async (data: string) => {
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/qr-scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrValue: data, lang }),
      });

      const location = await res.json();
      setSelectedLocation(location);

      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } catch (err) {
      console.log(err);
      alert("Cannot connect server");
    } finally {
      setLoading(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    } else {
      speak(selectedFood, selectedLocation);
    }
  };

  const reset = () => {
    Speech.stop();
    setSelectedLocation(null);
    setSelectedFood(null);
  };

  // ✅ Fix ảnh web
  const getImageUri = (url?: string) => {
    if (!url) return "https://via.placeholder.com/300";
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url}`;
  };

  return (
    <View style={{ flex: 1 }}>
      {!selectedLocation && (
        <>
          {Platform.OS === "web" ? (
            <QRScannerWeb onScan={handleScan} />
          ) : (
            <QRScannerMobile onScan={handleScan} />
          )}
        </>
      )}

      {loading && <ActivityIndicator size="large" />}

      {selectedLocation && (
        <>
          <View style={styles.map}>
            <MapComponent
              location={selectedLocation}
              locations={[selectedLocation]}
            />
          </View>

          {selectedFood ? (
            <View style={styles.card}>
              <Image
                source={{ uri: getImageUri(selectedFood.imageUrl) }}
                style={styles.img}
              />

              <Text style={styles.title}>{selectedFood.name}</Text>

              <Text style={styles.desc}>
                {selectedFood.description}
              </Text>

              <Pressable style={styles.audioBtn} onPress={toggleAudio}>
                <Ionicons
                  name={isPlaying ? "pause-circle" : "play-circle"}
                  size={32}
                  color="#fff"
                />
              </Pressable>

              <Pressable style={styles.btn} onPress={reset}>
                <Text style={{ color: "#fff" }}>Scan Again</Text>
              </Pressable>
            </View>
          ) : (
            <ActivityIndicator style={{ marginTop: 20 }} />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 300,
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  img: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    resizeMode: "cover",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
  },
  desc: {
    color: "#666",
    marginTop: 4,
  },
  audioBtn: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  btn: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
  },
});