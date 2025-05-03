import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Crypto from '../Screen/Cropto';
import Game from '../Screen/Game';
import About from '../Screen/About';
import Home from '../Screen/Home';
import Header from './header/Header';
import Login from '../pages/SignIn';
import SignUp from '../pages/Signup';
import SplashScreen from '../SpleshScreen/SpleshScreen';
import Onboard from '../onboard/Onboard'; // Added Onboarding screen
import UpiPayment from '../upipayment/UpiPayment';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AnimatedIcon = ({name, color, focused}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
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

function TabNavigator() {
  return (
    <View style={styles.container}>
      <Header balance="5000" />
      <Tab.Navigator
        screenOptions={({route}) => ({
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color, focused}) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Cropto':
                iconName = 'bitcoin';
                break;
              case 'game':
                iconName = 'gamepad-variant';
                break;
              case 'Profile':
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
        <Tab.Screen name="Cropto" component={Crypto} />
        <Tab.Screen name="game" component={Game} />
        <Tab.Screen name="Profile" component={About} />
      </Tab.Navigator>
    </View>
  );
}

function MyTabs() {
  const [isFirstTime, setIsFirstTime] = useState(null);

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      const firstTime = await AsyncStorage.getItem('isFirstTime');
      console.log('isFirstTime value:', firstTime);
      setIsFirstTime(firstTime !== 'false'); // Show onboard if 'isFirstTime' is null
    } catch (error) {
      console.error('Error reading AsyncStorage:', error);
    }
  };

  if (isFirstTime === null) {
    return null; // Avoid flickering — add a loading spinner if needed
  }

  return (
    <Stack.Navigator
      initialRouteName={isFirstTime ? 'Onboarding' : 'SplashScreen'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Onboarding" component={Onboard} />
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="UpiPayment" component={UpiPayment} />
      <Stack.Screen name="Deposit" component={UpiPayment} />
      <Stack.Screen name="Withdraw" component={UpiPayment} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    height: 70,
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
