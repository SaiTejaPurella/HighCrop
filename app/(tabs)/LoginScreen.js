import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Validation Error", "Username and Password are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://13.126.117.171:5000/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { user_id, username: returnedUsername, message } = data;

        if (user_id && returnedUsername) {
         
          await AsyncStorage.multiSet([
            ["user_id", String(user_id)],
            ["username", returnedUsername],
          ]);

          console.log("Saved to AsyncStorage:", { user_id, returnedUsername });

          Alert.alert("Login Successful", `Welcome, ${returnedUsername}!`);
          router.push("/(tabs)/HomeScreen");  
        } else {
          Alert.alert("Login Failed", "Missing user details from server response.");
        }
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!username || !password) {
      Alert.alert("Validation Error", "Username and Password are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://13.126.117.171:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Signup Successful", "You can now log in!");
        router.push("/(tabs)/HomeScreen");
      } else {
        Alert.alert("Signup Failed", data.message || "Could not create account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HighCrop</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>
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
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    color: "#2E7D32" 
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A5D6A7",
  },
  buttonText: { 
    color: "white", 
    fontSize: 18 
  },
});
