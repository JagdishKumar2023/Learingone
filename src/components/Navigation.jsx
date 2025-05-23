import React, {useState, useEffect} from 'react';
import {
  View, 
  StyleSheet, 
  Dimensions, 
  useWindowDimensions, 
  Platform,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Crypto from '../Screen/Cropto';
import Game from '../Screen/Game';
import About from '../Screen/About';
import Home from '../Screen/Home';
import WhatsappSupport from '../Screen/WhatsappSupport';
import Header from './header/Header';
import Login from '../pages/SignIn';
import SignUp from '../pages/Signup';
import SplashScreen from '../SpleshScreen/SpleshScreen';
import Onboard from '../onboard/Onboard'; // Added Onboarding screen
import UpiPayment from '../upipayment/UpiPayment';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const {width} = Dimensions.get('window');

// Enhanced animated tab icon with added effects
const AnimatedIcon = ({name, color, focused, tabName}) => {
  // Get responsive dimensions
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 375;
  const isLargeDevice = width > 768;
  const isLandscape = width > height;

  // Store size values as regular variables - don't use in animations
  const iconSize = isSmallDevice ? 24 : (isLargeDevice ? 32 : 28);
  const yOffset = isSmallDevice ? -10 : (isLargeDevice ? -18 : -15);
  
  // Use shared values for animation properties
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.7);
  const rotate = useSharedValue(focused ? '0deg' : '0deg');
  const backgroundColor = useSharedValue('transparent');
  
  // Also store device info in shared values for use in animations
  const isSmallDeviceValue = useSharedValue(isSmallDevice);
  const isLargeDeviceValue = useSharedValue(isLargeDevice);
  
  // Update shared values when dimensions change
  useEffect(() => {
    isSmallDeviceValue.value = isSmallDevice;
    isLargeDeviceValue.value = isLargeDevice;
  }, [width, height]);
  
  // Get custom colors based on tab name
  const getIconColor = () => {
    if (!focused) return '#999999';
    
    switch (tabName) {
      case 'Home':
        return '#F7931A';
      case 'Cropto':
        return '#F7931A';
      case 'game':
        return '#FF4D6D';
      case 'Support':
        return '#25D366';
      case 'Profile':
        return '#F7931A';
      default:
        return '#F7931A';
    }
  };

  React.useEffect(() => {
    // Enhanced animations for tab changes
    scale.value = withSpring(focused ? 1.4 : 1, {
      damping: 10,
      stiffness: 100,
    });
    translateY.value = withSpring(focused ? yOffset : 0, {
      damping: 8, 
      stiffness: 80,
    });
    opacity.value = withTiming(focused ? 1 : 0.7, {
      duration: 300,
    });
    
    // Add a slight rotation animation for extra flair when switching tabs
    rotate.value = withTiming(focused ? '0deg' : '0deg', {
      duration: 300,
    });
    
    // Create a subtle background effect when tab is focused
    backgroundColor.value = withTiming(
      focused ? 'rgba(255,255,255,0.05)' : 'transparent',
      { duration: 300 }
    );
  }, [focused, width, height]); // Re-run when device dimensions change

  const animatedStyle = useAnimatedStyle(() => {
    // Calculate padding directly inside the worklet
    const padding = isSmallDeviceValue.value ? 6 : (isLargeDeviceValue.value ? 10 : 8);
    
    return {
      transform: [
        {scale: scale.value}, 
        {translateY: translateY.value},
        {rotate: rotate.value}
      ],
      opacity: opacity.value,
      backgroundColor: backgroundColor.value,
      borderRadius: 30,
      padding: padding,
    };
  });

  return (
    <Animated.View style={[
      styles.iconContainer, 
      isSmallDevice && styles.iconContainerSmall,
      isLargeDevice && styles.iconContainerLarge,
      animatedStyle
    ]}>
      <Icon name={name} size={iconSize} color={getIconColor()} />
    </Animated.View>
  );
};

// Custom tab bar background with cutout effect
const TabBarBackground = () => {
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 375;
  const isLargeDevice = width > 768;
  
  return (
    <View style={[
      styles.tabBarBackgroundContainer,
      isSmallDevice && styles.tabBarBackgroundContainerSmall,
      isLargeDevice && styles.tabBarBackgroundContainerLarge,
    ]}>
      <LinearGradient
        colors={['#1E1E1E', '#121212']}
        style={styles.tabBarGradient}
      />
    </View>
  );
};

