import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Crypto from '../Screen/Cropto';
import Game from '../Screen/Game';
import About from '../Screen/About';
import Home from './Home';
import Header from './header/Header';

const Tab = createBottomTabNavigator();

// ✅ Animated Tab Icons
const AnimatedIcon = ({name, color, focused}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.3 : 1);
    translateY.value = withSpring(focused ? -8 : 0);
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}, {translateY: translateY.value}],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon name={name} size={28} color={color} />
    </Animated.View>
  );
};

// ✅ Main Tab Navigator with Header
function MyTabs() {
  return (
    <View style={styles.container}>
      <Header balance="5000" />
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
                iconName = 'account';
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
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
        })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="cropto" component={Crypto} />
        <Tab.Screen name="game" component={Game} />
        <Tab.Screen name="about" component={About} />
      </Tab.Navigator>
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    height: 100,
    backgroundColor: '#1c1c1c',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logo: {
    width: 45,
    height: 45,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7931A',
  },
  tabBar: {
    backgroundColor: '#1c1c1c',
    borderTopWidth: 1,
    borderTopColor: '#333',
    height: 70,
    paddingBottom: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
});

export default MyTabs;
