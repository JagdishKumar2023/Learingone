import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import card1 from '../../assets/card1.png';
import card2 from '../../assets/card2.png';
import card3 from '../../assets/card3.png';
import card4 from '../../assets/card4.png';

const images = [card1, card2, card3, card4];
const infiniteImages = [...images, ...images, ...images];
const imageWidth = 380;

const Card = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(images.length);
  const autoSlideRef = useRef(null);

  // Auto-slide function
  const startAutoSlide = () => {
    autoSlideRef.current = setInterval(() => {
      moveToNext();
    }, 3000);
  };

  const moveToNext = () => {
    if (flatListRef.current) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      flatListRef.current.scrollToOffset({
        offset: (currentIndex + 1) * imageWidth,
        animated: true,
      });
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(autoSlideRef.current);
  }, []);

  useEffect(() => {
    if (currentIndex === infiniteImages.length - images.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: images.length * imageWidth,
          animated: false,
        });
        setCurrentIndex(images.length);
      }, 300);
    }
  }, [currentIndex]);

  const handleTouchStart = () => clearInterval(autoSlideRef.current);
  const handleTouchEnd = () => startAutoSlide();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        <Icon name="account-plus" size={30} color="#FFD700" />{' '}
        <Text style={styles.highlight}>Create</Text> an{' '}
        <Text style={styles.highlight}>Account</Text>{' '}
        <Icon name="shield-check" size={30} color="#FFD700" />
      </Text>
      <View style={styles.sliderContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
            flatListRef.current?.scrollToOffset({
              offset: (currentIndex - 1) * imageWidth,
              animated: true,
            });
          }}>
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.flatListWrapper}>
          <FlatList
            ref={flatListRef}
            data={infiniteImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <Image source={item} style={styles.image} />
            )}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMomentumScrollEnd={event => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / imageWidth,
              );
              setCurrentIndex(newIndex);
            }}
            initialScrollIndex={images.length}
            getItemLayout={(data, index) => ({
              length: imageWidth,
              offset: imageWidth * index,
              index,
            })}
          />
        </View>

        <TouchableOpacity style={styles.navButton} onPress={moveToNext}>
          <Icon name="chevron-right" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '1E1E1E',
    alignItems: 'center',
    paddingTop: 20,
    marginTop: 20,
    borderRadius: 20,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  highlight: {
    color: '#4CC9FE',
    fontWeight: 'bold',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  flatListWrapper: {
    width: imageWidth,
    overflow: 'hidden',
    borderRadius: 20,
  },
  image: {
    width: imageWidth,
    height: 420,
    resizeMode: 'contain',
    borderRadius: 20,
  },
});
