import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import AuthNavigator from './AuthNavigator';
import BottomTabs    from './BottomTabs';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main"  component={BottomTabs} />
        ) : (
          <Stack.Screen name="Auth"  component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
