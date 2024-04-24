import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigator from './screens/StackNavigator';
import { UserContext } from './UserContext';

export default function App() {
  return (
    <>
    <UserContext>
      <StatusBar style="auto" />
      <StackNavigator />
    </UserContext>
   
  </>
  );
};
