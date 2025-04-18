import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import pot1 from '../../assets/pot1.png';
import pot2 from '../../assets/pot2.png';
import pot3 from '../../assets/pot3.png';
import pot4 from '../../assets/pot4.png';

const {width, height} = Dimensions.get('window');

const roadmapSteps = [
  {
    image: pot1,
    icon: 'account',
    color: '#4CC9FE',
    title: 'Beginner',
  },
  {
    image: pot2,
    icon: 'trending-up',
    color: '#00FF00',
    title: 'Learning',
  },
  {
    image: pot3,
    icon: 'chart-line',
    color: '#FF4500',
    title: 'Practicing',
  },
  {
    image: pot4,
    icon: 'trophy',
    color: '#FFA500',
    title: 'Pro Trader',
  },
];

const Portfolio = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = index => {
    if (flatListRef.current && index >= 0 && index < roadmapSteps.length) {
      flatListRef.current.scrollToIndex({animated: true, index});
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Road Map of <Text style={styles.highlight}>Professional Traders</Text>
      </Text>

      {/* FlatList */}
      <FlatList
        ref={flatListRef}
        data={roadmapSteps}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({item}) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.overlay}>
              <Icon name={item.icon} size={60} color={item.color} />
              <Text style={styles.slideText}>{item.title}</Text>
            </View>
          </View>
        )}
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Arrow Buttons */}
      <View style={styles.arrowContainer}>
        <TouchableOpacity
          onPress={() => scrollToIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          style={[
            styles.arrowButton,
            currentIndex === 0 && styles.disabledArrow,
          ]}>
          <Icon name="chevron-left" size={30} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => scrollToIndex(currentIndex + 1)}
          disabled={currentIndex === roadmapSteps.length - 1}
          style={[
            styles.arrowButton,
            currentIndex === roadmapSteps.length - 1 && styles.disabledArrow,
          ]}>
          <Icon name="chevron-right" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {roadmapSteps.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

export default Portfolio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: height * 0.07,
    borderRadius: 20,
  },
  heading: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: 'orange',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  highlight: {
    color: '#4CC9FE',
  },
  slide: {
    width,
    height: height * 0.6,
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '105%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideText: {
    color: '#FFF',
    fontSize: width * 0.05,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#888',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'orange',
    width: 12,
    height: 12,
  },
  arrowContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '40%',
  },
  arrowButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 30,
  },
  disabledArrow: {
    opacity: 0.3,
  },
});
