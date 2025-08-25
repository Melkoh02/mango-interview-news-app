import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes, type RootStackParamList } from '../lib/types/navigation';
import NewsScreen from '../pages/NewsScreen';
import NewsDetailScreen from '../pages/NewsDetailScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.News}
      screenOptions={{
        headerTitleAlign: 'center',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name={Routes.News}
        component={NewsScreen}
        options={{ title: 'Mango News' }}
      />
      <Stack.Screen
        name={Routes.NewsDetail}
        component={NewsDetailScreen}
        options={{ title: 'Article' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
