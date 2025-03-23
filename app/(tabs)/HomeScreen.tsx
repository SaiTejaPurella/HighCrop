import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import NavbarNew from "../components/NavbarNew";

export default function Home() {
  const router = useRouter();
  const [soilData, setSoilData] = useState({
    n: "",
    p: "",
    k: "",
    humidity: "",
    pH: "",
    rainfall: "",
    temperatur: "",
    moisture: "",
    soilType: "",
    cropType: "",
  });

  const backendUrl = "http://13.126.117.171:5000";
  const validateInputs = (fields: string[]) => {
    for (const field of fields) {
      if (!soilData[field as keyof typeof soilData]) {
        Alert.alert("Validation Error", `Please fill ${field.toUpperCase()}`);
        return false;
      }
    }
    return true;
  };

  const handleCropRecommendation = async () => {
    const requiredFields = ["n", "p", "p", 'pH',"humidity", "temperatur", "rainfall"];
    if (!validateInputs(requiredFields)) return;

    try {
      const response = await fetch(`${backendUrl}/recommend/crop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          n: soilData.n,
          p: soilData.p,
          k: soilData.k,
          pH:soilData.pH,
          humidity: soilData.humidity,
          temperature: soilData.temperatur,
          rainfall: soilData.rainfall,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push({
          pathname: "./CropScreen",
          params: {
            recommendation: data.recommendation,
            n: soilData.n,
            p: soilData.p,
            k: soilData.k,
            pH:soilData.pH,
            humidity: soilData.humidity,
            temperature: soilData.temperatur,
            rainfall: soilData.rainfall,
          },
        });
      } else {
        Alert.alert("Error", data.message || "Failed to get crop recommendation");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  const handleFertilizerRecommendation = async () => {
    const requiredFields = [
      "n",
      "p",
      "k",
      "temperatur",
      "humidity",
      "moisture",
      "soilType",
      "cropType",
    ];
    if (!validateInputs(requiredFields)) return;

    try {
      const response = await fetch(`${backendUrl}/recommend/fertilizer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          n: soilData.n,
          p: soilData.p,
          k: soilData.k,
          temperature: soilData.temperatur,
          humidity: soilData.humidity,
          moisture: soilData.moisture,
          soil_type: soilData.soilType,
          crop_type: soilData.cropType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push({
          pathname: "./FertilizerScreen",
          params: {
            recommendation: data.recommendation,
            n: soilData.n,
            p: soilData.p,
            k: soilData.k,
            temperature: soilData.temperatur,
            humidity: soilData.humidity,
            moisture: soilData.moisture,
            soilType: soilData.soilType,
            cropType: soilData.cropType,
          },
        });
      } else {
        Alert.alert("Error", data.message || "Failed to get fertilizer recommendation");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  return (
    <View style={styles.container}>
      <NavbarNew />

      {(Object.keys(soilData) as Array<keyof typeof soilData>).map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key.toUpperCase()}
          keyboardType={["soilType", "cropType"].includes(key) ? "default" : "numeric"}
          value={soilData[key]}
          onChangeText={(value) => setSoilData((prev) => ({ ...prev, [key]: value }))}
        />
      ))}

      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Button title="Crop" color="#2E7D32" onPress={handleCropRecommendation} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Fertilizer" color="#2E7D32" onPress={handleFertilizerRecommendation} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9", },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderColor: "#2E7D32",
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent:'space-between',
    marginTop: 5,
    marginLeft:10,
    marginRight:10,
  },
  buttonContainer: {
    width: 120,
    borderRadius: 5,
  },
});
