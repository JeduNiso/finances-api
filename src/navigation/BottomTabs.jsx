import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS }  from '../constants/colors';

import DashboardScreen from '../screens/DashboardScreen';
import SpendingScreen  from '../screens/SpendingScreen';
import ExpensesScreen  from '../screens/ExpensesScreen';
import DebtScreen      from '../screens/DebtScreen';
import FamilyScreen    from '../screens/FamilyScreen';

const Tab = createBottomTabNavigator();

const ICON_MAP = {
  Dashboard: ['home',        'home-outline'],
  Gastos:    ['wallet',      'wallet-outline'],
  Fijos:     ['calendar',    'calendar-outline'],
  Deudas:    ['card',        'card-outline'],
  Familia:   ['people',      'people-outline'],
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = ICON_MAP[route.name] ?? ['ellipse', 'ellipse-outline'];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        headerShown:             false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Gastos"    component={SpendingScreen} />
      <Tab.Screen name="Fijos"     component={ExpensesScreen} />
      <Tab.Screen name="Deudas"    component={DebtScreen} />
      <Tab.Screen name="Familia"   component={FamilyScreen} />
    </Tab.Navigator>
  );
}
