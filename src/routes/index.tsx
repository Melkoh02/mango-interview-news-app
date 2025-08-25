import React from 'react';
import { NavigationContainer, type Theme as NavTheme } from '@react-navigation/native';
import RootNavigator from './RootNavigator';
import linking from './Linking';

type Props = {
  theme: NavTheme;
};

const RoutesProvider: React.FC<Props> = ({ theme }) => {
  return (
    <NavigationContainer
      linking={linking}
      theme={theme}
      documentTitle={{ enabled: false }}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};

export default RoutesProvider;
