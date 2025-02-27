import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';

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
  const size = 76;
  const radius = size / 2;

  const fullCirclePath = `
    M ${radius},${radius}
    m -${radius}, 0
    a ${radius},${radius} 0 1,0 ${size},0
    a ${radius},${radius} 0 1,0 -${size},0
    Z
  `;

  return (
    <View style={{alignItems: 'center', margin: 8}}>
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
        {/* Full circle with gradient */}
        <Path d={fullCirclePath} fill={`url(#gradient-${number})`} />
      </Svg>
    </View>
  );
};

const Number = ({setIsModalVisible}) => {
  return (
    <View style={{alignItems: 'center'}}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        {numbers.slice(0, 5).map(({value, colors}, index) => (
          <TouchableOpacity onPress={() => setIsModalVisible(true)} key={index}>
            <PieChart colors={colors} number={value} />
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 10,
        }}>
        {numbers.slice(5, 10).map(({value, colors}, index) => (
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            key={index + 5}>
            <PieChart colors={colors} number={value} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Number;