function TabNavigator() {
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 375;
  const isLargeDevice = width > 768;
  const isLandscape = width > height;
  const [orientation, setOrientation] = useState(isLandscape ? 'landscape' : 'portrait');
  
  // Update orientation when screen size changes
  useEffect(() => {
    setOrientation(width > height ? 'landscape' : 'portrait');
  }, [width, height]);
  
  // Calculate responsive sizes
  const getTabBarHeight = () => {
    if (isSmallDevice) return 65;
    if (isLargeDevice) return 85;
    if (isLandscape) return 70;
    return 75; // Default
  };
  
  // Calculate font styling based on device size
  const getTabLabelStyle = (isActive) => {
    return {
      fontSize: isSmallDevice ? 10 : isLargeDevice ? 14 : 12,
      fontWeight: isActive ? '800' : 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      textShadowColor: isActive ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header balance="5000" />
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, focused}) => {
            let iconName;
            // Don't set icon for Profile since we override it specifically
            if (route.name === 'Profile') {
              return null;
            }
            
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
              case 'Support':
                iconName = 'whatsapp';
                break;
              default:
                iconName = 'circle';
            }
            return (
              <AnimatedIcon 
                name={iconName} 
                color={color} 
                focused={focused} 
                tabName={route.name}
              />
            );
          },
          // Base tab bar colors - individual tabs override their own
          tabBarActiveTintColor: '#F7931A',
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: [
            styles.tabBar, 
            { height: getTabBarHeight() },
            isSmallDevice && styles.tabBarSmall,
            isLargeDevice && styles.tabBarLarge,
            isLandscape && styles.tabBarLandscape
          ],
          tabBarLabelStyle: getTabLabelStyle(route.name === 'Home' || route.name === 'Cropto' || route.name === 'game' || route.name === 'Support'),
          tabBarBackground: () => <TabBarBackground />,
          headerShown: false,
          tabBarShowLabel: !isSmallDevice || isLandscape, // Hide labels on small devices in portrait
          tabBarItemStyle: [
            styles.tabBarItem,
            isSmallDevice && styles.tabBarItemSmall,
            isLargeDevice && styles.tabBarItemLarge
          ],
        })}
        sceneContainerStyle={{ 
          backgroundColor: 'transparent' 
        }}>
        <Tab.Screen 
          name="Home" 
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarLabelStyle: getTabLabelStyle(true),
          }}
        />
        <Tab.Screen 
          name="Cropto" 
          component={Crypto} 
          options={{
            tabBarLabel: 'Crypto',
            tabBarLabelStyle: getTabLabelStyle(true),
          }}
        />
        <Tab.Screen 
          name="game" 
          component={Game}
          options={{
            tabBarLabel: 'Invest now',
            tabBarActiveTintColor: '#FF4D6D',
            tabBarLabelStyle: getTabLabelStyle(true),
          }}
        />
        <Tab.Screen 
          name="Support" 
          component={WhatsappSupport}
          options={{
            tabBarActiveTintColor: '#25D366',
            tabBarLabel: 'Support',
            tabBarLabelStyle: getTabLabelStyle(true),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={About}
          options={{
            tabBarLabel: 'Profile',
            tabBarActiveTintColor: '#F7931A',
            tabBarLabelStyle: getTabLabelStyle(true),
            tabBarIcon: ({focused}) => (
              <AnimatedIcon 
                name="account" 
                focused={focused} 
                tabName="Profile"
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
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
  },
  tabBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: Platform.OS === 'android' ? 15 : 0,
    height: 75,
    position: 'absolute',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? -1 : -3,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.3,
    shadowRadius: Platform.OS === 'ios' ? 3 : 8,
    ...Platform.select({
      ios: {
        zIndex: 0,
      },
    }),
  },
  tabBarSmall: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 10,
    height: 65,
  },
  tabBarLarge: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 20,
    height: 85,
  },
  tabBarLandscape: {
    height: 70,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
  },
  tabBarLabelSmall: {
    fontSize: 10,
    marginBottom: 3,
    marginTop: 3,
  },
  tabBarLabelLarge: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 6,
    fontWeight: '800',
  },
  tabBarBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  tabBarBackgroundContainerSmall: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tabBarBackgroundContainerLarge: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  tabBarGradient: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  tabBarItem: {
    height: 60,
    padding: 5,
    marginVertical: 5,
  },
  tabBarItemSmall: {
    height: 50,
    padding: 3,
    marginVertical: 3,
  },
  tabBarItemLarge: {
    height: 70,
    padding: 6,
    marginVertical: 6,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  iconContainerSmall: {
    width: 50,
    height: 50,
  },
  iconContainerLarge: {
    width: 70,
    height: 70,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 30,
    height: 4,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default MyTabs;
