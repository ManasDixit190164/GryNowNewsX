import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import { NewsArticle } from '../../../services/newsApi';
import { bookmarkService } from '../../../services/bookmarkService';
import { lightTheme } from '../../../theme/colors';
import { useFocusEffect } from '@react-navigation/native';

interface ArticleCardProps {
  article: NewsArticle;
  onPress: (article: NewsArticle) => void;
  theme?: typeof lightTheme;
  onBookmarkPress?: () => void;
}

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400';

const ArticleCard: React.FC<ArticleCardProps> = memo(({
  article,
  onPress,
  theme = lightTheme,
  onBookmarkPress
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const bookmarkScale = useSharedValue(1);

  const checkBookmarkStatus = useCallback(async () => {
    try {
      const bookmarked = await bookmarkService.isBookmarked(article.url);
      setIsBookmarked(bookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  }, [article.url]);

  useEffect(() => {
    setIsBookmarking(false);
    checkBookmarkStatus();
    
    return () => {
      setIsBookmarking(false);
    };
  }, [article.url, checkBookmarkStatus]);

  useFocusEffect(
    useCallback(() => {
      setIsBookmarking(false);
      checkBookmarkStatus();
      
      return () => {
        setIsBookmarking(false);
      };
    }, [checkBookmarkStatus])
  );

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const bookmarkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bookmarkScale.value }],
    };
  });

  const handlePressIn = () => {
    if (!isBookmarking) {
      scale.value = withSpring(0.98);
    }
  };

  const handlePressOut = () => {
    if (!isBookmarking) {
      scale.value = withSpring(1);
    }
  };

  const toggleBookmark = useCallback(async () => {
    if (isBookmarking) return;
    
    try {
      setIsBookmarking(true);
      bookmarkScale.value = withSequence(
        withSpring(1.2),
        withSpring(1)
      );

      if (isBookmarked) {
        await bookmarkService.removeBookmark(article.url);
        onBookmarkPress?.();
      } else {
        await bookmarkService.addBookmark(article);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsBookmarking(false);
    }
  }, [bookmarkScale, isBookmarked, article, onBookmarkPress, isBookmarking]);

  const handlePress = useCallback(() => {
    if (!isBookmarking) {
      onPress(article);
    }
  }, [onPress, article, isBookmarking]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const imageSource = !imageError && article.urlToImage
    ? { uri: article.urlToImage, priority: FastImage.priority.normal }
    : { uri: PLACEHOLDER_IMAGE, priority: FastImage.priority.low };

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.cardBackground }, animatedStyle]}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={isBookmarking}
      >
        <FastImage
          source={imageSource}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
          onError={handleImageError}
        />
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
            {article.description}
          </Text>
          <View style={styles.footer}>
            <Text style={[styles.source, { color: theme.textTertiary }]}>{article.source.name}</Text>
            <TouchableOpacity 
              onPress={toggleBookmark}
              disabled={isBookmarking}
            >
              <Animated.View style={bookmarkAnimatedStyle}>
                <Icon
                  name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                  size={24}
                  color={isBookmarked ? theme.primary : theme.textSecondary}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 12,
  },
});

ArticleCard.displayName = 'ArticleCard';

export default ArticleCard; 