import { CameraView, useCameraPermissions } from "expo-camera";
import { View, Text } from "react-native";
import { useState } from "react";
import { useRouter,router } from "expo-router";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>نحتاج إذن الكاميرا لمسح QR</Text>
        <Text onPress={requestPermission} style={{ color: "blue" }}>
          اضغط لمنح الإذن
        </Text>
      </View>
    );
  }

  const handleScan = (result: { data: string; }) => {
    if (!scanned) {
      setScanned(true);
      //alert("QR Data: " + result.data);
      router.push(`/farm_fork?id=${result.data}`);
      setTimeout(() => setScanned(false), 1500); // إعادة التفعيل بعد ثانية ونصف
    }
    else {
    router.push(`/farm_fork?id=${result.data}`);
    }
  };

  return (
    <CameraView
      style={{ flex: 1 }}
      facing="back"
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      onBarcodeScanned={handleScan}
    />
  );
}
