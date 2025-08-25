import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import useApi from '../lib/hooks/useApi.ts';
import NewsCard from '../components/newsCard.tsx';
import {Article} from '../lib/types/article.ts';

const NEWS_PAGE_SIZE = 20;
const NEWS_SOURCES = [
  'abc-news',
  'ars-technica',
  'cnn',
  'cbs-news',
  'bloomberg',
  'business-insider',
  'espn',
];

export default function NewsScreen() {
  const api = useApi();

  const [data, setData] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState<number | null>(null);

  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // guard to avoid multiple onEndReached fires during momentum
  const canLoadMoreRef = useRef(true);

  // request ID so late responses don't clobber current data
  const requestIdRef = useRef(0);

  const hasNext = useMemo(() => {
    if (totalResults == null) return true;
    return data.length < totalResults;
  }, [data.length, totalResults]);

  const mergeUnique = (prev: Article[], next: Article[]) => {
    const seen = new Set(
      prev.map(a => a.url ?? `${a.title}-${a.publishedAt ?? ''}`),
    );
    const deduped = next.filter(a => {
      const key = a.url ?? `${a.title}-${a.publishedAt ?? ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return [...prev, ...deduped];
  };

  const fetchPage = useCallback(
    ({ pageToLoad, append }: { pageToLoad: number; append: boolean }) => {
      console.log("API Called!!!")
      const isAppend = append;
      isAppend ? setLoadingMore(true) : setInitialLoading(true);

      const rid = ++requestIdRef.current;

      api
        .getEverythingNews({
          language: 'en',
          sources: NEWS_SOURCES,
          page: pageToLoad,
          pageSize: NEWS_PAGE_SIZE,
        })
        .handle({
          onSuccess: res => {
            if (rid !== requestIdRef.current) return;

            console.log('News API Called! page=', pageToLoad);
            setTotalResults(res.totalResults ?? null);
            setData(prev =>
              isAppend ? mergeUnique(prev, res.articles) : res.articles,
            );
            setPage(pageToLoad);
          },
          onFinally: () => {
            setInitialLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
            canLoadMoreRef.current = true;
          },
        });
    },
    [api],
  );

  useEffect(() => {
    setTotalResults(null);
    setData([]);
    fetchPage({ pageToLoad: 1, append: false });
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasNext || initialLoading || loadingMore || refreshing) return;
    if (!canLoadMoreRef.current) return;
    canLoadMoreRef.current = false;
    fetchPage({ pageToLoad: page + 1, append: true });
  }, [fetchPage, hasNext, initialLoading, loadingMore, refreshing, page]);

  const onRefresh = useCallback(() => {
    if (initialLoading || loadingMore) return;
    setRefreshing(true);
    setTotalResults(null);
    fetchPage({ pageToLoad: 1, append: false });
  }, [fetchPage, initialLoading, loadingMore]);

  return (
    <>
      <View style={{ ...styles.container }}>
        {initialLoading && data.length === 0 ? (
          <ActivityIndicator size={25} style={styles.activityIndicator} />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item, index) =>
              item.url ?? `${item.title}-${item.publishedAt ?? index}`
            }
            renderItem={({item}) => (
              <NewsCard
                title={item.title}
                description={item.description}
                imageUrl={item.urlToImage}
                sourceName={item.source?.name}
                publishedAt={item.publishedAt}
                onPress={() => {
                  console.log("Card pressed!")
                }}
              />
            )}
            contentContainerStyle={styles.flatListContent}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
              canLoadMoreRef.current = true;
            }}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size={20} style={styles.activityIndicator} />
              ) : null
            }
            refreshing={refreshing}
            onRefresh={onRefresh}
            removeClippedSubviews
            ListEmptyComponent={
              !initialLoading ? (
                <View style={styles.textContainer}>
                  <Text style={styles.text}>No articles available</Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  activityIndicator: {paddingTop: 20},
  flatListContent: {padding: 16, flexGrow: 1},
  textContainer: {padding: 24, alignItems: 'center'},
  text: {opacity: 0.7, textAlign: 'center'},
});

