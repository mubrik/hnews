/* react nat */
import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
/* nav */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
/* comps */
import About from '../about/About';
import TopStoryScreen, { LatestStoryScreen } from './Screen';
import { TabBarIcon, HomeScreenTab } from './Tab';
import { StoryListScreenHeader, RightHeader } from './HomeHeader';
/* types */
import type { IHomeScreenProps, StoryStackParamList, IStoryListScreenProps } from '../../customTypes';

/* create stack */
const StoryStack = createNativeStackNavigator<StoryStackParamList>();

export default function Home (props:IHomeScreenProps) {

  const theme = useTheme();

  const tabScreenOpts:BottomTabNavigationOptions = useMemo(() => {
    return {
      tabBarActiveTintColor: theme.colors.primary,
      headerShown: false,
      tabBarInactiveTintColor: theme.colors.secondary,
      tabBarLabelPosition: 'beside-icon',
      size: 20
    }
  }, [theme]);

  return (
    <HomeScreenTab.Navigator screenOptions={tabScreenOpts}>
      <HomeScreenTab.Screen name="list" component={StoryNav} options={{
        tabBarIcon:(_props) => <TabBarIcon {..._props} iconName='home-circle' />,
        title: 'Home'
        }}
      />
      <HomeScreenTab.Screen name="about" component={About} options={{
        tabBarIcon:(_props) => <TabBarIcon {..._props} iconName='information-variant' />,
        title: 'About', headerRight: () => <RightHeader/>,
        headerShown: true
        }}
      />
    </HomeScreenTab.Navigator>
  );
}

function StoryNav ({ navigation }:IStoryListScreenProps) {

  return (
    <StoryStack.Navigator screenOptions={{header: StoryListScreenHeader}}>
      <StoryStack.Screen name="top" component={TopStoryScreen} options={{ title: '', animation: 'slide_from_left'}}/>
      <StoryStack.Screen name="latest" component={LatestStoryScreen} options={{ title: '', animation: 'slide_from_right'}}/>
    </StoryStack.Navigator>
  )
}