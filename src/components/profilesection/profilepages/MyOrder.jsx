import React from 'react';
import {StyleSheet, Text, View, FlatList, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const orders = [
  {
    id: '1',
    game: 'Prime Rings',
    betAmount: '₹500',
    status: 'Win',
    time: '10:30 PM',
    color: 'Red',
    period: 'P12345',
  },
  {
    id: '2',
    game: 'Prime Rings',
    betAmount: '₹250',
    status: 'Loss',
    time: '10:25 PM',
    color: 'Green',
    period: 'P12344',
  },
  {
    id: '3',
    game: 'Prime Rings',
    betAmount: '₹1000',
    status: 'Pending',
    time: '10:20 PM',
    color: 'Violet',
    period: 'P12343',
  },
  {
    id: '4',
    game: 'Prime Rings',
    betAmount: '₹800',
    status: 'Win',
    time: '10:15 PM',
    color: 'Red',
    period: 'P12342',
  },
];

const getStatusColor = status => {
  switch (status) {
    case 'Win':
      return '#4CAF50';
    case 'Loss':
      return '#F44336';
    case 'Pending':
      return '#FFC107';
    default:
      return '#FFFFFF';
  }
};

const getColorBadge = color => {
  switch (color) {
    case 'Red':
      return '#FF0000';
    case 'Green':
      return '#00FF00';
    case 'Violet':
      return '#8A2BE2';
    default:
      return '#FFFFFF';
  }
};

const MyOrder = () => {
  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.gameText}>{item.game}</Text>
        <Text style={styles.detailText}>Time: {item.time}</Text>
        <Text style={styles.detailText}>Period: {item.period}</Text>
        <Text style={styles.detailText}>Bet Amount: {item.betAmount}</Text>
      </View>
      <View style={styles.rightSection}>
        <View
          style={[
            styles.colorBadge,
            {backgroundColor: getColorBadge(item.color)},
          ]}>
          <Text style={styles.colorText}>{item.color}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(item.status)},
          ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default MyOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
  },
  header: {
    fontSize: width * 0.07,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  list: {
    paddingBottom: height * 0.1,
  },
  card: {
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    padding: height * 0.02,
    marginBottom: height * 0.015,
    shadowColor: '#FFA500',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'column',
  },
  gameText: {
    fontSize: width * 0.05,
    color: '#FFA500',
    fontWeight: '600',
    marginBottom: height * 0.01,
  },
  detailText: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    fontWeight: '400',
    marginBottom: height * 0.005,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  colorBadge: {
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.05,
    borderRadius: 20,
    marginBottom: height * 0.01,
  },
  colorText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#121212',
  },
  statusBadge: {
    paddingVertical: height * 0.007,
    paddingHorizontal: width * 0.04,
    borderRadius: 20,
  },
  statusText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#121212',
  },
});
