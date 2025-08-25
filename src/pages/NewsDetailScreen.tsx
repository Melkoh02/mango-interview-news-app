import React, { useCallback, useMemo, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Divider, Text, useTheme } from 'react-native-paper';
import { Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Routes, type RootStackParamList } from '../lib/types/navigation';

const stripHtml = (raw?: string) => (raw ? raw.replace(/<[^>]+>/g, '').trim() : '');

export default function NewsDetailScreen() {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, Routes.NewsDetail>>();

  const article = route.params?.article;

  useLayoutEffect(() => {
    navigation.setOptions({ title: article?.source?.name ?? 'Article' });
  }, [navigation, article?.source?.name]);

  if (!article) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Article not found.</Text>
      </View>
    );
  }

  const formattedDate = useMemo(() => {
    if (!article.publishedAt) return undefined;
    try {
      return new Date(article.publishedAt).toLocaleString();
    } catch {
      return article.publishedAt;
    }
  }, [article.publishedAt]);

  const openLink = useCallback(() => {
    if (article.url) Linking.openURL(article.url);
  }, [article.url]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {article.urlToImage ? (
          <Card mode="contained">
            <Card.Cover source={{ uri: article.urlToImage }} />
          </Card>
        ) : null}

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.title}>
            {article.title}
          </Text>

          <View style={styles.metaRow}>
            {article.source?.name ? (
              <Chip compact style={styles.chip}>
                {article.source.name}
              </Chip>
            ) : null}
            {formattedDate ? (
              <Chip compact style={styles.chip}>
                {formattedDate}
              </Chip>
            ) : null}
          </View>

          {article.author ? (
            <Text variant="labelLarge" style={styles.author}>
              {article.author}
            </Text>
          ) : null}
        </View>

        <Divider style={styles.divider} />

        {article.description ? (
          <Text variant="bodyLarge" style={styles.paragraph}>
            {stripHtml(article.description)}
          </Text>
        ) : null}

        {article.content ? (
          <Text variant="bodyMedium" style={styles.paragraph}>
            {stripHtml(article.content)}
          </Text>
        ) : null}

        <View style={styles.actions}>
          {article.url ? (
            <Button mode="contained" onPress={openLink}>
              Open Source
            </Button>
          ) : null}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  section: { marginTop: 12 },
  title: { marginTop: 8 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  chip: { marginRight: 8, marginBottom: 8 },
  author: { opacity: 0.7, marginTop: 6 },
  divider: { marginVertical: 16 },
  paragraph: { marginBottom: 12, lineHeight: 22 },
  actions: { marginTop: 8, flexDirection: 'row', gap: 12 },
});
