import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import textImage from '../assets/croptydepo.png'; // Import the image correctly

// Get device width & height
const {width, height} = Dimensions.get('window');

const CryptoSlider = () => {
  return (
    <View>
      <Text style={styles.title}>
        Instant <Text style={styles.text}>Withdrawals</Text>
      </Text>
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image source={textImage} style={styles.image} />
        </View>
      </View>
    </View>
  );
};

export default CryptoSlider;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'black',
    padding: height * 0.03, // 3% of screen height
    borderRadius: width * 0.1, // Scales border radius
    marginHorizontal: width * 0.05, // 5% of screen width
    marginVertical: height * 0.02, // 2% of screen height
  },
  title: {
    fontSize: width * 0.06, // Scales text size
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginTop: height * 0.02, // 2% of screen height
  },
  text: {
    color: 'cyan',
  },
  imageWrapper: {
    borderRadius: width * 0.1, // 10% of screen width
    padding: height * 0.01, // 1% of screen height
    shadowColor: '#000',
    shadowOffset: {width: 3, height: 2},
    shadowRadius: 10,
  },
  image: {
    width: width * 0.8, // 80% of screen width
    height: height * 0.4, // 40% of screen height
    resizeMode: 'contain',
    borderRadius: width * 0.08, // 8% of screen width
  },
});
