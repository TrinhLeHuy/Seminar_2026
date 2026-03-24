import React, { useEffect, useRef } from "react";

interface Props {
  onScan: (data: string) => void;
}

export default function QRScannerWeb({ onScan }: Props) {
  const scannerRef = useRef<any>(null);
  const scannedRef = useRef(false);

useEffect(() => {
  const startScanner = async () => {
    const { Html5Qrcode } = await import("html5-qrcode");

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText: string) => {
          if (scannedRef.current) return;

          scannedRef.current = true;

          try {
            await scanner.stop();
            await scanner.clear();
          } catch (e) {}

          onScan(decodedText);
        },
        () => {} // ✅ thêm callback thứ 4
      );
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  startScanner();

  return () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {}
    }
  };
}, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div id="reader" style={{ width: 300 }} />
    </div>
  );
}