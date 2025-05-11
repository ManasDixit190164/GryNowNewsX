import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from './types';
import NewsScreen from '../features/news/screens/NewsScreen';
import BookmarksScreen from '../features/bookmarks/screens/BookmarksScreen';
import ArticleDetailScreen from '../features/news/screens/ArticleDetailScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../theme/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.headerBackground,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTintColor: theme.headerText,
      }}
    >
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="article" size={size} color={color} />
          ),
          headerRight: () => <ThemeToggle />,
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bookmark" size={size} color={color} />
          ),
          headerRight: () => <ThemeToggle />,
        }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.card,
          text: theme.text,
          border: theme.border,
          notification: theme.primary,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
          },
          medium: {
            fontFamily: 'System',
          },
          light: {
            fontFamily: 'System',
          },
          thin: {
            fontFamily: 'System',
          },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={MainTabs}
          options={{ 
            headerShown: false,
            title: 'Home'
          }}
        />
        <Stack.Screen
          name="ArticleDetail"
          component={ArticleDetailScreen}
          options={{ 
            title: 'Article',
            headerRight: () => <ThemeToggle />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation; 