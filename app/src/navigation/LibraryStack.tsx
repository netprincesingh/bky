import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LibraryScreen from '../screens/library/LibraryScreen';

export type LibraryStackParamList = {
  LibraryHome: undefined;

};

const Stack = createNativeStackNavigator<LibraryStackParamList>();

export default function LibraryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LibraryHome" component={LibraryScreen} />
    </Stack.Navigator>
  );
}
