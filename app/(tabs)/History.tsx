import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavbarNew from '../components/NavbarNew';

const HistoryScreen = () => {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('user_id');

      if (!storedUserId) {
        console.error('User ID not found in storage');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://13.126.117.171:5000/history/${storedUserId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('History Data:', data);

      setHistoryData(data);
    } catch (error) {
      console.error('Error fetching history data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    const isCrop = item.type === 'Crop Recommendation';
    const isFertilizer = item.type === 'Fertilizer Recommendation';

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.type}</Text>
        <Text style={styles.cardDescription}>Recommendation: {item.recommendation}</Text>

        
        <Text style={styles.cardDescription}>
          N: {item.n}, P: {item.p}, K: {item.k}
        </Text>

        
        {isCrop && (
          <>
            <Text style={styles.cardDescription}>
              Humidity: {item.humidity?.toFixed(2)}%
            </Text>
            <Text style={styles.cardDescription}>
              pH: {item.pH?.toFixed(2)}
            </Text>
            <Text style={styles.cardDescription}>
              Temperature: {item.temperature?.toFixed(2)}°C
            </Text>
            <Text style={styles.cardDescription}>
              Rainfall: {item.rainfall?.toFixed(2)} mm
            </Text>
          </>
        )}

        
        {isFertilizer && (
          <>
            <Text style={styles.cardDescription}>
              Soil Type: {item.soil_type}
            </Text>
            <Text style={styles.cardDescription}>
              Crop Type: {item.crop_type}
            </Text>
            <Text style={styles.cardDescription}>
              Humidity: {item.humidity}%
            </Text>
            <Text style={styles.cardDescription}>
              Moisture: {item.moisture}%
            </Text>
            <Text style={styles.cardDescription}>
              Temperature: {item.temperature}°C
            </Text>
          </>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading History...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavbarNew />
      <Text style={styles.title}>History</Text>

      {historyData.length === 0 ? (
        <Text style={styles.noHistoryText}>No history records found.</Text>
      ) : (
        <FlatList
          data={historyData}
          keyExtractor={(item) => `${item.type}-${item.id}`} 
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.historyList}
        />
      )}
    </SafeAreaView>
  );
};

type HistoryItem = {
  id: number;
  type: string;
  recommendation: string;
  n: number;
  p: number;
  k: number;

  // Crop Recommendation fields
  humidity?: number;
  pH?: number;
  rainfall?: number;
  temperature?: number;

  // Fertilizer Recommendation fields
  moisture?: number;
  soil_type?: string;
  crop_type?: string;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  noHistoryText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  historyList: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
});

export default HistoryScreen;
