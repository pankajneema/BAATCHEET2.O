import React from 'react';
import { View, Text ,StyleSheet,Colors} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import FriendsScreen from './FriendsScreen';
import ChatScreen from './ChatScreen';
import ChatMessagesScreen from './ChatMessagesScreen';
import ProfileScreen from './ProfileScreen';
import {useColorScheme} from 'react-native';


const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
    const colorScheme = useColorScheme();
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen}  options={{headerShown: false}}/>
          <Stack.Screen name="Chats" component={ChatScreen}  options={{ headerShown: true, headerStyle: { backgroundColor: '#4A55A2', }, headerTintColor: 'white', headerTitleStyle: { fontWeight: 'bold', }, }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: true}} />
          <Stack.Screen name="Friends" component={FriendsScreen} options={{ headerShown: true, headerStyle: { backgroundColor: '#4A55A2', }, headerTintColor: 'white', headerTitleStyle: { fontWeight: 'bold', }, }} />
          <Stack.Screen name="Messages" component={ChatMessagesScreen} options={{ headerShown: true, headerStyle: { backgroundColor: '#4A55A2', }, headerTintColor: 'white', headerTitleStyle: { fontWeight: 'bold', }, }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Your  Profile', headerShown: true, headerStyle: { backgroundColor: '#4A55A2', }, headerTintColor: 'white', }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
};

export default StackNavigator;

const styles =  StyleSheet.create({})

