import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Camera } from "lucide-react";

export default function BarcodeScanner({ onDetected }) {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [status, setStatus] = useState("🔍 Đang khởi tạo camera...");
  const [scanning, setScanning] = useState(true);
  const [lastCode, setLastCode] = useState("");

  useEffect(() => {
    let isMounted = true;
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    async function startScanner() {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (devices.length === 0) {
          setStatus("❌ Không tìm thấy camera nào!");
          return;
        }

        const selectedDeviceId = devices[0].deviceId;
        console.log("📷 Đang sử dụng camera:", devices[0].label);
        setStatus("📸 Camera đã bật — hãy đưa mã vạch vào khung!");

        await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (!isMounted) return;
            if (result) {
              const code = result.getText();
              if (code !== lastCode) {
                console.log("✅ Mã quét được:", code);
                setLastCode(code);
                setStatus(`✅ Đã quét được mã: ${code}`);
                onDetected(code);
              }
            }
          }
        );
      } catch (error) {
        console.error("🚨 Lỗi khởi động camera:", error);
        setStatus("⚠️ Không thể khởi động camera.");
      }
    }

    startScanner();

    return () => {
      isMounted = false;
      if (codeReaderRef.current) {
        console.log("🛑 Dừng camera và giải phóng tài nguyên...");
        try {
          codeReaderRef.current.stopContinuousDecode();
          codeReaderRef.current = null;
        } catch (e) {
          console.warn("⚠️ Không thể dừng camera:", e);
        }
      }
    };
  }, [onDetected, lastCode]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Camera className="text-blue-600" size={24} />
          Quét mã vạch
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              scanning ? "bg-green-500 animate-pulse" : "bg-gray-300"
            }`}
          ></span>
          <span className="text-sm text-gray-600">
            {scanning ? "Đang quét..." : "Đã dừng"}
          </span>
        </div>
      </div>

      {/* Video khung quét */}
      <div className="relative rounded-lg overflow-hidden bg-gray-900">
        <video
          ref={videoRef}
          style={{ width: "100%", height: "260px", objectFit: "cover" }}
          muted
          autoPlay
          playsInline
          className="rounded-lg"
        />
        {/* Viền khung quét */}
        <div className="absolute inset-0 border-4 border-blue-500 opacity-50 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-32 border-2 border-red-500">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500"></div>
          </div>
        </div>
      </div>

      {/* Thông tin trạng thái */}
      <p className="text-sm text-gray-500 text-center mt-3">{status}</p>
      {lastCode && (
        <p className="text-green-600 font-semibold text-center mt-1">
          👉 Mã quét được: {lastCode}
        </p>
      )}
    </div>
  );
}
