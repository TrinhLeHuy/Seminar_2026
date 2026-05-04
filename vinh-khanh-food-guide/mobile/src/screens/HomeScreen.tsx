import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";

import Header from "../components/Header";
import MapComponent from "../components/Map";
import { useLanguage } from "../i18n/LanguageContext";
import { getLocations } from "../api/location";
import { getFoods } from "../api/food";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Image } from "react-native";
import { getTTS, getText } from "../api/tts";
import { playAudio, stopAudio } from "../utils/audioPlayer";

// ================= TYPES =================
type Food = {
  foodId: number;
  nameVi?: string;
  nameEn?: string;
  descriptionVi?: string;
  descriptionEn?: string;
  locationId?: number;
};

type LocationType = {
  locationId: number;
  latitude: number;
  longitude: number;
  name?: string;
};

// ================= COMPONENT =================
export default function HomeScreen() {
  const gpsStarted = useRef(false);
  const { t, lang } = useLanguage();
  if (!t || !lang) {
    return <ActivityIndicator />;
  }
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);

  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
    null,
  );

  const [translatedText, setTranslatedText] = useState<string>("...");
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const [region, setRegion] = useState({
    latitude: 10.742774,
    longitude: 106.699181,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // ================= CACHE =================
  const textCache = useRef<Record<string, string>>({});
  const audioCache = useRef<Record<string, string>>({});

  const currentLocationRef = useRef<number | null>(null);
  const userSelectedRef = useRef(false);

  const autoPlay =
    Platform.OS === "web"
      ? new URLSearchParams(window.location.search).get("autoPlay")
      : null;

  // ================= FETCH DATA =================
  useEffect(() => {
    let isAlive = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const locationData = await getLocations(lang);
        const foodData = await getFoods();

        const safeLocations = Array.isArray(locationData) ? locationData : [];
        const safeFoods = Array.isArray(foodData) ? foodData : [];

        if (!isAlive) return;

        setLocations(safeLocations);
        setFoods(safeFoods);

        if (safeLocations.length > 0) {
          const first = safeLocations[0];
          setSelectedLocation(first);

          const f = safeFoods.find((x) => x.locationId === first.locationId);
          if (f) setSelectedFood(f);
        }
      } catch (e) {
        console.log("API ERROR", e);
      } finally {
        if (isAlive) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isAlive = false;
    };
  }, []);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  // ================= LOAD TEXT =================
  useEffect(() => {
    if (!selectedLocation) return;

    let isActive = true;

    const load = async () => {
      try {
        const key = `${selectedLocation.locationId}_${lang}`;

        if (textCache.current[key]) {
          if (isActive) setTranslatedText(textCache.current[key]);
          return;
        }

        const text = await getText(selectedLocation.locationId, lang);

        const safeText =
          typeof text === "string" ? text : JSON.stringify(text ?? "...");

        textCache.current[key] = safeText;

        if (isActive) setTranslatedText(safeText);
      } catch (e) {
        console.log("TEXT ERROR", e);
        if (isActive) setTranslatedText("...");
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [selectedLocation, lang]);

  // ================= AUDIO =================
  const playWithCache = async (locationId: number) => {
    try {
      const key = `${locationId}_${lang}`;

      let url = audioCache.current[key];

      if (!url) {
        url = await getTTS(locationId, lang);
        audioCache.current[key] = url;
      }

      await stopAudio();
      await playAudio(url);

      setIsPlaying(true);
    } catch (e) {
      console.log("AUDIO ERROR", e);
    }
  };

  // ================= SELECT LOCATION =================
  const handleSelectLocation = async (item: LocationType) => {
    userSelectedRef.current = true;

    setSelectedLocation(item);

    const f = foods.find((x) => x.locationId === item.locationId);
    if (f) setSelectedFood(f);

    setRegion({
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });

    await stopAudio();
    setIsPlaying(false);

    currentLocationRef.current = item.locationId;
  };

  // ================= GPS AUTO =================
  useEffect(() => {
    let sub: any;

    const getDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number,
    ) => {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;

      return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    const findNearestLocation = (
      userLoc: { latitude: number; longitude: number },
      list: LocationType[],
    ): LocationType | null => {
      let min = Infinity;
      let nearest: LocationType | null = null;

      list.forEach((loc) => {
        const d = getDistance(
          userLoc.latitude,
          userLoc.longitude,
          loc.latitude,
          loc.longitude,
        );

        if (d < min) {
          min = d;
          nearest = loc;
        }
      });

      return nearest;
    };
    const handleAuto = async (userLoc: {
      latitude: number;
      longitude: number;
    }) => {
      if (!locations.length) return;
      if (userSelectedRef.current) return;

      const nearest = findNearestLocation(userLoc, locations);
      if (!nearest) return;

      const distance = getDistance(
        userLoc.latitude,
        userLoc.longitude,
        nearest.latitude,
        nearest.longitude,
      );

      if (autoPlay || distance < 0.05) {
        if (currentLocationRef.current === nearest.locationId) return;

        currentLocationRef.current = nearest.locationId;

        setSelectedLocation(nearest);

        const f = foods.find((x) => x.locationId === nearest.locationId);
        if (f) setSelectedFood(f);

        setRegion({
          latitude: nearest.latitude,
          longitude: nearest.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });

        await playWithCache(nearest.locationId);
      }
    };

    const start = async () => {
      if (gpsStarted.current) return; // 🔥 CHẶN DOUBLE START
      gpsStarted.current = true;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const current = await Location.getCurrentPositionAsync({});
      await handleAuto(current.coords);

      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (loc) => handleAuto(loc.coords),
      );
    };
    if (locations.length > 0 && selectedLocation) {
      start();
    }

    return () => {
      try {
        sub?.remove?.();
      } catch (e) {
        console.log("GPS cleanup ignored:", e);
      }
    };
  }, [locations]);

  // ================= AUDIO CONTROL =================
  const toggleAudio = async () => {
    if (!selectedLocation) return;

    if (isPlaying) {
      await stopAudio();
      setIsPlaying(false);
    } else {
      await playWithCache(selectedLocation.locationId);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView>
        <Header />

        {/* ===== BANNER ===== */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
          }}
          style={styles.banner}
        />

        {/* ===== CATEGORY ===== */}
        <Text style={styles.sectionTitle}>{t?.category ?? "..."}</Text>

        <ScrollView horizontal style={{ paddingLeft: 16 }}>
          {foods.map((food) => (
            <Pressable
              key={food.foodId}
              style={[
                styles.categoryItem,
                selectedFood?.foodId === food.foodId && styles.activeCategory,
              ]}
              onPress={() => {
                const loc = locations.find(
                  (l) => l.locationId === food.locationId,
                );

                setSelectedFood(food);
                if (loc) handleSelectLocation(loc);
              }}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedFood?.foodId === food.foodId &&
                    styles.activeCategoryText,
                ]}
              >
                {food.nameVi || food.nameEn}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ===== MAP ===== */}
        <View style={styles.mapContainer}>
          {loading || !selectedLocation ? (
            <ActivityIndicator />
          ) : (
            <MapComponent
              key={selectedLocation?.locationId}
              locations={Array.isArray(locations) ? locations : []}
              location={selectedLocation}
              onSelectLocation={handleSelectLocation}
              region={region}
            />
          )}
        </View>

        {/* ===== INFO CARD ===== */}
        {selectedLocation && selectedFood && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              {selectedFood.nameVi || selectedFood.nameEn}
            </Text>

            <Text style={styles.infoDesc}>{translatedText || "..."}</Text>

            <Pressable style={styles.audioButton} onPress={toggleAudio}>
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
