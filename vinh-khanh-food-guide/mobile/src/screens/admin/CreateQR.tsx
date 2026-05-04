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
  ScrollView,
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
  locationName: string;
};

export default function AdminQRCodesScreen() {
  const navigation = useNavigation();
  const API = "http://172.23.200.167:8080";

  const [qrValue, setQrValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQR();
    fetchLocations();
  }, []);

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

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API}/api/locations`);
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.log(err);
    }
  };

  const createQR = async () => {
    if (!selectedLocation) return Alert.alert("Vui lòng chọn location");
    if (!qrValue.trim()) return Alert.alert("Nhập mã QR");

    try {
      const res = await fetch(`${API}/api/qr-codes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrValue: qrValue.trim(),
          locationId: selectedLocation,
        }),
      });

      if (!res.ok) return Alert.alert("Tạo QR thất bại");

      Alert.alert("Tạo QR thành công");
      setQrValue("");
      setSelectedLocation(null);
      fetchQR();
    } catch (err) {
      console.log(err);
      Alert.alert("Lỗi tạo QR");
    }
  };

  const deleteQR = async (id: number) => {
    try {
      await fetch(`${API}/api/qr-codes/${id}`, { method: "DELETE" });
      fetchQR();
    } catch {
      Alert.alert("Lỗi xóa QR");
    }
  };

  const renderItem = ({ item, index }: { item: QRCodeItem; index: number }) => (
    <View
      style={[
        styles.tableRow,
        { backgroundColor: index % 2 === 0 ? "#fff" : "#f3f4f6" },
      ]}
    >
      <View style={[styles.tableCell, { flex: 1 }]}>
        <QRCode value={item.qrValue} size={50} />
      </View>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.qrValue}</Text>
      <Text style={[styles.tableCell, { flex: 2 }]}>{item.locationName}</Text>
      <Pressable
        style={[styles.tableCell, styles.deleteBtn, { flex: 1 }]}
        onPress={() =>
          Alert.alert("Xóa QR?", "", [
            { text: "Huỷ" },
            { text: "Xóa", onPress: () => deleteQR(item.qrId) },
          ])
        }
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📷 QR Code Manager</Text>
        <Text style={styles.subtitle}>
          Create and manage QR codes for locations
        </Text>
      </View>

      {/* Form */}
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Create QR</Text>

        <Text style={styles.label}>Location</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={selectedLocation}
            onValueChange={(value) => setSelectedLocation(value)}
          >
            <Picker.Item label="Select location" value={null} />
            {locations.map((loc) => (
              <Picker.Item
                key={loc.locationId}
                label={loc.name}
                value={loc.locationId}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>QR Value</Text>
        <TextInput
          placeholder="Example: VK-OC-001"
          style={styles.input}
          value={qrValue}
          onChangeText={(t) => setQrValue(t.toUpperCase())}
        />

        <Pressable style={styles.createBtn} onPress={createQR}>
          <Text style={styles.createText}>Create QR Code</Text>
        </Pressable>
      </View>

      {/* QR Table */}
      <Text style={styles.listTitle}>Generated QR Codes</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={qrCodes}
          keyExtractor={(item) => item.qrId.toString()}
          renderItem={renderItem}
          ListHeaderComponent={() => (
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 1 }]}>QR</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Value</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Location</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Action</Text>
            </View>
          )}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f6fa" },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold" },
  subtitle: { color: "#6b7280", marginTop: 4 },
  formCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  label: { fontWeight: "600", marginBottom: 6, marginTop: 10 },
  pickerBox: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  createBtn: {
    backgroundColor: "#f97316",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 14,
  },
  createText: { color: "#fff", fontWeight: "bold" },
  listTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableHeader: { backgroundColor: "#f3f4f6" },
  tableCell: {
    fontSize: 14,
    color: "#111827",
    textAlign: "center",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteText: { color: "#fff", fontWeight: "600" },
});
