import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { RootStackParamList } from '../../../navigation/types';
import { NewsArticle } from '../../../services/newsApi';
import { bookmarkService } from '../../../services/bookmarkService';
import ArticleCard from '../../news/components/ArticleCard';
import { lightTheme, darkTheme } from '../../../theme/colors';
import { useTheme } from '../../../context/ThemeContext';

type BookmarksScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BookmarksScreen = () => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const navigation = useNavigation<BookmarksScreenNavigationProp>();

  const [bookmarks, setBookmarks] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingBookmark, setRemovingBookmark] = useState<string | null>(null);

  const emptyOpacity = useSharedValue(0);
  const emptyScale = useSharedValue(0.8);

  const emptyAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: emptyOpacity.value,
      transform: [{ scale: emptyScale.value }],
    };
  });

  const loadBookmarks = useCallback(async () => {
    try {
      const savedBookmarks = await bookmarkService.getBookmarks();
      setBookmarks(savedBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
      emptyOpacity.value = withTiming(1, { duration: 500 });
      emptyScale.value = withSpring(1, { damping: 12 });
    }, [loadBookmarks, emptyOpacity, emptyScale])
  );

  const handleArticlePress = useCallback((article: NewsArticle) => {
    navigation.navigate('ArticleDetail', { article });
  }, [navigation]);

  const handleBookmarkRemoval = useCallback(async (article: NewsArticle) => {
    setRemovingBookmark(article.url);
    try {
      await bookmarkService.removeBookmark(article.url);
      setBookmarks(prev => prev.filter(b => b.url !== article.url));
      setRemovingBookmark(null);
    } catch (error) {
      console.error('Error removing bookmark:', error);
      setRemovingBookmark(null);
    }
  }, []);

  const renderItem = useCallback(({ item }: { item: NewsArticle }) => (
    <ArticleCard
      article={item}
      onPress={handleArticlePress}
      theme={theme}
      onBookmarkPress={() => handleBookmarkRemoval(item)}
    />
  ), [handleArticlePress, handleBookmarkRemoval, theme]);

  const keyExtractor = useCallback((item: NewsArticle) => item.url, []);

  const emptyState = useMemo(() => (
    <View style={[styles.centered, { backgroundColor: theme.background }]}>
      <Animated.View style={emptyAnimatedStyle}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          No bookmarked articles yet
        </Text>
      </Animated.View>
    </View>
  ), [theme.background, theme.textSecondary, emptyAnimatedStyle]);

  const loadingState = useMemo(() => (
    <View style={[styles.centered, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  ), [theme.background, theme.primary]);

  if (loading) {
    return loadingState;
  }

  if (bookmarks.length === 0) {
    return emptyState;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={bookmarks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BookmarksScreen; 