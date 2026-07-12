import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import LibraryStack from './LibraryStack';
import { DrawerSheetComponent } from './component/DrawerSheetComponent';
import { Ionicons } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

export function DrawerNavigation() {
  return (
    <Drawer.Navigator 
      initialRouteName="Home"
      drawerContent={(props) => <DrawerSheetComponent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: 250, 
        },
        drawerActiveTintColor: '#ffffff',
        drawerInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
        drawerActiveBackgroundColor: 'rgba(255, 255, 255, 0.2)',
        drawerLabelStyle: { fontSize: 16, fontWeight: '600' },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeStack} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Library" 
        component={LibraryStack} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="library-outline" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileStack} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )
        }}
      />
    </Drawer.Navigator>
  );
}
