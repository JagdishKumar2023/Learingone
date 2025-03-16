import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const depositAmounts = [250, 500, 1000, 10000];

const UpiCryptoDeposit = () => {
  const [customAmount, setCustomAmount] = useState('');

  return (
    <LinearGradient colors={['#000000', '#FF8C00']} style={styles.container}>
      <Text style={styles.header}>Deposit Funds</Text>
      <Text style={styles.subHeader}>Select Deposit Amount</Text>
      <Text style={styles.minDeposit}>
        Minimum Deposit: ₹250 | Minimum Withdrawal: ₹500
      </Text>

      <FlatList
        data={depositAmounts}
        numColumns={2}
        keyExtractor={item => item.toString()}
        contentContainerStyle={styles.amountList}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.amountButton}
            onPress={() => setCustomAmount(item.toString())}>
            <Text style={styles.amountText}>₹{item}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.subHeader}>Or Enter Custom Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter amount"
        placeholderTextColor="#FFD700"
        value={customAmount}
        onChangeText={setCustomAmount}
      />

      <View style={styles.paymentIconsContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons name="phone" size={50} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="cc-paypal" size={50} color="#002E6E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="cc-visa" size={50} color="#1A1F71" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons name="bitcoin" size={50} color="#F7931A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons
            name="currency-inr"
            size={50}
            color="#4CAF50"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.payButton}>
        <Text style={styles.payButtonText}>Proceed to Pay</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  minDeposit: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  amountList: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountButton: {
    backgroundColor: '#222',
    paddingVertical: 20,
    paddingHorizontal: 40,
    margin: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 25,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#222',
    color: '#FFD700',
    fontSize: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '80%',
    textAlign: 'center',
    marginBottom: 20,
  },
  paymentIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 30,
  },
  iconButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  payButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  payButtonText: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default UpiCryptoDeposit;
