// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   Pressable,
// //   StyleSheet,
// //   ActivityIndicator,
// //   Platform,
// // } from "react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // const API_URL =
// //   Platform.OS === "web"
// //     ? "http://localhost:8080/api/auth/login"
// //     : "http://192.168.2.23:8080/api/auth/login";

// // const LoginScreen = ({ navigation }: any) => {
// //   const [username, setUsername] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   // const handleLogin = async () => {
// //   //   if (!username || !password) {
// //   //     alert("Nhập đầy đủ thông tin");
// //   //     return;
// //   //   }

// //   //   try {
// //   //     setLoading(true);

// //   //     const res = await fetch(API_URL, {
// //   //       method: "POST",
// //   //       headers: { "Content-Type": "application/json" },
// //   //       body: JSON.stringify({ username, password }),
// //   //     });

// //   //     const data = await res.json();

// //   //     if (!res.ok) throw new Error();

// //   //     alert("Đăng nhập thành công!");

// //   //     if (data.role === "ADMIN") {
// //   //       navigation.replace("AdminDashboard");
// //   //     } else {
// //   //       navigation.replace("RegisterBusiness");
// //   //     }
// //   //   } catch {
// //   //     alert("Sai tài khoản hoặc mật khẩu");
// //   //   } finally {
// //   //     setLoading(false);
// //   //   }
// //   // };

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   ActivityIndicator,
//   Platform,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// const API_URL =
//   Platform.OS === "web"
//     ? "http://localhost:8080/api/auth/login"
//     : "http://172.23.200.235:8080/api/auth/login";

// const LoginScreen = ({ navigation }: any) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!username || !password) {
//       alert("Nhập đầy đủ thông tin");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error("Sai tài khoản hoặc mật khẩu");

//       await AsyncStorage.setItem("token", data.token);

//       alert("Đăng nhập thành công!");

//       if (data.role === "ADMIN") {
//         navigation.replace("AdminDashboard");
//       } else {
//         navigation.replace("RegisterBusiness");
//       }
//     } catch (err: any) {
//       alert("❌ Lỗi login: " + (err.message || "Sai tài khoản hoặc mật khẩu"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.logo}>🍜 Vĩnh Khánh Food Guide</Text>

//       <View style={styles.card}>
//         <Text style={styles.title}>Đăng nhập</Text>

//         <TextInput
//           placeholder="Username"
//           style={styles.input}
//           value={username}
//           onChangeText={setUsername}
//         />

//         <TextInput
//           placeholder="Password"
//           secureTextEntry
//           style={styles.input}
//           value={password}
//           onChangeText={setPassword}
//         />

//         <Pressable style={styles.button} onPress={handleLogin}>
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Đăng nhập</Text>
//           )}
//         </Pressable>

//         <Pressable
//           style={styles.secondaryButton}
//           onPress={() => navigation.navigate("RegisterUser")}
//         >
//           <Text style={styles.secondaryText}>📝 Tạo tài khoản</Text>
//         </Pressable>

//         <Pressable
//           style={styles.guestButton}
//           onPress={() =>
//             navigation.replace("MainTabs", {
//               screen: "Home",
//               params: { guest: true },
//             })
//           }
//         >
//           <Text style={styles.buttonText}>
//             🚀 Vào ứng dụng (không cần đăng nhập)
//           </Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#fff7ed",
//   },

//   logo: {
//     fontSize: 24,
//     textAlign: "center",
//     marginBottom: 20,
//     fontWeight: "bold",
//   },

//   card: {
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 3,
//   },

//   title: {
//     fontSize: 20,
//     textAlign: "center",
//     marginBottom: 15,
//     fontWeight: "bold",
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },

//   button: {
//     backgroundColor: "#ef4444",
//     padding: 14,
//     borderRadius: 8,
//     marginTop: 10,
//   },

//   buttonText: {
//     color: "white",
//     textAlign: "center",
//     fontWeight: "bold",
//   },

//   secondaryButton: {
//     backgroundColor: "#3b82f6",
//     padding: 14,
//     borderRadius: 8,
//     marginTop: 10,
//   },

//   secondaryText: {
//     color: "white",
//     textAlign: "center",
//     fontWeight: "bold",
//   },

//   guestButton: {
//     backgroundColor: "#222",
//     padding: 14,
//     borderRadius: 8,
//     marginTop: 10,
//   },
// });
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:8080/api/auth/login"
    : "http://192.168.2.23:8080/api/auth/login";

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [focusUser, setFocusUser] = useState(false);
  const [focusPass, setFocusPass] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Sai tài khoản");

      await AsyncStorage.setItem("token", data.token);

      alert("Đăng nhập thành công");

      if (data.role === "ADMIN") {
        navigation.replace("AdminDashboard");
      } else {
        navigation.replace("RegisterBusiness");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.logo}>🍜 Vĩnh Khánh Food Guide</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Đăng nhập</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* USERNAME */}
        <View
          style={[
            styles.inputContainer,
            { borderColor: focusUser ? "#ef4444" : "#e5e7eb" },
          ]}
        >
          <Ionicons name="person-outline" size={20} color="#6b7280" />

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={[
              styles.input,
              {
                outlineStyle: "none",
                outlineWidth: 0,
                borderWidth: 0,
              } as any,
            ]}
            onFocus={() => setFocusUser(true)}
            onBlur={() => setFocusUser(false)}
          />
        </View>

        {/* PASSWORD */}
        <View
          style={[
            styles.inputContainer,
            { borderColor: focusPass ? "#ef4444" : "#e5e7eb" },
          ]}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={[
              styles.input,
              {
                outlineStyle: "none",
                outlineWidth: 0,
                borderWidth: 0,
              } as any,
            ]}
            onFocus={() => setFocusPass(true)}
            onBlur={() => setFocusPass(false)}
          />

          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#6b7280"
            />
          </Pressable>
        </View>

        {/* LOGIN BUTTON */}
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Đăng nhập</Text>
          )}
        </Pressable>

        {/* REGISTER */}
        <View style={styles.registerRow}>
          <Text style={styles.registerLabel}>Chưa có tài khoản?</Text>

          <Pressable onPress={() => navigation.navigate("RegisterUser")}>
            <Text style={styles.registerLink}>Đăng ký</Text>
          </Pressable>
        </View>

        {/* GUEST */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>hoặc</Text>
          <View style={styles.line} />
        </View>

        <Pressable
          onPress={() =>
            navigation.replace("MainTabs", {
              screen: "Home",
              params: { guest: true },
            })
          }
        >
          <Text style={styles.guestText}>Tiếp tục với khách</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff7ed",
  },

  logo: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },

  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    height: 52,
    backgroundColor: "#fafafa",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },

  loginButton: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 12,
    marginTop: 6,
  },

  registerButton: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  guestButton: {
    backgroundColor: "#111827",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },

  error: {
    color: "#dc2626",
    marginBottom: 12,
    textAlign: "center",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },

  registerLabel: {
    color: "#6b7280",
    fontSize: 14,
  },

  registerLink: {
    color: "#ef4444",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
  guestLink: {
    marginTop: 20,
    alignItems: "center",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },

  dividerText: {
    marginHorizontal: 10,
    color: "#9ca3af",
  },

  guestText: {
    textAlign: "center",
    color: "#6b7280",
  },
});
