import React, {useState, useRef, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import BottomSheet from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const progressData = [
  {id: 1, activeStrokeColor: '#06D001'},
  {id: 2, activeStrokeColor: '#FF6600'},
  {id: 3, activeStrokeColor: '#DE3163'},
];

const BigSmallMini = ({setIsModalVisible}) => {
  const [selectedId, setSelectedId] = useState(null);
  const bottomSheetRef = useRef(null);

  const handlePress = id => {
    setSelectedId(id);
    bottomSheetRef.current?.expand();
  };

  const handleSheetChanges = useCallback(index => {
    if (index === -1) {
      setSelectedId(null);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        {progressData.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              handlePress(item.id);
              setIsModalVisible(true);
            }}>
            <CircularProgress
              value={100}
              radius={55}
              activeStrokeColor={item.activeStrokeColor}
              inActiveStrokeColor={'#9b59b6'}
              inActiveStrokeOpacity={0.5}
              inActiveStrokeWidth={20}
              activeStrokeWidth={15}
              duration={20000}
              showProgressValue={false} // Removed percentage display
            />
          </TouchableOpacity>
        ))}
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Start closed
        snapPoints={['50%']}
        onChange={handleSheetChanges}
        enablePanDownToClose>
        <View style={styles.contentContainer}>
          {selectedId !== null && (
            <>
              <Text style={styles.modalText}>
                Details for Item {selectedId}
              </Text>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current?.close()}
                style={styles.closeButton}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 18,
    justifyContent: 'space-around',
    marginTop: 50,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
});

export default BigSmallMini;
