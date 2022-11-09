import { IconButton } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
/* types */
import type { HomeTabStackParamList } from '../../customTypes';

/* cretae tab, pass in types  */
export const HomeScreenTab = createBottomTabNavigator<HomeTabStackParamList>();

interface ICustomTabIconProps {
  iconName: string;
  focused?: boolean;
  color?: string
  size?: number
}

export const TabBarIcon = ({iconName, color, size}: ICustomTabIconProps) => {

  return <IconButton icon={iconName} iconColor={color} size={size} />;
};
