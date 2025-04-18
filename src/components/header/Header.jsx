import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import {useGame} from '../../gamelogic/context/GameContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Header = () => {
  const navigation = useNavigation();
  const {state} = useGame();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.header}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <LottieView
          source={require('../../assets/logo.json')}
          autoPlay
          loop
          style={styles.logo}
        />
        <Text style={styles.primeText}>Prime</Text>
      </View>

      {/* Wallet and Auth Section */}
      <View style={styles.rightContainer}>
        <View style={styles.walletContainer}>
          <Text style={styles.accountType}>Real Account</Text>
          <Text style={styles.balanceText}>Wallet: ₹{state.wallet}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.depositButton}
              onPress={() => navigation.navigate('Deposit')}>
              <Text style={styles.buttonText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => navigation.navigate('Withdraw')}>
              <Text style={styles.buttonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.authButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.authButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: hp('15%'),
    backgroundColor: '#1c1c1c',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: wp('20%'),
    height: hp('8%'),
  },
  primeText: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: '#4CC9FE',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletContainer: {
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  accountType: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#F7931A',
    letterSpacing: 1,
  },
  balanceText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: 'white',
    marginTop: hp('0.5%'),
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: hp('1%'),
  },
  depositButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    marginRight: wp('2%'),
  },
  withdrawButton: {
    backgroundColor: '#F44336',
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
  },
  authButton: {
    backgroundColor: 'orange',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
  },
  authButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
});

export default Header;
