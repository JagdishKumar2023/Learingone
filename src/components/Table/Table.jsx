import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const Table = () => {
  const headers = ['ID', 'Name', 'Age', 'Country'];
  const data = [
    {id: 1, name: 'John', age: 25, country: 'USA'},
    {id: 2, name: 'Alice', age: 30, country: 'UK'},
    {id: 3, name: 'Bob', age: 28, country: 'Canada'},
    {id: 4, name: 'Emma', age: 22, country: 'Australia'},
    {id: 5, name: 'Liam', age: 26, country: 'Germany'},
    {id: 6, name: 'Olivia', age: 27, country: 'France'},
    {id: 7, name: 'Noah', age: 24, country: 'India'},
    {id: 8, name: 'Sophia', age: 29, country: 'Brazil'},
    {id: 9, name: 'William', age: 31, country: 'Italy'},
    {id: 10, name: 'James', age: 34, country: 'Spain'},
    {id: 11, name: 'Emily', age: 23, country: 'Japan'},
    {id: 12, name: 'Michael', age: 32, country: 'Russia'},
  ];

  const colors = ['#F44336', '#F44336', '#F44336', '#F44336'];
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const displayedData = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={styles.rowHeader}>
        {headers.map((header, index) => (
          <Text key={index} style={styles.header}>
            {header}
          </Text>
        ))}
      </View>

      {/* Scrollable Table Data */}
      <View style={styles.scrollContainer}>
        {displayedData.map((item, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {Object.values(item).map((value, colIndex) => (
              <Text
                key={colIndex}
                style={[
                  styles.cell,
                  {backgroundColor: colors[colIndex % colors.length]},
                ]}>
                {value}
              </Text>
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
          <Text style={styles.pageText}>{'<'}</Text>
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
          <Text style={styles.pageText}>{'>'}</Text>
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
    // height: 348,
    backgroundColor: 'black',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  rowHeader: {
    flexDirection: 'row',
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
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
    textAlign: 'center',
    paddingVertical: 12,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    borderRadius: 8,
    margin: 4,
  },
  scrollContainer: {
    // maxHeight: 500,
  },
  paginationContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5, // Reduced padding
    height: 40, // Set a fixed height to minimize unnecessary space
  },

  pageButton: {
    padding: 10,
    marginHorizontal: 20,
    backgroundColor: 'orange',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  pageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Table;
