// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   StyleSheet,
// } from "react-native";

// const CreateQR = () => {
//   const [text, setText] = useState("");

//   const handleCreateQR = () => {
//     alert("QR đã được tạo cho: " + text);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>📷 Tạo QR Code</Text>

//       <TextInput
//         placeholder="Nhập nội dung QR"
//         value={text}
//         onChangeText={setText}
//         style={styles.input}
//       />

//       <Pressable style={styles.btn} onPress={handleCreateQR}>
//         <Text style={{ color: "#fff" }}>Tạo QR</Text>
//       </Pressable>
//     </View>
//   );
// };

// export default CreateQR;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },

//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },

//   input: {
//     borderWidth: 1,
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 15,
//   },

//   btn: {
//     backgroundColor: "#ff6b00",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//   },
// });
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Picker } from "@react-native-picker/picker";
export default function AdminQRCodesScreen() {
  const [qrValue, setQrValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const API = "http://192.168.2.23:8080";

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API}/api/locations`);
      const data = await res.json();

      setLocations(data);
    } catch (err) {
      console.log(err);
    }
  };

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
    } catch {
      Alert.alert("Lỗi tải QR");
    } finally {
      setLoading(false);
    }
  };

  const createQR = async () => {
    if (!selectedLocation) {
      Alert.alert("Chọn location");
      return;
    }

    if (!qrValue.trim()) {
      Alert.alert("Nhập mã QR");
      return;
    }

    try {
      await fetch(`${API}/api/qr-codes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrValue: qrValue.trim(),
          locationId: selectedLocation.locationId,
        }),
      });

      Alert.alert("Tạo QR thành công");

      setQrValue("");
      setSelectedLocation(null);

      fetchQR();
      fetchLocations();
    } catch {
      Alert.alert("Lỗi tạo QR");
    }
  };
  const deleteQR = async (id: number) => {
    try {
      await fetch(`${API}/api/qr-codes/${id}`, {
        method: "DELETE",
      });

      fetchQR();
    } catch {
      Alert.alert("Lỗi xóa QR");
    }
  };

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📷 Quản lý QR Code</Text>

      {/* FORM TẠO QR */}
      <Picker
        selectedValue={selectedLocation}
        onValueChange={(itemValue) => setSelectedLocation(itemValue)}
      >
        <Picker.Item label="Chọn location" value={null} />

        {locations.map((loc) => (
          <Picker.Item key={loc.locationId} label={loc.name} value={loc} />
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

      {/* DANH SÁCH QR */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fafafa",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
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

  preview: {
    alignItems: "center",
    marginVertical: 10,
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
  locationItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
  },

  selected: {
    borderColor: "#9333ea",
    backgroundColor: "#f3e8ff",
  },
});
