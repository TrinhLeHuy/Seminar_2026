// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Toast from "react-native-toast-message";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function LocationCreateScreen({ onSuccess, onCancel }: any) {
//   const navigation = useNavigation<any>();
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [latitude, setLatitude] = useState("10.0");
//   const [longitude, setLongitude] = useState("106.0");
//   const [imageUrl, setImageUrl] = useState("");

//   const createLocation = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) {
//         Toast.show({ type: "error", text1: "User not logged in!" });
//         return;
//       }

//       const payload = {
//         name,
//         description,
//         latitude,
//         longitude,
//         imageUrl,
//         foods: [],
//         audioGuides: [],
//         qrCodes: [],
//       };

//       const res = await fetch("http://localhost:8080/api/locations", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json; charset=UTF-8",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const text = await res.text();
//       if (!res.ok) throw new Error(text || "Failed");

//       Toast.show({ type: "success", text1: "Location created successfully!" });
//       setTimeout(() => navigation.goBack(), 3000);
//       // Quay lại ngay sau khi tạo thành công
//       onSuccess();
//     } catch (err) {
//       console.log("CREATE ERROR:", err);
//       Toast.show({ type: "error", text1: "Error creating location" });
//     }
//   };
//   const inputStyle = {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 16,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: "#f5f5f5" }}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <ScrollView contentContainerStyle={{ padding: 20 }}>
//         <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
//           Create New Location
//         </Text>

//         <Text style={{ marginBottom: 4, fontWeight: "600" }}>Name</Text>
//         <TextInput
//           placeholder="Location Name"
//           value={name}
//           onChangeText={setName}
//           style={inputStyle}
//         />

//         <Text style={{ marginBottom: 4, fontWeight: "600" }}>Description</Text>
//         <TextInput
//           placeholder="Description"
//           value={description}
//           onChangeText={setDescription}
//           style={{ ...inputStyle, height: 80, textAlignVertical: "top" }}
//           multiline
//         />

//         <Text style={{ marginBottom: 4, fontWeight: "600" }}>Latitude</Text>
//         <TextInput
//           placeholder="Latitude"
//           value={latitude}
//           onChangeText={setLatitude}
//           style={inputStyle}
//           keyboardType="numeric"
//         />

//         <Text style={{ marginBottom: 4, fontWeight: "600" }}>Longitude</Text>
//         <TextInput
//           placeholder="Longitude"
//           value={longitude}
//           onChangeText={setLongitude}
//           style={inputStyle}
//           keyboardType="numeric"
//         />

//         <Text style={{ marginBottom: 4, fontWeight: "600" }}>Image URL</Text>
//         <TextInput
//           placeholder="Image URL"
//           value={imageUrl}
//           onChangeText={setImageUrl}
//           style={inputStyle}
//         />

//         <TouchableOpacity
//           onPress={createLocation}
//           style={{
//             backgroundColor: "#4CAF50",
//             padding: 16,
//             borderRadius: 12,
//             alignItems: "center",
//             marginTop: 10,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.2,
//             shadowRadius: 3,
//             elevation: 3,
//           }}
//         >
//           <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
//             Create Location
//           </Text>
//         </TouchableOpacity>

//         <Toast />
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
// } from "react-native";
// import Toast from "react-native-toast-message";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { StyleSheet } from "react-native";
// export default function LocationCreateScreen({ onSuccess, onCancel }: any) {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [latitude, setLatitude] = useState("10.0");
//   const [longitude, setLongitude] = useState("106.0");
//   const [imageUrl, setImageUrl] = useState("");

//   const createLocation = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) {
//         Toast.show({ type: "error", text1: "User not logged in!" });
//         return;
//       }

//       const payload = {
//         name,
//         description,
//         latitude,
//         longitude,
//         imageUrl,
//         foods: [],
//         audioGuides: [],
//         qrCodes: [],
//       };

//       const res = await fetch("http://localhost:8080/api/locations", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json; charset=UTF-8",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const text = await res.text();
//       if (!res.ok) throw new Error(text || "Failed");

//       Toast.show({
//         type: "success",
//         text1: "Location created successfully!",
//       });

//       setTimeout(() => {
//         onSuccess && onSuccess();
//       }, 1200);
//     } catch (err) {
//       console.log("CREATE ERROR:", err);
//       Toast.show({
//         type: "error",
//         text1: "Error creating location",
//       });
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: "#f6f7fb" }}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <ScrollView contentContainerStyle={{ padding: 30 }}>
//         {/* HEADER */}

//         <TouchableOpacity onPress={onCancel}>
//           <Text style={{ color: "#ef4444", marginBottom: 15 }}>⬅ Back</Text>
//         </TouchableOpacity>

//         <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 20 }}>
//           Create Location
//         </Text>

//         {/* LOCATION INFO */}

//         <View style={styles.card}>
//           <Text style={styles.section}>📍 Location Info</Text>

//           <Text style={styles.label}>Name</Text>
//           <TextInput
//             placeholder="Location name"
//             value={name}
//             onChangeText={setName}
//             style={styles.input}
//           />

//           <Text style={styles.label}>Description</Text>
//           <TextInput
//             placeholder="Description"
//             value={description}
//             onChangeText={setDescription}
//             multiline
//             style={[styles.input, { height: 80 }]}
//           />

//           <Text style={styles.label}>Latitude</Text>
//           <TextInput
//             value={latitude}
//             onChangeText={setLatitude}
//             keyboardType="numeric"
//             style={styles.input}
//           />

