import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { CameraView } from "expo-camera";
import { Camera } from "expo-camera";

interface Props {
  onScan: (data: string) => void;
}

export default function QRScannerMobile({ onScan }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🚀 Xin quyền mỗi lần mount
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    setLoading(true);
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
    setLoading(false);
  };

  const handleScan = ({ data }: any) => {
    if (scanned) return;
    setScanned(true);
    onScan(data);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10 }}>
          Camera permission required
        </Text>
        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={{ color: "#fff" }}>Allow Camera</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />

      {/* Overlay scan */}
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
        <Text style={styles.text}>Scan QR Code</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  btn: { backgroundColor: "#007AFF", padding: 12, borderRadius: 10 },
  overlay: { position: "absolute", top: "30%", width: "100%", alignItems: "center" },
  scanBox: { width: 250, height: 250, borderWidth: 2, borderColor: "#00FF00", borderRadius: 12 },
  text: { marginTop: 10, color: "#fff", fontWeight: "bold" },
});