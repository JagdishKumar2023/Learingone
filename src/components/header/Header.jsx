import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useWindowDimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import {useGame} from '../../gamelogic/context/GameContext';

const Header = () => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  const {state} = useGame();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={[styles.header, {paddingHorizontal: width * 0.05}]}>
      {/* Logo Section (Stacked) */}
      <View style={styles.logoContainer}>
        <LottieView
          source={require('../../assets/logo.json')}
          autoPlay
          loop
          style={styles.logo}
        />
        <Text style={styles.primeText}>Prime</Text>
      </View>

      {/* Wallet and Auth Section (Side by Side) */}
      <View style={styles.rightContainer}>
        <View style={styles.walletContainer}>
          <Text style={styles.accountType}>Real Account</Text>
          <Text style={styles.balanceText}>Wallet: ₹ {state.wallet}</Text>
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

        {/* Sign In / Sign Up Button */}
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.authButtonText}>SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 130,
    backgroundColor: '#1c1c1c',
    flexDirection: 'row', // Layout set to horizontal
    justifyContent: 'space-between', // Space between sections
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 110,
    height: 100,
  },
  primeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CC9FE',
  },
  rightContainer: {
    flexDirection: 'row', // Wallet & Sign-in side by side
    alignItems: 'center',
  },
  walletContainer: {
    alignItems: 'center',
    marginRight: 30, // Space between wallet & sign-in button
  },
  accountType: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F7931A',
    letterSpacing: 1,
  },
  balanceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  depositButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  withdrawButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  authButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  authButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Header;