//           <Text style={styles.label}>Longitude</Text>
//           <TextInput
//             value={longitude}
//             onChangeText={setLongitude}
//             keyboardType="numeric"
//             style={styles.input}
//           />
//         </View>

//         {/* IMAGE */}

//         <View style={styles.card}>
//           <Text style={styles.section}>🖼 Location Image</Text>

//           <TextInput
//             placeholder="Image URL"
//             value={imageUrl}
//             onChangeText={setImageUrl}
//             style={styles.input}
//           />

//           {imageUrl ? (
//             <Image
//               source={{ uri: imageUrl }}
//               style={{
//                 width: "100%",
//                 height: 180,
//                 borderRadius: 10,
//                 marginTop: 10,
//               }}
//             />
//           ) : null}
//         </View>

//         {/* SAVE BUTTON */}

//         <TouchableOpacity style={styles.createBtn} onPress={createLocation}>
//           <Text style={styles.createText}>Create Location</Text>
//         </TouchableOpacity>

//         <Toast />
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 14,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 3,
//   },

//   section: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 15,
//   },

//   label: {
//     fontWeight: "600",
//     marginBottom: 6,
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#e5e5e5",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 14,
//     backgroundColor: "#fff",
//   },

//   createBtn: {
//     backgroundColor: "#ff7a18",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },

//   createText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 16,
//   },
// });
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LocationCreateScreen({ onSuccess, onCancel }: any) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    imageUrl: "",

    foodNameVi: "",
    foodNameEn: "",
    foodDescriptionVi: "",
    foodDescriptionEn: "",
    price: "",
    foodImageUrl: "",

    audioUrl: "",
    audioLanguage: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const createLocation = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Toast.show({ type: "error", text1: "User not logged in!" });
        return;
      }

      const payload = {
        name: form.name,
        description: form.description,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        imageUrl: form.imageUrl,

        foods: [
          {
            nameVi: form.foodNameVi,
            nameEn: form.foodNameEn,
            descriptionVi: form.foodDescriptionVi,
            descriptionEn: form.foodDescriptionEn,
            price: Number(form.price),
            imageUrl: form.foodImageUrl,
          },
        ],

        audioGuides: [
          {
            audioUrl: form.audioUrl,
            language: form.audioLanguage,
          },
        ],

        qrCodes: [],
      };

      const res = await fetch("http://localhost:8080/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (!res.ok) throw new Error(text);

      Toast.show({
        type: "success",
        text1: "Location created successfully!",
      });

      setTimeout(() => {
        onSuccess && onSuccess();
      }, 1200);
    } catch (err) {
      console.log("CREATE ERROR:", err);

      Toast.show({
        type: "error",
        text1: "Error creating location",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f6f7fb" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={{ color: "#ef4444", marginBottom: 10 }}>⬅ Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create Location</Text>

        {/* LOCATION INFO */}

        <View style={styles.card}>
          <Text style={styles.section}>📍 Location Info</Text>

          <TextInput
            placeholder="Location name"
            style={styles.input}
            onChangeText={(v) => handleChange("name", v)}
          />

          <TextInput
            placeholder="Description"
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
            placeholder="Image URL"
            style={styles.input}
            onChangeText={(v) => handleChange("imageUrl", v)}
          />

          {form.imageUrl ? (
            <Image source={{ uri: form.imageUrl }} style={styles.preview} />
          ) : null}
        </View>

        {/* FOOD */}

        <View style={styles.card}>
          <Text style={styles.section}>🍜 Food</Text>

          <View style={styles.row}>
            <TextInput
              placeholder="Name VI"
              style={[styles.input, styles.half]}
              onChangeText={(v) => handleChange("foodNameVi", v)}
            />

            <TextInput
              placeholder="Name EN"
              style={[styles.input, styles.half]}
              onChangeText={(v) => handleChange("foodNameEn", v)}
            />
          </View>

          <View style={styles.row}>
            <TextInput
              placeholder="Description VI"
              style={[styles.input, styles.half]}
              onChangeText={(v) => handleChange("foodDescriptionVi", v)}
            />

            <TextInput
              placeholder="Description EN"
              style={[styles.input, styles.half]}
              onChangeText={(v) => handleChange("foodDescriptionEn", v)}
            />
          </View>

          <TextInput
            placeholder="Price"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(v) => handleChange("price", v)}
          />

          <TextInput
            placeholder="Food Image URL"
            style={styles.input}
            onChangeText={(v) => handleChange("foodImageUrl", v)}
          />

          {form.foodImageUrl ? (
            <Image source={{ uri: form.foodImageUrl }} style={styles.preview} />
          ) : null}
        </View>

        {/* AUDIO */}

        <View style={styles.card}>
          <Text style={styles.section}>🔊 Audio Guide</Text>

          <TextInput
            placeholder="Audio URL"
            style={styles.input}
            onChangeText={(v) => handleChange("audioUrl", v)}
          />

          <TextInput
            placeholder="Language (vi / en)"
            style={styles.input}
            onChangeText={(v) => handleChange("audioLanguage", v)}
          />
        </View>

        <TouchableOpacity style={styles.createBtn} onPress={createLocation}>
          <Text style={styles.createText}>Create Location</Text>
        </TouchableOpacity>

        <Toast />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  section: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    padding: 12,
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

  preview: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },

  createBtn: {
    backgroundColor: "#ff7a18",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  createText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
