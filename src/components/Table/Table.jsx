import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useGetLiveWinningDetails} from '../../apiforgame/useBackendApi';

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
  console.log(tableData, 'tableData');

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const displayedData = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
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
      default:
        return 'transparent';
    }
  };

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <LinearGradient colors={['#FF9800', '#F57C00']} style={styles.rowHeader}>
        {headers.map((header, index) => (
          <Text key={index} style={styles.header}>
            {header}
          </Text>
        ))}
      </LinearGradient>

      {/* Table Data */}
      <View style={styles.scrollContainer}>
        {displayedData.map((item, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {Object.entries(item).map(([key, value], colIndex) => (
              <View
                key={colIndex}
                style={[
                  styles.cell,
                  key === 'Color'
                    ? {backgroundColor: getBackgroundColor(value)}
                    : {},
                ]}>
                {getIcon(key, value)}
                <Text style={styles.cellText}> {value}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          style={[
            styles.pageButton,
            currentPage === 0 && styles.disabledButton,
          ]}
          disabled={currentPage === 0}>
          <Icon name="chevron-left" size={16} color="white" />
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>
          {currentPage + 1} / {totalPages}
        </Text>
        <TouchableOpacity
          onPress={() =>
            setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))
          }
          style={[
            styles.pageButton,
            currentPage === totalPages - 1 && styles.disabledButton,
          ]}
          disabled={currentPage === totalPages - 1}>
          <Icon name="chevron-right" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: '100%',
    flex: 1,
    backgroundColor: 'black',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  rowHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
  header: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  cellText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  pageButton: {
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: 'orange',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Table;
