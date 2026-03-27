import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function QRManagementScreen() {
  const route = useRoute();
  const { locationId } = route.params as any;

  const [qr, setQr] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/locations/${locationId}`)
      .then((res) => res.json())
      .then((data) => setQr(data.qrCode));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      {qr ? <Text>QR: {qr.qrValue}</Text> : <Text>No QR Code</Text>}
    </View>
  );
}
