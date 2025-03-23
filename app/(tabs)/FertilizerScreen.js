import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from "react-native";

import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FertilizerScreen() {
  const router = useRouter();

  const {
    recommendation,
    n,
    p,
    k,
    temperature,
    humidity,
    moisture,
    soilType,
    cropType
  } = useLocalSearchParams();

  const handleSave = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");

      if (!user_id) {
        Alert.alert("Not Logged In", "Please log in to save your recommendation.");
        return;
      }

      const postData = {
        user_id: parseInt(user_id), 
        
        n,
        p,
        k,
        temperature,
        humidity,
        moisture,
        soil_type: soilType,
        crop_type: cropType,
        recommendation,
      };

      console.log("Posting data:", postData);

      const response = await fetch("http://13.126.117.171:5000/save/fertilizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", `${recommendation} recommendation saved!`);
      } else {
        console.error("Save error:", data);
        Alert.alert("Error", data.message || "Failed to save recommendation.");
      }
    } catch (error) {
      console.error("handleSave error:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Recommended Fertilizer</Text>
        <Text style={styles.result}>Fertilizer: {recommendation}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#E8F5E9" 
  },
  wrapper: {
    flexDirection: 'column',
    borderWidth: 1,
    width: 300,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderColor: 'green',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#2E7D32" 
  },
  result: { 
    fontSize: 20, 
    marginTop: 20, 
    color: "#388E3C" 
  },
  button: {
    marginTop: 25,
    backgroundColor: '#2E7D32',
    width: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  backButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#A5D6A7',
    borderRadius: 10
  },
  backButtonText: {
    color: '#1B5E20',
    fontWeight: 'bold'
  }
});
