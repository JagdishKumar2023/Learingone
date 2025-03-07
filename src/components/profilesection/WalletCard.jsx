import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

const WalletCard = ({balance, onDeposit, onWithdraw}) => {
  return (
    <LinearGradient
      colors={['#ff8c00', '#1f1f1f']}
      style={styles.cardContainer}>
      <Text style={styles.balanceLabel}>Wallet Balance</Text>
      <Text style={styles.balanceAmount}>₹ {balance}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.depositButton} onPress={onDeposit}>
          <Icon name="arrow-down" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.withdrawButton} onPress={onWithdraw}>
          <Icon name="arrow-up" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Withdraw</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default WalletCard;

const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    marginTop: 15,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  balanceLabel: {
    color: '#bbb',
    fontSize: 18,
    marginBottom: 5,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  depositButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
