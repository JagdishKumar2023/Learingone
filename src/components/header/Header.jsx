import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useWindowDimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';

const Header = ({balance = '0.00'}) => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation(); // Access navigation hook

  return (
    <View style={[styles.header, {paddingHorizontal: width * 0.05}]}>
      {/* Animated Logo with Prime Text */}
      <View style={styles.logoContainer}>
        <LottieView
          source={require('../../assets/logo.json')}
          autoPlay
          loop
          style={styles.logo}
        />
        <Text style={styles.primeText}>Prime</Text>
      </View>

      <View style={styles.walletContainer}>
        <Text style={styles.accountType}>Real Account</Text>
        <Text style={styles.balanceText}>Wallet: ₹ {balance}</Text>
      </View>

      {/* Touchable Icon to navigate to UpiPayment */}
      <TouchableOpacity onPress={() => navigation.navigate('UpiPayment')}>
        <Icon name="wallet" size={50} color="#F7931A" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 130,
    backgroundColor: '#1c1c1c',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 60,
  },
  primeText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#4CC9FE',
  },
  walletContainer: {
    alignItems: 'flex-end',
  },
  accountType: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F7931A',
    letterSpacing: 1,
  },
  balanceText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
});

export default Header;
