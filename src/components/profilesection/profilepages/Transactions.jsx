import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const {width, height} = Dimensions.get('window');

const transactions = [
  {
    id: 'T12345',
    type: 'Deposit',
    amount: '₹500',
    status: 'Complete',
    time: '2025-02-25 10:30 PM',
    date: '2025-02-25',
  },
  {
    id: 'T12346',
    type: 'Withdrawal',
    amount: '₹1000',
    status: 'Pending',
    time: '2025-02-24 10:20 PM',
    date: '2025-02-24',
  },
  {
    id: 'T12347',
    type: 'Deposit',
    amount: '₹250',
    status: 'Rejected',
    time: '2025-02-23 10:15 PM',
    date: '2025-02-23',
  },
  {
    id: 'T12348',
    type: 'Withdrawal',
    amount: '₹800',
    status: 'Complete',
    time: '2025-02-22 10:05 PM',
    date: '2025-02-22',
  },
  {
    id: 'T12349',
    type: 'Deposit',
    amount: '₹1200',
    status: 'Pending',
    time: '2025-02-21 9:50 PM',
    date: '2025-02-21',
  },
];

const getStatusColor = status => {
  switch (status) {
    case 'Complete':
      return '#4CAF50';
    case 'Pending':
      return '#FFC107';
    case 'Rejected':
      return '#F44336';
    default:
      return '#FFFFFF';
  }
};

const formatDate = date => {
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

const Transactions = () => {
  const [filter, setFilter] = useState('All');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const filteredTransactions = transactions.filter(item => {
    const itemDate = new Date(item.date);
    const inDateRange = itemDate >= startDate && itemDate <= endDate;
    if (filter === 'All') return inDateRange;
    if (filter === 'Withdrawal Complete')
      return (
        item.type === 'Withdrawal' && item.status === 'Complete' && inDateRange
      );
    if (filter === 'Withdrawal Rejected')
      return (
        item.type === 'Withdrawal' && item.status === 'Rejected' && inDateRange
      );
    return item.status === filter && inDateRange;
  });

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.transactionId}>Txn ID: {item.id}</Text>
        <Text style={styles.detailText}>Type: {item.type}</Text>
        <Text style={styles.detailText}>Amount: {item.amount}</Text>
        <Text style={styles.detailText}>Time: {item.time}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          {backgroundColor: getStatusColor(item.status)},
        ]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transactions</Text>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={[
            'All',
            'Complete',
            'Pending',
            'Rejected',
            'Withdrawal Complete',
            'Withdrawal Rejected',
          ]}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === item && styles.activeFilterButton,
              ]}
              onPress={() => setFilter(item)}>
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.activeFilterText,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 10}}
        />
      </View>

      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartPicker(true)}>
          <Text style={styles.dateText}>Start: {formatDate(startDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndPicker(true)}>
          <Text style={styles.dateText}>End: {formatDate(endDate)}</Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <FlatList
        data={filteredTransactions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default Transactions;

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
    marginLeft: 10,
  },
  filterContainer: {
    marginBottom: height * 0.02,
  },
  filterButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.06,
    borderRadius: 25,
    backgroundColor: '#1C1C1C',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  activeFilterButton: {
    backgroundColor: '#FFA500',
    borderColor: '#FF4500',
  },
  filterText: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#121212',
    fontWeight: '700',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.03,
  },
  dateButton: {
    backgroundColor: '#1C1C1C',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  dateText: {
    color: '#FFA500',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  list: {
    paddingBottom: height * 0.1,
  },
  card: {
    backgroundColor: '#1C1C1C',
    borderRadius: 15,
    padding: height * 0.025,
    marginBottom: height * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'column',
  },
  transactionId: {
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
