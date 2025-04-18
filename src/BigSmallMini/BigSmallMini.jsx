import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import BottomSheet from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useGetSizeDetails} from '../apiforgame/useBackendApi';

const {width} = Dimensions.get('window');
const CIRCLE_RADIUS = width * 0.11;

const BigSmallMini = ({setIsModalVisible, sizesHandlePost, setMetaData}) => {
  const {data: sizes, isLoading} = useGetSizeDetails();
  const [selectedId, setSelectedId] = useState(null);
  const bottomSheetRef = useRef(null);
  const [pausedStates, setPausedStates] = useState({});

  const handlePress = item => {
    setSelectedId(item.id);
    setIsModalVisible(true);
    setPausedStates(prev => ({...prev, [item.id]: true}));
    bottomSheetRef.current?.expand();
    const betDetails = {
      betType: 'Size',
      betTypeCode: item?.id,
    };
    setMetaData(betDetails);
  };

  const handleSheetChanges = useCallback(
    index => {
      if (index === -1) {
        setSelectedId(null);
        const reset = {};
        sizes?.data?.forEach((_, index) => {
          reset[index + 1] = false;
        });
        setPausedStates(reset);
      }
    },
    [sizes],
  );

  const sortOrder = ['Big', 'Mini', 'Small'];

  const formattedSizes =
    sizes?.data
      ?.map((item, index) => ({
        id: item._id,
        label: item.sizeType.charAt(0).toUpperCase() + item.sizeType.slice(1),
        multiplier: item.multiplier,
        color: item.color,
        raw: item,
      }))
      .sort(
        (a, b) => sortOrder.indexOf(a.label) - sortOrder.indexOf(b.label),
      ) || [];

  const selectedItem = formattedSizes.find(item => item.id === selectedId);

  const renderItem = ({item}) => {
    let strokeColor = '#27ae60';
    if (item.label === 'Big') strokeColor = '#DE3163';
    else if (item.label === 'Mini') strokeColor = '#FFB200';
    else if (item.label === 'Small') strokeColor = '#06D001';
    else strokeColor = item.color;

    return (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        activeOpacity={0.7}
        style={styles.circleWrapper}>
        <View style={styles.progressContainer}>
          <CircularProgress
            value={100}
            radius={CIRCLE_RADIUS}
            activeStrokeColor={strokeColor}
            inActiveStrokeColor={'#9b59b6'}
            inActiveStrokeOpacity={0.5}
            inActiveStrokeWidth={CIRCLE_RADIUS * 0.36}
            activeStrokeWidth={CIRCLE_RADIUS * 0.27}
            duration={100000}
            showProgressValue={false}
            pause={pausedStates[item.id]}
          />
        </View>
        <Text style={[styles.labelText, {color: strokeColor}]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6c5ce7" />
        ) : (
          <FlatList
            data={formattedSizes}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            contentContainerStyle={styles.flatListContent}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{width: 16}} />}
          />
        )}
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['45%']}
        onChange={handleSheetChanges}
        enablePanDownToClose>
        <View style={styles.contentContainer}>
          {selectedItem && (
            <>
              <Text style={styles.modalText}>Size: {selectedItem.label}</Text>
              <Text style={styles.modalText}>
                Multiplier: {selectedItem.multiplier}x
              </Text>
              <Text style={styles.modalText}>Color: {selectedItem.color}</Text>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current?.close()}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
  },
  circleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2 + 30,
    marginHorizontal: 8,
  },
  labelText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 34,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BigSmallMini;
