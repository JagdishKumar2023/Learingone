import React, {useState} from 'react';
import {TouchableOpacity, View, Dimensions, FlatList} from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import {useGetNumberDetails} from '../../apiforgame/useBackendApi';

const {width} = Dimensions.get('window');
const size = width * 0.14;
const radius = size / 1;

const numbers = [
  {value: 0, colors: ['purple', '#DE3163']},
  {value: 1, colors: ['green']},
  {value: 2, colors: ['#DE3163']},
  {value: 3, colors: ['green']},
  {value: 4, colors: ['#DE3163']},
  {value: 5, colors: ['purple', 'green']},
  {value: 6, colors: ['#DE3163']},
  {value: 7, colors: ['green']},
  {value: 8, colors: ['#DE3163']},
  {value: 9, colors: ['green']},
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
    <View
      style={{
        margin: width * 0.02,
        borderRadius: 8, // Added borderRadius here for the number circle
        overflow: 'hidden', // Ensures the border radius is respected within the Svg
      }}>
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

        <SvgText
          x={size / 2}
          y={size / 2 + 6}
          fontSize={18}
          fill="#fff"
          fontWeight="bold"
          textAnchor="middle">
          {number}
        </SvgText>
      </Svg>
    </View>
  );
};

const Number = ({setIsModalVisible}) => {
  const [numberDetails, setNumberDetails] = useState([]);
  const {data: number, error: isNumberError} = useGetNumberDetails();
  console.log('numbernumber', number?.data);

  return (
    <View style={{alignItems: 'center'}}>
      <FlatList
        data={numbers}
        numColumns={5}
        keyExtractor={item => item.value.toString()}
        contentContainerStyle={{alignItems: 'center'}}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => setIsModalVisible(number?.data[item.value])}>
            <PieChart
              colors={item.colors}
              number={number?.data[item.value]?.content}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Number;
