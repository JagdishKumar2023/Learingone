import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import gstPage from '../../assets/gst.png';

const {width, height} = Dimensions.get('window');

const GstPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        <Icon name="money" size={30} color="#FFD700" /> No tax with{' '}
        <Text style={styles.primeText}>
          Prime <Icon name="star" size={25} color="#4CC9FE" />
        </Text>
      </Text>
      <Image source={gstPage} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    marginTop: height * 0.03,
    borderRadius: 20,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
    color: 'white',
  },
  primeText: {
    color: '#4CC9FE',
    fontWeight: 'bold',
  },
  image: {
    width: width * 0.9,
    height: height * 0.4,
    borderRadius: 20,
    resizeMode: 'contain',
  },
});

export default GstPage;
