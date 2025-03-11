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
    title: 'Beginner (6 to 1 year)',
    icon: 'account',
    color: '#4CC9FE',
  },
  {
    image: pot2,
    title: 'Intermediate (6-12 Months)',
    icon: 'trending-up',
    color: '#00FF00',
  },
  {
    image: pot3,
    title: 'Advanced (1-3 Years)',
    icon: 'chart-line',
    color: '#FF4500',
  },
  {image: pot4, title: 'Expert (3-5 Years)', icon: 'trophy', color: '#FFA500'},
];

const Portfolio = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Road Map of <Text style={styles.highlight}>Professional Traders</Text>
      </Text>

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
});
