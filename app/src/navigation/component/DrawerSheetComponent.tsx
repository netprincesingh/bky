import React, { useEffect, useRef } from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps, useDrawerStatus } from '@react-navigation/drawer';
import { StyleSheet, ImageBackground, Animated } from 'react-native';




export function DrawerSheetComponent(props: DrawerContentComponentProps) {


  const isDrawerOpen = useDrawerStatus() === 'open';
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isDrawerOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(-50);
      fadeAnim.setValue(0);
    }
  }, [isDrawerOpen, slideAnim, fadeAnim]);

  const animatedStyle = {
    transform: [{ translateX: slideAnim }],
    opacity: fadeAnim,
  };

  return (
    <ImageBackground 
      source={require('../../../assets/drawer_bg.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <DrawerItemList {...props} />
        </Animated.View>
      </DrawerContentScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 40, 
  },
  animatedContainer: {
    flex: 1,
  }
});