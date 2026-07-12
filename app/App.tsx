import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigation } from './src/navigation/MainNavigation';
import { Provider } from 'react-redux';
import { store, loadTokens } from './src/redux/store';

export default function App() {
  useEffect(() => {
    loadTokens();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </Provider>
  );
}
