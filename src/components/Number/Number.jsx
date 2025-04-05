import React from 'react';
import {TouchableOpacity, View, Dimensions, FlatList} from 'react-native';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';

const {width} = Dimensions.get('window');
const size = width * 0.15;
const radius = size / 1;

const numbers = [
  {value: 1, colors: ['purple', '#DE3163']},
  {value: 2, colors: ['green']},
  {value: 3, colors: ['#DE3163']},
  {value: 4, colors: ['green']},
  {value: 5, colors: ['#DE3163']},
  {value: 6, colors: ['purple', 'green']},
  {value: 7, colors: ['#DE3163']},
  {value: 8, colors: ['green']},
  {value: 9, colors: ['#DE3163']},
  {value: 10, colors: ['green']},
];

const PieChart = ({colors, number}) => {
  const fullSqurePath = `
    M ${radius},${radius}
    m -${radius}, 0
    a ${radius},${radius} 0 1,0 ${size},0
    a ${radius},${radius} 0 1,0 -${size},0
    Z
  `;

  return (
    <View style={{margin: width * 0.02}}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient
            id={`gradient-${number}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%">
            {colors.map((color, index) => (
              <Stop
                key={index}
                offset={`${(index / (colors.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </LinearGradient>
        </Defs>
        <Path d={fullSqurePath} fill={`url(#gradient-${number})`} />
      </Svg>
    </View>
  );
};

const Number = ({setIsModalVisible}) => {
  return (
    <View style={{alignItems: 'center'}}>
      <FlatList
        data={numbers}
        numColumns={5}
        keyExtractor={item => item.value.toString()}
        contentContainerStyle={{alignItems: 'center'}}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <PieChart colors={item.colors} number={item.value} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Number;
