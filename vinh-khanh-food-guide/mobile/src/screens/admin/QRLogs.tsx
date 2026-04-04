// import React from "react";
// import { View, Text, StyleSheet, FlatList } from "react-native";

// const QRLogs = () => {
//   const logs = [
//     { id: 1, location: "Bún Bò Huế", time: "10:30 AM" },
//     { id: 2, location: "Phở Hà Nội", time: "11:00 AM" },
//   ];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>📊 Lịch sử quét QR</Text>

//       <FlatList
//         data={logs}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Text>{item.location}</Text>
//             <Text style={styles.time}>{item.time}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// export default QRLogs;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },

//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },

//   card: {
//     padding: 15,
//     backgroundColor: "#eee",
//     borderRadius: 10,
//     marginBottom: 10,
//   },

//   time: {
//     marginTop: 5,
//     color: "#666",
//   },
// });
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";

import { LineChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
const screenWidth = Dimensions.get("window").width;

export default function QRLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalScans: 0,
    todayScans: 0,
    hotLocation: "N/A",
    popularDevice: "N/A",
  });
  const navigation = useNavigation();
  const [scansByDay, setScansByDay] = useState<any>({});
  const [scansByHour, setScansByHour] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const API = "http://172.23.200.235:8080/api/qr-scan/logs";

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.log("API wrong format:", data);
          return;
        }

        setLogs(data);

        const totalScans = data.length;

        const today = new Date().toISOString().split("T")[0];
        const todayScans = data.filter(
          (log: any) => log.scanTime && log.scanTime.startsWith(today),
        ).length;

        const locationCount: any = {};
        const deviceCount: any = {};

        data.forEach((log: any) => {
          const location = log.locationName || "Unknown";
          const device = log.deviceInfo || "Unknown";

          locationCount[location] = (locationCount[location] || 0) + 1;
          deviceCount[device] = (deviceCount[device] || 0) + 1;
        });

        const hotLocation =
          Object.entries(locationCount).sort(
            (a: any, b: any) => b[1] - a[1],
          )[0]?.[0] || "N/A";

        const popularDevice =
          Object.entries(deviceCount).sort(
            (a: any, b: any) => b[1] - a[1],
          )[0]?.[0] || "N/A";

        setSummary({
          totalScans,
          todayScans,
          hotLocation,
          popularDevice,
        });

        const dayMap: any = {};
        const hourMap: any = {};

        data.forEach((log: any) => {
          if (!log.scanTime) return;

          const date = log.scanTime.split("T")[0];
          dayMap[date] = (dayMap[date] || 0) + 1;

          const hour = new Date(log.scanTime).getHours();
          hourMap[hour] = (hourMap[hour] || 0) + 1;
        });

        setScansByDay(dayMap);
        setScansByHour(hourMap);

        setLoading(false);
      })
      .catch((err) => {
        console.log("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 100 }} size="large" />;
  }
  return (
    <ScrollView style={styles.container}>
      <Pressable
        style={{ marginBottom: 10 }}
        onPress={() => navigation.goBack()} // quay lại màn trước
      >
        <Text style={{ color: "#ef4444", fontWeight: "bold" }}>⬅ Back</Text>
      </Pressable>
      <Text style={styles.title}>📊 QR Analytics</Text>

      {/* SUMMARY */}
      <View style={styles.summaryGrid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Tổng lượt quét</Text>
          <Text style={styles.cardValue}>{summary.totalScans}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Hôm nay</Text>
          <Text style={styles.cardValue}>{summary.todayScans}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Địa điểm hot</Text>
          <Text style={styles.cardValue}>{summary.hotLocation}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Thiết bị phổ biến</Text>
          <Text style={styles.cardValue}>{summary.popularDevice}</Text>
        </View>
      </View>

      {/* CHART DAY */}
      <Text style={styles.chartTitle}>📅 Lượt quét theo ngày</Text>

      <LineChart
        data={{
          labels: Object.keys(scansByDay),
          datasets: [{ data: Object.values(scansByDay) as number[] }],
        }}
        width={screenWidth - 30}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: () => "#9333ea",
        }}
      />

      {/* CHART HOUR */}
      <Text style={styles.chartTitle}>⏰ Lượt quét theo giờ</Text>

      <LineChart
        data={{
          labels: Object.keys(scansByHour),
          datasets: [{ data: Object.values(scansByHour) as number[] }],
        }}
        width={screenWidth - 30}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: () => "#22c55e",
        }}
      />

      {/* LOG TABLE */}
      <Text style={styles.chartTitle}>📋 Lịch sử quét QR</Text>

      <FlatList
        data={logs}
        keyExtractor={(item, index) => String(item.logId ?? index)}
        renderItem={({ item }) => (
          <View style={styles.logCard}>
            <Text>📍 {item.locationName}</Text>
            <Text>📱 {item.deviceInfo}</Text>
            <Text>🕒 {item.scanTime}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fafafa",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  cardLabel: {
    color: "#666",
  },

  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
  },

  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },

  logCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
});
