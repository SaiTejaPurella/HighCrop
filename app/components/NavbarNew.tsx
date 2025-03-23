import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NavbarNew = () => {
  const router = useRouter();
  const pathname = usePathname(); 

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, [pathname]); 

  const handleLoginPress = () => {
  
    router.push('/LoginScreen');
    
  };

  const handleHistoryPress = () => {
    if (isLoggedIn) {
      router.push('/History');
    } else {
      Alert.alert('Login Required', 'Please login to view your history.', [
        {
          text: 'OK',
          onPress: () => router.push('/LoginScreen'),
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./Appimage.webp')}
        style={styles.imagebg}
        imageStyle={styles.imageStyle}
        resizeMode='stretch'
      >
        <View style={styles.containerX}>

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.homeButton,
              pathname === '/' && styles.activeButton
            ]}
            onPress={() => router.push('/')}
          >
            <Text style={styles.buttonText}>HighCrop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.aboutButton
            ]}
            onPress={() => { }}
          >
            <Text style={styles.buttonText}>About</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.historyButton,
              pathname === '/History' && styles.activeButton
            ]}
            onPress={handleHistoryPress}
          >
            <Text style={styles.buttonText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.loginButton,
              pathname === '/LoginScreen' && styles.activeButton
            ]}
            onPress={handleLoginPress}
          >
            <Text style={styles.buttonText}>
              {isLoggedIn ? 'Logout' : 'Login'}
            </Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>
    </View>
  );
};

export default NavbarNew;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  containerX: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  imagebg: {
    flex: 1,
  },
  imageStyle: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    width: '100%',
    height: 200,
  },

  navButton: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  activeButton: {
    backgroundColor: '#1B5E20',
  },
  homeButton: {
    backgroundColor: '#2E7D32',
    width: 80,
  },
  aboutButton: {
    backgroundColor: '#2E7D32',
    width: 80,
  },
  historyButton: {
    backgroundColor: '#2E7D32',
    width: 80,
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    width: 80,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
