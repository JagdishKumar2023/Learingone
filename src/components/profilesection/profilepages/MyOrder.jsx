import React, {useState, useCallback, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import OrderDetail from './OrderDetail';

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
    number: '7',
    betType: 'Color',
    potentialWinning: '₹900',
    date: '2023-06-15',
  },
  {
    id: '2',
    game: 'Prime Rings',
    betAmount: '₹250',
    status: 'Loss',
    time: '10:25 PM',
    color: 'Green',
    period: 'P12344',
    number: '12',
    betType: 'Number',
    potentialWinning: '₹450',
    date: '2023-06-15',
  },
  {
    id: '3',
    game: 'Prime Rings',
    betAmount: '₹1000',
    status: 'Pending',
    time: '10:20 PM',
    color: 'Violet',
    period: 'P12343',
    number: '5',
    betType: 'Big',
    potentialWinning: '₹1800',
    date: '2023-06-15',
  },
  {
    id: '4',
    game: 'Prime Rings',
    betAmount: '₹800',
    status: 'Win',
    time: '10:15 PM',
    color: 'Red',
    period: 'P12342',
    number: '3',
    betType: 'Small',
    potentialWinning: '₹1440',
    date: '2023-06-15',
  },
  {
    id: '5',
    game: 'Prime Rings',
    betAmount: '₹600',
    status: 'Loss',
    time: '10:10 PM',
    color: 'Green',
    period: 'P12341',
    number: '9',
    betType: 'Mini',
    potentialWinning: '₹1080',
    date: '2023-06-15',
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
  const navigation = useNavigation();
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [animation] = useState(new Animated.Value(0));
  const arrowAnimation = useRef(new Animated.Value(1)).current;
  const arrowRotateAnimation = useRef(new Animated.Value(0)).current;

  // Handle card press to expand/collapse details
  const handleCardPress = useCallback(
    orderId => {
      if (expandedOrderId === orderId) {
        // Collapse if already expanded
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
        setExpandedOrderId(null);
      } else {
        // Expand if collapsed
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
        setExpandedOrderId(orderId);
      }
    },
    [expandedOrderId, animation],
  );

  const handleBackPress = () => {
    // Enhanced animation for the arrow
    Animated.parallel([
      // Scale animation
      Animated.sequence([
        Animated.timing(arrowAnimation, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(arrowAnimation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      // Rotation animation
      Animated.sequence([
        Animated.timing(arrowRotateAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(arrowRotateAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      navigation.goBack();
    });
  };

  // Interpolate rotation
  const rotateInterpolate = arrowRotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-15deg'],
  });

  // Render each order item
  const renderItem = useCallback(
    ({item}) => {
      const isExpanded = expandedOrderId === item.id;

      return (
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress(item.id)}
            activeOpacity={0.7}>
            <View style={styles.cardContent}>
              <Text style={styles.gameText}>{item.game}</Text>
              <Text style={styles.detailText}>Time: {item.time}</Text>
              <Text style={styles.detailText}>Period: {item.period}</Text>
              <Text style={styles.detailText}>
                Bet Amount: {item.betAmount}
              </Text>
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
              <Icon
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#FFA500"
                style={styles.expandIcon}
              />
            </View>
          </TouchableOpacity>

          {isExpanded && (
            <Animated.View
              style={[
                styles.detailsContainer,
                {
                  opacity: animation,
                  maxHeight: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 500],
                  }),
                },
              ]}>
              <View style={styles.detailsContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Game:</Text>
                  <Text style={styles.detailValue}>{item.game}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>{item.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Time:</Text>
                  <Text style={styles.detailValue}>{item.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Period:</Text>
                  <Text style={styles.detailValue}>{item.period}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bet Type:</Text>
                  <Text style={styles.detailValue}>{item.betType}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Number:</Text>
                  <Text style={styles.detailValue}>{item.number}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Color:</Text>
                  <Text style={styles.detailValue}>{item.color}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bet Amount:</Text>
                  <Text style={styles.detailValue}>{item.betAmount}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Potential Winning:</Text>
                  <Text style={styles.detailValue}>
                    {item.potentialWinning}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {color: getStatusColor(item.status)},
                    ]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}
        </View>
      );
    },
    [expandedOrderId, animation, handleCardPress],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Animated.View
            style={{
              transform: [{scale: arrowAnimation}, {rotate: rotateInterpolate}],
            }}>
            <Icon name="arrow-left" size={28} color="#FFA500" />
          </Animated.View>
        </TouchableOpacity>
        <Text style={styles.headerText}>My Orders</Text>
      </View>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
      />
    </View>
  );
};

export default MyOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  backButton: {
    padding: 8,
    marginRight: width * 0.02,
  },
  headerText: {
    fontSize: width * 0.07,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  flatList: {
    flex: 1,
  },
  list: {
    paddingBottom: height * 0.02,
  },
  cardContainer: {
    marginBottom: height * 0.015,
  },
  card: {
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    padding: height * 0.02,
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
    flex: 1,
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
    marginBottom: height * 0.01,
  },
  statusText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#121212',
  },
  expandIcon: {
    marginTop: height * 0.01,
  },
  detailsContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    marginTop: -height * 0.01,
    marginBottom: height * 0.015,
    overflow: 'hidden',
  },
  detailsContent: {
    padding: height * 0.02,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  detailLabel: {
    fontSize: width * 0.04,
    color: '#AAAAAA',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
