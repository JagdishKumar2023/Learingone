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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useGetLiveWinningDetails} from '../../apiforgame/useBackendApi';
import {useLiveWinningDetails} from '../../hooks/useLiveWinningDetails';

const {width, height} = Dimensions.get('window');

const Table = () => {
  const headers = ['Period', 'Number', 'Color', 'Size'];
  const data = [
    {period: '202403', number: 8, color: 'Red', size: 'Large'},
    {period: '202404', number: 3, color: 'Blue', size: 'Small'},
    {period: '202405', number: 7, color: 'Green', size: 'Large'},
    {period: '202406', number: 2, color: 'Yellow', size: 'Small'},
    {period: '202407', number: 9, color: 'Purple', size: 'Large'},
    {period: '202408', number: 1, color: 'Orange', size: 'Small'},
    {period: '202409', number: 6, color: 'Pink', size: 'Large'},
    {period: '202410', number: 4, color: 'Cyan', size: 'Small'},
  ];

  const {data: tableData, loading: isLoading} = useGetLiveWinningDetails();
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    if (tableData && tableData.data && tableData.data.length > 0) {
      // Transform API data to match our table format
      const transformedData = tableData.data.map(item => ({
        period: item.periodNumber || 'N/A',
        number: item.number || 'N/A',
        color: item.color || 'N/A',
        size: item.size || 'N/A',
      }));
      setLocalData(transformedData);
    }
  }, [tableData]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(localData.length / itemsPerPage);
  const displayedData = localData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getIcon = (column, value) => {
    switch (column) {
      case 'Period':
        return <Icon name="calendar" size={18} color="#FF9800" />;
      case 'Number':
        return <Icon name="hashtag" size={18} color="#4CAF50" />;
      case 'Color':
        return (
          <Icon name="paint-brush" size={18} color={value.toLowerCase()} />
        );
      case 'Size':
        return (
          <Icon
            name={value === 'Large' ? 'expand' : 'compress'}
            size={18}
            color="#E91E63"
          />
        );
      default:
        return null;
    }
  };

  const getBackgroundColor = color => {
    switch (color.toLowerCase()) {
      case 'red':
        return '#FFCDD2'; // Light red
      case 'green':
        return '#C8E6C9'; // Light green
      case 'blue':
        return '#BBDEFB'; // Light blue
      case 'yellow':
        return '#FFF9C4'; // Light yellow
      case 'purple':
        return '#E1BEE7'; // Light purple
      case 'orange':
        return '#FFE0B2'; // Light orange
      case 'pink':
        return '#F8BBD0'; // Light pink
      case 'cyan':
        return '#B2EBF2'; // Light cyan
      default:
        return 'transparent';
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.row}>
      {Object.entries(item).map(([key, value], colIndex) => (
        <View
          key={`${item.period}-${colIndex}`}
          style={[
            styles.cell,
            key === 'Color' ? {backgroundColor: getBackgroundColor(value)} : {},
          ]}>
          {getIcon(key, value)}
          <Text style={styles.cellText}> {value}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prime Rings Results History</Text>

      {/* Table Header */}
      <LinearGradient colors={['#FF9800', '#F57C00']} style={styles.rowHeader}>
        {headers.map((header, index) => (
          <Text key={`header-${index}`} style={styles.header}>
            {header}
          </Text>
        ))}
      </LinearGradient>

      {/* Table Data */}
      <FlatList
        data={displayedData}
        renderItem={renderItem}
        keyExtractor={item => `period-${item.period}-${Math.random()}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
      />

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.disabledButton,
          ]}>
          <Text style={styles.paginationButtonText}>Previous</Text>
        </TouchableOpacity>

        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>

        <TouchableOpacity
          onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.disabledButton,
          ]}>
          <Text style={styles.paginationButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Table;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: width * 0.05,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  rowHeader: {
    flexDirection: 'row',
    padding: height * 0.015,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  header: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: width * 0.04,
  },
  flatList: {
    flex: 1,
  },
  list: {
    paddingBottom: height * 0.01,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  cellText: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },
  paginationButton: {
    backgroundColor: '#FFA500',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  pageInfo: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  loadingContainer: {
    padding: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: height * 0.01,
    fontSize: width * 0.04,
  },
  emptyContainer: {
    padding: height * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#9E9E9E',
    marginTop: height * 0.01,
    fontSize: width * 0.04,
  },
});
