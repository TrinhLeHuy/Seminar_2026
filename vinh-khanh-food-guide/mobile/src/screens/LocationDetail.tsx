import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import MapComponent from "../components/Map";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

import { useLanguage } from "../i18n/LanguageContext";
import { getFoods } from "../api/food";

const BASE_URL = "http://192.168.2.23:8080";

export default function LocationDetail({ route }: any) {
  const { location } = route.params;
  const { lang } = useLanguage();

  const [foods, setFoods] = useState<any[]>([]);

  useEffect(() => {
    fetchFoods();
  }, [lang]);

  const fetchFoods = async () => {
    const data = await getFoods(lang);
    setFoods(data.filter((f: any) => f.locationId === location.locationId));
  };

  const speak = () => {
    Speech.stop();
    Speech.speak(location.description, {
      language: lang,
    });
  };

  return (
    <ScrollView>
      <Text style={styles.title}>{location.name}</Text>
      <Text>{location.description}</Text>

      <View style={styles.map}>
        <MapComponent location={location} />
      </View>

      {foods.map((f) => (
        <View key={f.foodId}>
          <Image source={{ uri: BASE_URL + f.imageUrl }} style={styles.img} />
          <Text>{f.name}</Text>
        </View>
      ))}

      <Pressable style={styles.btn} onPress={speak}>
        <Ionicons name="volume-high" size={24} color="#fff" />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "bold", margin: 16 },
  map: { height: 200, margin: 16 },
  img: { height: 120 },
  btn: { margin: 16, backgroundColor: "red", padding: 10 },
});