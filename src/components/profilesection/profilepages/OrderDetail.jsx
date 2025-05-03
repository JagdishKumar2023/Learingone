import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

const OrderDetail = ({order, onClose}) => {
  if (!order) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Order Details</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color="#FFA500" />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Game</Text>
            <Text style={styles.value}>{order.game}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Period</Text>
            <Text style={styles.value}>{order.period}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{order.time}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bet Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Bet Amount</Text>
            <Text style={styles.value}>₹{order.betAmount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Color</Text>
            <Text style={styles.value}>{order.color}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Size</Text>
            <Text style={styles.value}>{order.size}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Potential Win</Text>
            <Text style={styles.value}>₹{order.potentialWin}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.value, styles.statusText]}>
              {order.status}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerText: {
    fontSize: width * 0.06,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: width * 0.05,
  },
  section: {
    marginBottom: height * 0.03,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: height * 0.02,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  label: {
    fontSize: width * 0.04,
    color: '#AAAAAA',
    fontWeight: '500',
  },
  value: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statusText: {
    color: '#FFA500',
  },
});
