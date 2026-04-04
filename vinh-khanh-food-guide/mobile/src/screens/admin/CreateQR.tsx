import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
type Location = {
  locationId: number;
  name: string;
};
type QRCodeItem = {
  qrId: number;
  qrValue: string;
};
export default function AdminQRCodesScreen() {
  const navigation = useNavigation();

  const API = "http://172.23.200.235:8080";

  const [qrValue, setQrValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  // load dữ liệu ban đầu
  useEffect(() => {
    fetchQR();
    fetchLocations();
  }, []);

  // load QR
  const fetchQR = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/qr-codes`);
      const data = await res.json();

      setQrCodes(data);
    } catch (err) {
      console.log(err);
      Alert.alert("Lỗi tải QR");
    } finally {
      setLoading(false);
    }
  };

  // load locations
  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API}/api/locations`);
      const data = await res.json();

      setLocations(data);
    } catch (err) {
      console.log(err);
    }
  };

  // tạo QR
  const createQR = async () => {
    if (!selectedLocation) {
      Alert.alert("Vui lòng chọn location");
      return;
    }

    if (!qrValue.trim()) {
      Alert.alert("Nhập mã QR");
      return;
    }

    try {
      const res = await fetch(`${API}/api/qr-codes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrValue: qrValue.trim(),
          locationId: selectedLocation,
        }),
      });

      if (!res.ok) {
        Alert.alert("Tạo QR thất bại");
        return;
      }

      Alert.alert("Tạo QR thành công");

      setQrValue("");
      setSelectedLocation(null);

      fetchQR();
    } catch (err) {
      console.log(err);
      Alert.alert("Lỗi tạo QR");
    }
  };

  // xóa QR
  const deleteQR = async (id: any) => {
    try {
      await fetch(`${API}/api/qr-codes/${id}`, {
        method: "DELETE",
      });

      fetchQR();
    } catch {
      Alert.alert("Lỗi xóa QR");
    }
  };

  // render item QR
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <QRCode value={item.qrValue} size={80} />

      <Text style={styles.qrText}>{item.qrValue}</Text>

      <Pressable
        style={styles.deleteBtn}
        onPress={() =>
          Alert.alert("Xóa QR?", "", [
            { text: "Huỷ" },
            { text: "Xóa", onPress: () => deleteQR(item.qrId) },
          ])
        }
      >
        <Text style={styles.deleteText}>Xóa</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back button */}
      <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>⬅ Back</Text>
      </Pressable>

      <Text style={styles.title}>📷 Quản lý QR Code</Text>

      {/* FORM */}
      <View style={styles.form}>
        <Text style={styles.label}>Location</Text>

        <Picker
          selectedValue={selectedLocation}
          onValueChange={(value) => setSelectedLocation(value)}
        >
          <Picker.Item label="Chọn location" value={null} />

          {locations.map((loc) => (
            <Picker.Item
              key={loc.locationId}
              label={loc.name}
              value={loc.locationId}
            />
          ))}
        </Picker>

        <Text style={styles.label}>QR Value</Text>

        <TextInput
          placeholder="VD: VK-OC-001"
          style={styles.input}
          value={qrValue}
          onChangeText={(t) => setQrValue(t.toUpperCase())}
        />

        <Pressable style={styles.createBtn} onPress={createQR}>
          <Text style={styles.btnText}>Tạo QR</Text>
        </Pressable>
      </View>

      {/* LIST */}
      <Text style={styles.subtitle}>Danh sách QR</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={qrCodes}
          keyExtractor={(item) => item.qrId.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fafafa",
  },

  backBtn: {
    marginBottom: 10,
  },

  backText: {
    color: "#ef4444",
    fontWeight: "bold",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "bold",
  },

  form: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },

  label: {
    fontWeight: "600",
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },

  createBtn: {
    backgroundColor: "#9333ea",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  qrText: {
    marginTop: 6,
    fontWeight: "bold",
  },

  deleteBtn: {
    marginTop: 10,
    backgroundColor: "#ef4444",
    padding: 8,
    borderRadius: 8,
  },

  deleteText: {
    color: "#fff",
  },
});
