import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import crypto1 from '../assets/crypto1.png';
import crypto2 from '../assets/crypto2.png';
import crypto3 from '../assets/crypto3.png';

const images = [crypto1, crypto2, crypto3];

const {width, height} = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.9;
const IMAGE_HEIGHT = IMAGE_WIDTH * 0.6;

const SliderOfCrypto = () => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(true);

  useEffect(() => {
    let interval;
    if (isScrolling && flatListRef.current) {
      interval = setInterval(() => {
        nextSlide();
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isScrolling, currentIndex]);

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    flatListRef.current?.scrollToOffset({
      offset: nextIndex * IMAGE_WIDTH,
      animated: true,
    });
    setCurrentIndex(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    flatListRef.current?.scrollToOffset({
      offset: prevIndex * IMAGE_WIDTH,
      animated: true,
    });
    setCurrentIndex(prevIndex);
  };

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {
      useNativeDriver: false,
      listener: event => {
        const newIndex = Math.round(
          event.nativeEvent.contentOffset.x / IMAGE_WIDTH,
        );
        setCurrentIndex(newIndex);
      },
    },
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Digital <Text style={styles.title}>Assets</Text>
      </Text>

      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.imageWrapper}>
            <Image source={item} style={styles.image} />
          </View>
        )}
      />

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={prevSlide}
          style={styles.iconButton}
          accessibilityLabel="Previous Slide">
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={nextSlide}
          style={styles.iconButton}
          accessibilityLabel="Next Slide">
          <Icon name="chevron-right" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SliderOfCrypto;

const styles = StyleSheet.create({
  container: {
    height: IMAGE_HEIGHT + height * 0.1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.05,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: 'orange',
    marginBottom: height * 0.015,
  },
  title: {
    color: 'orange',
  },
  imageWrapper: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width * 0.05,
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  image: {
    width: '95%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: width * 0.05,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: height * 0.02,
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 50,
  },
});
