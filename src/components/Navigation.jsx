import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Cryto from '../Screen/Cropto';
import Game from '../Screen/Game';
import About from '../Screen/About';
import Home from './Home';

const Tab = createBottomTabNavigator();

const AnimatedIcon = ({name, color, focused}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.2); // Slight zoom effect
      translateY.value = withSpring(-5); // Move icon up slightly
    } else {
      scale.value = withSpring(1);
      translateY.value = withSpring(0);
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}, {translateY: translateY.value}],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon name={name} size={30} color={color} />
    </Animated.View>
  );
};

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, focused}) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'cropto':
              iconName = 'bitcoin';
              break;
            case 'game':
              iconName = 'gamepad-variant';
              break;
            case 'about':
              iconName = 'information';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <AnimatedIcon name={iconName} color={color} focused={focused} />
          );
        },
        tabBarActiveTintColor: '#F7931A',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#1c1c1c',
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="cropto" component={Cryto} />
      <Tab.Screen name="game" component={Game} />
      <Tab.Screen name="about" component={About} />
    </Tab.Navigator>
  );
}

export default MyTabs;
