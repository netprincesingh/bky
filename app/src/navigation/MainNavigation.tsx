import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DrawerNavigation } from './DrawerNavigation';
import AuthStack from './AuthStack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Stack = createNativeStackNavigator();

export function MainNavigation() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="DrawerRoot" component={DrawerNavigation} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}


