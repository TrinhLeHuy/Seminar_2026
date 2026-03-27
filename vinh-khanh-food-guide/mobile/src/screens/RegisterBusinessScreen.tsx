// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   ScrollView,
// } from "react-native";

// const RegisterBusinessScreen = () => {
//   const [name, setName] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [latitude, setLatitude] = useState<string>("");
//   const [longitude, setLongitude] = useState<string>("");

//   const handleSubmit = async () => {
//     if (!name || !description) {
//       alert("Nhập đầy đủ thông tin");
//       return;
//     }

//     try {
//       // TODO: call API create location (pending)
//       console.log({ name, description, latitude, longitude });

//       alert("Đăng ký thành công! Chờ admin duyệt");
//     } catch {
//       alert("Lỗi gửi đăng ký");
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>🏪 Đăng ký doanh nghiệp</Text>

//       <TextInput
//         placeholder="Tên quán"
//         style={styles.input}
//         value={name}
//         onChangeText={setName}
//       />

//       <TextInput
//         placeholder="Mô tả"
//         style={styles.input}
//         value={description}
//         onChangeText={setDescription}
//         multiline
//       />

//       <TextInput
//         placeholder="Latitude (vd: 10.74277)"
//         style={styles.input}
//         value={latitude}
//         onChangeText={setLatitude}
//       />

//       <TextInput
//         placeholder="Longitude (vd: 106.69918)"
//         style={styles.input}
//         value={longitude}
//         onChangeText={setLongitude}
//       />

//       <Pressable style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.btnText}>Gửi đăng ký</Text>
//       </Pressable>
//     </ScrollView>
//   );
// };

// export default RegisterBusinessScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },

//   title: {
//     fontSize: 26,
//     marginBottom: 20,
//     textAlign: "center",
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 15,
//   },

//   button: {
//     backgroundColor: "#28a745",
//     padding: 15,
//     borderRadius: 10,
//   },

//   btnText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "bold",
//   },
// });
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:8080/api/business/register"
    : "http://192.168.2.23:8080/api/business/register";

export default function RegisterBusinessScreen() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    description: "",
    latitude: "",
    longitude: "",
    imageUrl: "",

    foodName: "",
    foodNameVi: "",
    foodNameEn: "",
    foodDescription: "",
    foodDescriptionVi: "",
    foodDescriptionEn: "",
    price: "",
    foodImageUrl: "",
    audioUrl: "",
    audioLanguage: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.foodName || !form.price) {
      alert("❌ Vui lòng nhập đủ thông tin bắt buộc");
      return;
    }

    setLoading(true);

    try {
      // ✅ await token
      const token = await AsyncStorage.getItem("token");

      console.log("Token from storage:", token);

      if (!token) {
        alert("❌ Chưa đăng nhập hoặc token không hợp lệ");
        return;
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`, // trim tránh khoảng trắng
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          address: form.address,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          imageUrl: form.imageUrl,

          foodName: form.foodName,
          foodNameVi: form.foodNameVi,
          foodNameEn: form.foodNameEn,
          foodDescription: form.foodDescription,
          foodDescriptionVi: form.foodDescriptionVi,
          foodDescriptionEn: form.foodDescriptionEn,
          price: Number(form.price),
          foodImageUrl: form.foodImageUrl,
          audioUrl: form.audioUrl,
          audioLanguage: form.audioLanguage,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      alert("🎉 Đăng ký thành công!");
    } catch (err: any) {
      console.error("Error registering business:", err);
      alert("❌ Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🍜 Đăng ký quán ăn</Text>
        <Text style={styles.subtitle}>Nhập thông tin quán và món ăn</Text>

        {/* THÔNG TIN QUÁN */}
        <Text style={styles.section}>🏪 Thông tin quán</Text>

        <TextInput
          placeholder="Tên quán"
          style={styles.input}
          onChangeText={(v) => handleChange("name", v)}
        />
        <TextInput
          placeholder="Địa chỉ"
          style={styles.input}
          onChangeText={(v) => handleChange("address", v)}
        />

        <TextInput
          placeholder="Mô tả"
          style={styles.input}
          multiline
          onChangeText={(v) => handleChange("description", v)}
        />

        <View style={styles.row}>
          <TextInput
            placeholder="Latitude"
            style={[styles.input, styles.half]}
            onChangeText={(v) => handleChange("latitude", v)}
          />
          <TextInput
            placeholder="Longitude"
            style={[styles.input, styles.half]}
            onChangeText={(v) => handleChange("longitude", v)}
          />
        </View>

        <TextInput
          placeholder="Ảnh quán"
          style={styles.input}
          onChangeText={(v) => handleChange("imageUrl", v)}
        />

        {/* FOOD */}
        <Text style={styles.section}>🍽️ Món ăn</Text>

        <TextInput
          placeholder="Tên món"
          style={styles.input}
          onChangeText={(v) => handleChange("foodName", v)}
        />

        <View style={styles.row}>
          <TextInput
            placeholder="Tên VI"
            style={[styles.input, styles.half]}
            onChangeText={(v) => handleChange("foodNameVi", v)}
          />
          <TextInput
            placeholder="Tên EN"
            style={[styles.input, styles.half]}
            onChangeText={(v) => handleChange("foodNameEn", v)}
          />
        </View>

        <TextInput
          placeholder="Mô tả món"
          style={styles.input}
          multiline
          onChangeText={(v) => handleChange("foodDescription", v)}
        />

        <View style={styles.row}>
          <TextInput
            placeholder="Mô tả VI"
            style={[styles.input, styles.half]}
            multiline
            onChangeText={(v) => handleChange("foodDescriptionVi", v)}
          />
          <TextInput
            placeholder="Mô tả EN"
            style={[styles.input, styles.half]}
            multiline
            onChangeText={(v) => handleChange("foodDescriptionEn", v)}
          />
        </View>

        <TextInput
          placeholder="Giá"
          style={styles.input}
          keyboardType="numeric"
          onChangeText={(v) => handleChange("price", v)}
        />

        <TextInput
          placeholder="Ảnh món"
          style={styles.input}
          onChangeText={(v) => handleChange("foodImageUrl", v)}
        />

        {/* AUDIO */}
        <Text style={styles.section}>🔊 Audio</Text>

        <TextInput
          placeholder="Audio URL"
          style={styles.input}
          onChangeText={(v) => handleChange("audioUrl", v)}
        />

        <TextInput
          placeholder="Ngôn ngữ (vi / en)"
          style={styles.input}
          onChangeText={(v) => handleChange("audioLanguage", v)}
        />

        <Pressable style={styles.button} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>🚀 Đăng ký quán</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },

  subtitle: {
    color: "#666",
    marginBottom: 20,
  },

  section: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  half: {
    flex: 1,
  },

  button: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
