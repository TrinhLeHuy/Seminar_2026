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
  const [scansByDay, setScansByDay] = useState<any>({});
  const [scansByHour, setScansByHour] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const API = "http://192.168.2.23:8080/api/qr-scan/logs";

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.warn("API wrong format:", data);
          setLoading(false);
          return;
        }

        setLogs(data);

        const totalScans = data.length;
        const today = new Date().toISOString().split("T")[0];
        const todayScans = data.filter((log: any) =>
          log.scanTime?.startsWith(today),
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

        setSummary({ totalScans, todayScans, hotLocation, popularDevice });

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
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>📊 QR Analytics</Text>

      {/* SUMMARY GRID */}
      <View style={styles.summaryGrid}>
        {[
          { label: "Tổng lượt quét", value: summary.totalScans },
          { label: "Hôm nay", value: summary.todayScans },
          { label: "Địa điểm hot", value: summary.hotLocation },
          { label: "Thiết bị phổ biến", value: summary.popularDevice },
        ].map((item, idx) => (
          <View key={idx} style={styles.summaryCard}>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* CHARTS */}
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
          labelColor: () => "#6b7280",
        }}
        style={styles.chartStyle}
        bezier
      />

      <Text style={styles.chartTitle}>⏰ Lượt quét theo giờ</Text>
      <LineChart
        data={{
          labels: Object.keys(scansByHour).map((h) => h + "h"),
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
          labelColor: () => "#6b7280",
        }}
        style={styles.chartStyle}
        bezier
      />

      {/* LOG TABLE */}
      {/* LOG TABLE */}
      <Text style={styles.chartTitle}>📋 Lịch sử quét QR</Text>

      {/* Table Header */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.tableCell, { flex: 3 }]}>📍 Location</Text>
        <Text style={[styles.tableCell, { flex: 2 }]}>📱 Device</Text>
        <Text style={[styles.tableCell, { flex: 3 }]}>🕒 Time</Text>
      </View>

      {/* Table Body */}
      <FlatList
        data={logs}
        keyExtractor={(item, idx) => String(item.logId ?? idx)}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.tableRow,
              { backgroundColor: index % 2 === 0 ? "#fff" : "#f3f4f6" },
            ]}
          >
            <Text style={[styles.tableCell, { flex: 3 }]}>
              {item.locationName}
            </Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              {item.deviceInfo}
            </Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{item.scanTime}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
  },
  tableCell: {
    fontSize: 14,
    color: "#111827",
  },
  container: { flex: 1, padding: 15, backgroundColor: "#f9fafb" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },

  backButton: { marginBottom: 10 },
  backText: { color: "#ef4444", fontWeight: "bold", fontSize: 16 },

  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardLabel: { color: "#6b7280", fontSize: 14 },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    color: "#111827",
  },

  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#111827",
  },
  chartStyle: { borderRadius: 12 },

  logCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  logText: { fontSize: 14, color: "#111827", marginBottom: 4 },
});
