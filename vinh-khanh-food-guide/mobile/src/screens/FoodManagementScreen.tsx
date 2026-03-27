import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function FoodManagementScreen() {
  const route = useRoute();
  const { locationId } = route.params as any;

  const [foods, setFoods] = useState<any[]>([]);

  const fetchFoods = async () => {
    const res = await fetch(
      `http://localhost:8080/api/locations/${locationId}`,
    );

    const data = await res.json();

    setFoods(data.foods || []);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={foods}
        keyExtractor={(item) => item.foodId.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}
