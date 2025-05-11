import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { RouteProp } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { RootStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../context/ThemeContext';

type ArticleDetailScreenRouteProp = RouteProp<RootStackParamList, 'ArticleDetail'>;

interface Props {
  route: ArticleDetailScreenRouteProp;
}

const ArticleDetailScreen: React.FC<Props> = ({ route }) => {
  const { article } = route.params;
  const { isDark } = useTheme();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  React.useEffect(() => {
    opacity.value = withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(100, withTiming(1, { duration: 500 }))
    );
    scale.value = withSequence(
      withTiming(0.95, { duration: 0 }),
      withDelay(100, withTiming(1, { duration: 500 }))
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Animated.View style={[styles.webviewContainer, animatedStyle]}>
        <WebView
          source={{ uri: article.url }}
          style={styles.webview}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default ArticleDetailScreen; 