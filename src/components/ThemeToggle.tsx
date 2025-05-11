import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = memo(() => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
      <Icon
        name={isDark ? 'light-mode' : 'dark-mode'}
        size={24}
        color={isDark ? '#FFFFFF' : '#000000'}
      />
    </TouchableOpacity>
  );
});

ThemeToggle.displayName = 'ThemeToggle'; 