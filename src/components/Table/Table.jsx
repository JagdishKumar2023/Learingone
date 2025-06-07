import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  FlatList,
  SafeAreaView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useGetLiveWinningDetails} from '../../apiforgame/useBackendApi';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const {width, height} = Dimensions.get('window');

// Custom shape components with enhanced styling
const TriangleUp = ({color, size}) => (
  <View style={{
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: wp('1%'),
    borderRightWidth: wp('1%'),
    borderBottomWidth: wp('1.5%'),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: color,
  }} />
);

const TriangleDown = ({color, size}) => (
  <View style={{
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: wp('1%'),
    borderRightWidth: wp('1%'),
    borderTopWidth: wp('1.5%'),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: color,
  }} />
);

const Diamond = ({color, size}) => (
  <View style={{
    width: wp('2%'),
    height: wp('2%'),
    backgroundColor: color,
    transform: [{rotate: '45deg'}],
  }} />
);

const Table = ({currentTimer = 30, onTimerComplete}) => {
  // Use the API hook with the timer from props
  const {data: tableData, loading: isLoading, refetch} = useGetLiveWinningDetails(currentTimer);
  const [localData, setLocalData] = useState([]);
  
  // Set up data polling (refresh every 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [refetch]);

  // Refresh data when timer completes
  useEffect(() => {
    if (onTimerComplete) {
      // Create a handler that will refresh data when timer completes
      const handleTimerComplete = () => {
        // Add a slight delay to ensure backend has processed the results
        setTimeout(() => {
          refetch();
        }, 1000);
      };

      // Subscribe to timer completion events
      onTimerComplete(handleTimerComplete);

      // Cleanup function
      return () => {
        // Unsubscribe from timer completion events if needed
        if (onTimerComplete.cleanup) {
          onTimerComplete.cleanup(handleTimerComplete);
        }
      };
    }
  }, [onTimerComplete, refetch]);

  // Update data when tableData changes
  useEffect(() => {
    if (tableData?.data) {
      console.log('Raw API Data:', tableData.data);
      const transformedData = tableData.data.map(item => ({
        period: item.period_number || item.periodNumber || '-',
        number: item.number?.toString() || '-',
        color: item.color || '-',
        size: item.size || '-'
      }));
      console.log('Transformed Data:', transformedData);
      setLocalData(transformedData);
    }
  }, [tableData]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(localData.length / itemsPerPage));
  
  // Reset to page 1 when timer changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentTimer]);
  
  const displayedData = localData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Get color based on color name
  const getColorHex = color => {
    if (!color || color === '-') return '#808080';
    switch (color.toLowerCase()) {
      case 'red':
        return '#FF5252';
      case 'green':
        return '#4CAF50';
      case 'violet':
        return '#9C27B0';
      default:
        return '#808080';
    }
  };

  // Get number background color based on its value
  const getNumberColor = number => {
    if (!number || number === '-') return '#808080';
    const num = parseInt(number);
    if (isNaN(num)) return '#808080';
    if (num === 0) return '#9C27B0'; // Violet
    if (num === 1 || num === 3 || num === 7 || num === 9) return '#FF5252'; // Red
    return '#4CAF50'; // Green for even numbers
  };

  // Format period number to prevent wrapping
  const formatPeriodNumber = (periodNum) => {
    if (!periodNum || periodNum === '-') return '-';
    return periodNum;
  };

  // Render size indicator with appropriate styling
  const renderSizeIndicator = (size) => {
    if (size === '-') {
      return (
        <View style={styles.naContainer}>
          <Text style={styles.naText}>-</Text>
        </View>
      );
    }
    
    let label = 'Small';
    let bgGradientColors = ['rgba(233, 30, 99, 0.2)', 'rgba(233, 30, 99, 0.3)']; // Pink gradient
    let textColor = '#E91E63';
    let ShapeComponent = TriangleDown;
    let shapeSize = wp('2%');
    let borderColor = 'rgba(233, 30, 99, 0.5)';
    
    if ((size || '').toLowerCase().includes('big') || 
        (size || '').toLowerCase().includes('large')) {
      label = 'Big';
      bgGradientColors = ['rgba(76, 175, 80, 0.2)', 'rgba(76, 175, 80, 0.3)']; // Green gradient
      textColor = '#4CAF50';
      ShapeComponent = TriangleUp;
      borderColor = 'rgba(76, 175, 80, 0.5)';
    } else if ((size || '').toLowerCase().includes('mini')) {
      label = 'Mini';
      bgGradientColors = ['rgba(33, 150, 243, 0.2)', 'rgba(33, 150, 243, 0.3)']; // Blue gradient
      textColor = '#2196F3';
      ShapeComponent = Diamond;
      borderColor = 'rgba(33, 150, 243, 0.5)';
    }
    
    return (
      <LinearGradient
        colors={bgGradientColors}
          style={[
          styles.sizeContainer,
          {borderColor: borderColor}
        ]}>
        <View style={styles.iconContainer}>
          <ShapeComponent color={textColor} size={shapeSize} />
        </View>
        <Text style={[styles.sizeText, {color: textColor}]}>
          {label}
        </Text>
      </LinearGradient>
    );
  };

  // Render the table header row
  const renderTableHeader = () => (
    <LinearGradient
      colors={['#5D2C7E', '#421360']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={styles.headerRow}>
      <Text style={[styles.headerCell, {flex: 1.2}]}>Period</Text>
      <Text style={styles.headerCell}>Number</Text>
      <Text style={styles.headerCell}>Color</Text>
      <Text style={styles.headerCell}>Size</Text>
    </LinearGradient>
  );

  // Render an individual result row
  const renderResultRow = ({item, index}) => {
    console.log('Rendering Row:', item);
    return (
      <View style={[
        styles.resultRow,
        index % 2 === 0 ? styles.evenRow : styles.oddRow
      ]}>
        {/* Period */}
        <View style={[styles.cell, styles.periodCell]}>
          <View style={styles.periodBox}>
            <Text style={styles.periodText}>{item.period}</Text>
          </View>
        </View>

        {/* Number with Color */}
        <View style={[styles.cell, styles.numberCell]}>
          <View style={[
            styles.numberCircle,
            { borderColor: getColorHex(item.color) }
          ]}>
            <Text style={[
              styles.numberText,
              { color: getNumberColor(item.number) }
            ]}>
              {item.number}
            </Text>
          </View>
        </View>

        {/* Color Ball */}
        <View style={[styles.cell, styles.colorCell]}>
          <View style={[
            styles.colorBall,
            { backgroundColor: getColorHex(item.color) }
          ]} />
        </View>

        {/* Size */}
        <View style={[styles.cell, styles.sizeCell]}>
          <View style={[
            styles.sizeBox,
            item.size?.toLowerCase().includes('big') && styles.bigSizeBox,
            item.size?.toLowerCase().includes('small') && styles.smallSizeBox,
            item.size?.toLowerCase().includes('mini') && styles.miniSizeBox,
          ]}>
            <Text style={styles.sizeText}>{item.size}</Text>
          </View>
        </View>
    </View>
  );
  };

  // Render pagination controls
  const renderPagination = () => {
    if (displayedData.length === 0) return null;

  return (
      <LinearGradient
        colors={['rgba(40, 30, 60, 0.7)', 'rgba(30, 20, 50, 0.7)']}
        style={styles.paginationContainer}>
        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          style={[
            styles.pageButton,
            currentPage === 1 && styles.disabledButton,
          ]}>
          <LinearGradient
            colors={currentPage === 1 ? ['#444', '#333'] : ['#602C8E', '#4C1D79']}
            style={styles.pageButtonGradient}>
            <Text style={styles.pageButtonText}>Prev</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>
            {currentPage} / {totalPages}
        </Text>
        </View>

        <TouchableOpacity
          disabled={currentPage >= totalPages}
          onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          style={[
            styles.pageButton,
            currentPage >= totalPages && styles.disabledButton,
          ]}>
          <LinearGradient
            colors={currentPage >= totalPages ? ['#444', '#333'] : ['#602C8E', '#4C1D79']} 
            style={styles.pageButtonGradient}>
            <Text style={styles.pageButtonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  // Render loading state
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFD700" />
      <Text style={styles.loadingText}>Loading results...</Text>
      </View>
  );

  // Render empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No results available
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading results...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#1A1A25', '#2D1E3D']}
        style={styles.container}>
        <View style={styles.titleContainer}>
          <LinearGradient
            colors={['#602C8E', '#4C1D79']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.titleBadge}
          >
            <Text style={styles.title}>Prime Rings Results</Text>
          </LinearGradient>
        </View>
         
        {/* Results Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          {renderTableHeader()}
          
          {/* Table Content */}
          {displayedData.length > 0 ? (
            <FlatList
              data={displayedData}
              renderItem={renderResultRow}
              keyExtractor={(item, index) => `${item.period}-${index}`}
              style={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmpty()
          )}
          
          {/* Pagination */}
          {renderPagination()}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Table;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    borderRadius: wp('3%'),
    overflow: 'hidden',
    padding: wp('3%'),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  titleBadge: {
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.4,
        shadowRadius: 3,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  tableContainer: {
    flex: 1,
    borderRadius: wp('2%'),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#8A4FBD',
    backgroundColor: 'rgba(20, 15, 30, 0.9)',
    ...Platform.select({
      ios: {
        shadowColor: '#8A4FBD',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#8A4FBD',
  },
  headerCell: {
    flex: 1,
    color: 'white',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  resultsList: {
    flexGrow: 0,
    maxHeight: hp('40%'), // Ensure the list doesn't grow too large
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: 60,
  },
  evenRow: {
    backgroundColor: 'rgba(48, 16, 78, 0.8)',
  },
  oddRow: {
    backgroundColor: 'rgba(38, 12, 62, 0.8)',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodCell: {
    flex: 2,
  },
  periodBox: {
    backgroundColor: 'rgba(20, 10, 38, 0.9)',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: '95%',
  },
  periodText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  numberCell: {
    flex: 1,
  },
  numberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  numberText: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  colorCell: {
    flex: 1,
  },
  colorBall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sizeCell: {
    flex: 1,
  },
  sizeBox: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bigSizeBox: {
    backgroundColor: 'rgba(255, 82, 82, 0.2)',
    borderColor: '#FF5252',
  },
  smallSizeBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  miniSizeBox: {
    backgroundColor: 'rgba(156, 39, 176, 0.2)',
    borderColor: '#9C27B0',
  },
  sizeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  naContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.3)',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('1.5%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  naText: {
    color: '#999',
    fontSize: wp('3.5%'),
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderTopWidth: 1,
    borderColor: '#5D4777',
  },
  pageButton: {
    borderRadius: wp('1%'),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      }
    }),
  },
  pageButtonGradient: {
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: wp('15%'),
  },
  disabledButton: {
    opacity: 0.6,
  },
  pageButtonText: {
    color: '#FFD700',
    fontSize: wp('3.5%'),
    fontWeight: '500',
  },
  pageIndicator: {
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('1%'),
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pageText: {
    color: 'white',
    fontSize: wp('3.5%'),
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('10%'),
  },
  loadingText: {
    color: '#FFD700',
    marginTop: hp('1%'),
    fontSize: wp('4%'),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('10%'),
  },
  emptyText: {
    color: '#999',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  miniColorBall: {
    width: wp('1.8%'),
    height: wp('1.8%'),
    borderRadius: wp('0.9%'),
    marginLeft: wp('0.8%'),
  },
  colorText: {
    color: '#FFFFFF',
    fontSize: wp('3.2%'),
    fontWeight: '500',
  },
});
