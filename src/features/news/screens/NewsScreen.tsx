import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { RootStackParamList } from '../../../navigation/types';
import { NewsArticle, newsApi } from '../../../services/newsApi';
import ArticleCard from '../components/ArticleCard';
import { lightTheme, darkTheme } from '../../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../context/ThemeContext';

type NewsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NewsScreen = () => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const navigation = useNavigation<NewsScreenNavigationProp>();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const scrollY = useSharedValue(0);
  const scrollTopOpacity = useSharedValue(0);
  const scrollTopScale = useSharedValue(0);

  const fetchNews = useCallback(async (pageNum: number = 1, shouldRefresh: boolean = false) => {
    try {
      const response = await newsApi.getTopHeadlines(pageNum);
      if (response.status === 'ok') {
        if (shouldRefresh) {
          setArticles(response.articles);
        } else {
          setArticles(prev => [...prev, ...response.articles]);
        }
        setHasMore(response.articles.length > 0);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(1, true);
  }, [fetchNews]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchNews(1, true);
  }, [fetchNews]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage);
    }
  }, [loadingMore, hasMore, page, fetchNews]);

  const handleArticlePress = useCallback((article: NewsArticle) => {
    navigation.navigate('ArticleDetail', { article });
  }, [navigation]);

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.value = offsetY;
    scrollTopOpacity.value = withTiming(offsetY > 300 ? 1 : 0, { duration: 200 });
    scrollTopScale.value = withSpring(offsetY > 300 ? 1 : 0);
    setShowScrollTop(offsetY > 300);
  }, [scrollY, scrollTopOpacity, scrollTopScale]);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const scrollTopAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollTopOpacity.value,
      transform: [
        { scale: scrollTopScale.value },
        {
          translateY: interpolate(
            scrollTopScale.value,
            [0, 1],
            [100, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const renderArticleCard = useCallback(({ item }: { item: NewsArticle }) => (
    <ArticleCard
      article={item}
      onPress={handleArticlePress}
      theme={theme}
    />
  ), [handleArticlePress, theme]);

  const keyExtractor = useCallback((item: NewsArticle) => item.url, []);

  const ListFooterComponent = useMemo(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }, [loadingMore, theme.primary]);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        ref={flatListRef}
        data={articles}
        renderItem={renderArticleCard}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={styles.listContent}
      />
      <Animated.View style={[styles.scrollTopButton, { backgroundColor: theme.textSecondary }, scrollTopAnimatedStyle]}>
        <TouchableOpacity
          style={styles.scrollTopButtonInner}
          onPress={scrollToTop}
        >
          <Icon name="arrow-upward" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
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
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollTopButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewsScreen; 