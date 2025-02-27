import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import textImage from '../assets/croptydepo.png';

const {width, height} = Dimensions.get('window');

const CryptoSlider = () => {
  return (
    <View>
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <MaterialCommunityIcons
          name="lightning-bolt"
          size={28}
          color="#00E5FF"
          style={styles.icon}
        />
        <Text style={styles.title}>
          <Text style={styles.text}>Instant Withdrawals</Text>
        </Text>
      </View>

      {/* Main Card */}
      <View style={styles.container}>
        {/* Image */}
        <View style={styles.imageWrapper}>
          <Image source={textImage} style={styles.image} />
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Ionicons name="wallet-outline" size={22} color="#FFA726" />
          <Text style={styles.infoText}>Secure & Fast Payouts</Text>
        </View>
      </View>
    </View>
  );
};

export default CryptoSlider;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
    marginTop: 40,
  },
  icon: {
    marginRight: 10,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: height * 0.03,
    borderRadius: width * 0.1,
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    shadowColor: '#00E5FF',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  text: {
    color: 'orange',
  },
  imageWrapper: {
    borderRadius: width * 0.1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: 'contain',
    borderRadius: width * 0.08,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.02,
    gap: 10,
  },
  infoText: {
    color: '#FFA726',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
});
