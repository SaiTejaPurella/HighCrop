import React from 'react';
import { View, TouchableOpacity, StyleSheet, ImageBackground, Text } from 'react-native';
import { useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();

  const handleFirstButtonPress = () => {
    router.push('/HomeScreen');
  };

  const handleSecondButtonPress = () => {
    console.log('Organic Farmer button pressed');
  };

  return (
    <View style={styles.container}>

     
      <TouchableOpacity style={styles.button} onPress={handleFirstButtonPress}>
        <ImageBackground
          source={require('../components/Inorganic.jpg')}
          style={styles.image}
          imageStyle={styles.imagestyle}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.text}>Inorganic</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.button} onPress={handleSecondButtonPress}>
        <ImageBackground
          source={require('../components/Organic.jpg')}
          style={styles.image}
          imageStyle={styles.imagestyle}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.text}>Organic</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor:'#2E7D32'

  },
  button: {
    flex: 1,
    width: '100%',
    borderWidth:3,
    borderColor:'#2E7D32',
  },
  image: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',  
    borderRadius:10
    
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagestyle:{
    borderRadius:30,
  }
});
