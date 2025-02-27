import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
} from 'react-native';

import crypto1 from '../assets/crypto1.png';
import crypto2 from '../assets/crypto2.png';
import crypto3 from '../assets/crypto3.png';

const images = [crypto1, crypto2, crypto3];

// Get screen width & height
const {width, height} = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.9; // 90% of screen width
const IMAGE_HEIGHT = IMAGE_WIDTH * 0.6; // Maintain aspect ratio

const SilderOfCrypto = () => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [isScrolling, setIsScrolling] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (isScrolling) {
      interval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % images.length;
          flatListRef.current?.scrollToOffset({
            offset: nextIndex * IMAGE_WIDTH,
            animated: true,
          });
          return nextIndex;
        });
      }, 1800); // Auto-scroll every 3 seconds
    }

    return () => clearInterval(interval);
  }, [isScrolling]);

  const handleTouchStart = () => setIsScrolling(false);
  const handleTouchEnd = () => setTimeout(() => setIsScrolling(true), 2500);

  const handleScroll = event => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / IMAGE_WIDTH,
    );
    setCurrentIndex(newIndex);
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handleTouchStart}
      onPressOut={handleTouchEnd}>
      <View style={styles.container}>
        {/* Heading */}
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
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.imageWrapper}>
              <Image source={item} style={styles.image} />
            </View>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SilderOfCrypto;

const styles = StyleSheet.create({
  container: {
    height: IMAGE_HEIGHT + height * 0.1, // Adjust dynamically
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: height * 0.015,
  },
  title: {
    color: 'cyan',
  },
  imageWrapper: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5, // Android shadow
    borderRadius: width * 0.05, // Dynamic border radius
    overflow: 'hidden',
  },
  image: {
    width: '95%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: width * 0.05,
  },
});
