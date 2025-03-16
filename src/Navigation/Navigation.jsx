import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyTabs from '../components/Navigation';
import MyOrder from '../components/profilesection/profilepages/MyOrder';
import Transactions from '../components/profilesection/profilepages/Transactions';
import Ekyc from '../components/profilesection/profilepages/Ekyc';
import Support from '../components/profilesection/profilepages/Support';
import About from '../components/profilesection/profilepages/About';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MyTab"
        screenOptions={{headerShown: false}} // Removes all headers and back buttons
      >
        <Stack.Screen name="MyTab" component={MyTabs} />
        <Stack.Screen name="My Order" component={MyOrder} />
        <Stack.Screen name="Transaction Details" component={Transactions} />
        <Stack.Screen name="eKYC" component={Ekyc} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="About" component={About} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;
