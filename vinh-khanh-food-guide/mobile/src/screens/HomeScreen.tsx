import {
  ScrollView,
  Text,
  View,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

import Header from "../components/Header";
import MapComponent from "../components/Map";
import { useLanguage } from "../i18n/LanguageContext";
import { getLocations } from "../api/location";
import { getFoods } from "../api/food";
import { Ionicons } from "@expo/vector-icons";

import * as Speech from "expo-speech";
import { voiceMap } from "../i18n/translations";

const BASE_URL = "http://192.168.66.14:8080";
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { t, lang } = useLanguage();

  const [locations, setLocations] = useState<any[]>([]);
  const [foods, setFoods] = useState<any[]>([]);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const [region, setRegion] = useState({
    latitude: 10.742774,
    longitude: 106.699181,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // 🚀 FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true);

      const locationData = await getLocations(lang);
      const foodData = await getFoods(lang);

      setLocations(locationData);
      setFoods(foodData);

      if (foodData.length > 0) {
        setSelectedFood(foodData[0]);
      }

      if (locationData.length > 0) {
        setSelectedLocation(locationData[0]);
      }
    } catch (error) {
      console.log("🚫 API lỗi", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lang]);

  useEffect(() => {
    return () => {
      if (Platform.OS === "web") {
        window.speechSynthesis.cancel();
      } else {
        Speech.stop();
      }
    };
  }, []);

  // 🎯 CHỌN LOCATION (❌ KHÔNG SPEAK)
  const handleSelectLocation = (item: any) => {
    setSelectedLocation(item);

    setRegion({
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });

    // ❌ không speak ở đây nữa
    if (Platform.OS === "web") {
      window.speechSynthesis.cancel();
    } else {
      Speech.stop();
    }

    setIsPlaying(false);
  };

  // 🔊 SPEAK (WEB + MOBILE)
  const speakLocation = (item: any, food?: any) => {
    const text =
      food?.description || item?.description || item?.name;

    if (!text) return;

    if (Platform.OS === "web") {
      if (!("speechSynthesis" in window)) {
        alert("Browser không hỗ trợ TTS");
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceMap[lang] || "vi-VN";

      setIsPlaying(true);

      utterance.onend = () => setIsPlaying(false);

      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    } else {
      Speech.stop();

      Speech.speak(text, {
        language: voiceMap[lang] || "vi-VN",
        rate: 0.9,
        onDone: () => setIsPlaying(false),
      });

      setIsPlaying(true);
    }
  };

  // ▶️ / ⏸ toggle
  const toggleAudio = () => {
    if (isPlaying) {
      if (Platform.OS === "web") {
        window.speechSynthesis.cancel();
      } else {
        Speech.stop();
      }
      setIsPlaying(false);
    } else {
      speakLocation(selectedLocation, selectedFood);
    }
  };

  const loadAndPlayAudio = () => {
    if (!selectedLocation) return;

    setAudioLoading(true);

    setTimeout(() => {
      speakLocation(selectedLocation, selectedFood);
      setAudioLoading(false);
    }, 300);
  };

  // ✅ FILTER
  const filteredLocations =
    selectedFood === null
      ? locations
      : locations.filter(
          (l) => l.locationId === selectedFood.locationId
        );

  // 🔍 SEARCH
  const finalLocations = filteredLocations.filter((location) =>
    location.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const getImageUri = (url?: string) =>
    url?.startsWith("http") ? url : `${BASE_URL}${url}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView>
        <Header />

        {/* BANNER */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
          }}
          style={styles.banner}
        />

        {/* CATEGORY */}
        <Text style={styles.sectionTitle}>{t.category}</Text>

        <ScrollView horizontal style={{ paddingLeft: 16 }}>
          {foods.map((food) => {
            const isActive = selectedFood?.foodId === food.foodId;

            return (
              <Pressable
                key={food.foodId}
                style={[
                  styles.categoryItem,
                  isActive && styles.activeCategory,
                ]}
                onPress={() => {
                  setSelectedFood(food);

                  // ✅ CHỈ SPEAK Ở ĐÂY
                  if (selectedLocation) {
                    speakLocation(selectedLocation, food);
                  }
                }}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.activeCategoryText,
                  ]}
                >
                  {food.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* MAP */}
        <View style={styles.mapContainer}>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search"
              value={searchText}
              onChangeText={setSearchText}
              style={{ flex: 1 }}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <MapComponent
              locations={finalLocations}
              location={selectedLocation || finalLocations[0]}
              onSelectLocation={handleSelectLocation}
              region={region}
            />
          )}
        </View>

        {/* LIST */}
        <ScrollView horizontal style={{ marginTop: 10 }}>
          {finalLocations
            .filter(
              (item) =>
                item.locationId !== selectedLocation?.locationId
            )
            .map((item) => (
              <Pressable
                key={item.locationId}
                style={styles.locationCard}
                onPress={() => handleSelectLocation(item)}
              >
                <Image
                  source={{ uri: getImageUri(item.imageUrl) }}
                  style={styles.locationImage}
                />
                <Text style={styles.locationName}>
                  {item.name}
                </Text>
              </Pressable>
            ))}
        </ScrollView>

        {/* INFO */}
        {selectedLocation && selectedFood && (
          <View style={styles.infoCard}>
            <Image
              source={{ uri: getImageUri(selectedFood.imageUrl) }}
              style={styles.infoImage}
            />

            <Text style={styles.infoTitle}>
              {selectedFood.name}
            </Text>

            <Text style={styles.infoDesc}>
              {selectedFood.description}
            </Text>

            <Pressable
              style={styles.audioButton}
              onPress={
                isPlaying ? toggleAudio : loadAndPlayAudio
              }
            >
              <Ionicons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={32}
                color="white"
              />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },

  sectionTitle: {
    marginLeft: 16,
    marginTop: 12,
    fontWeight: "700",
  },

  categoryItem: {
    marginRight: 12,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#EAEAEA",
    borderRadius: 20,
  },

  activeCategory: { backgroundColor: "#FF3B30" },

  categoryText: { fontSize: 14 },

  activeCategoryText: { color: "white" },

  mapContainer: {
    height: 350,
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
  },

  searchBox: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 30,
    padding: 10,
    zIndex: 1,
  },

  locationCard: {
    width: 140,
    marginLeft: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
  },

  locationImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    resizeMode: "cover",
  },

  locationName: { marginTop: 6 },

  infoCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
  },

  infoImage: {
    width: "100%",
    height: 180,
    maxWidth: 500,
    alignSelf: "center",
    borderRadius: 10,
    resizeMode: "cover",
  },

  infoTitle: {
    fontWeight: "bold",
    marginTop: 10,
  },

  infoDesc: {
    color: "#666",
    marginTop: 6,
  },

  audioButton: {
    marginTop: 12,
    backgroundColor: "#FF3B30",
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
  },
});