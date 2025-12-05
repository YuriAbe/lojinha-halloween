import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './context/CartContext';
import ProductListScreen from './screens/ProductListScreen';
import CartScreen from './screens/CartScreen';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🎃</Text>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Products" component={ProductListScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingEmoji: {
    fontSize: 50,
    marginBottom: 20,
  },
});
