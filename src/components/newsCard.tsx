import React, {useMemo} from 'react';
import { StyleSheet, View} from 'react-native';
import {Card, Chip, Text, useTheme} from 'react-native-paper';
import type {NewsCardProps} from '../lib/types/newsCard';

export default function NewsCard({
                                   title,
                                   description,
                                   imageUrl,
                                   sourceName,
                                   publishedAt,
                                   onPress,
                                 }: NewsCardProps) {
  const theme = useTheme();

  const formattedDate = useMemo(
    () => (publishedAt ? new Date(publishedAt).toLocaleDateString() : ''),
    [publishedAt],
  );

  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      <Card.Cover
        source={{uri: imageUrl || 'https://picsum.photos/900/600'}}
        style={styles.cover}
        resizeMode="cover"
      />

      <Card.Title
        title={title}
        titleNumberOfLines={3}
        titleStyle={styles.title}
        subtitle={
          <View style={styles.metaRow}>
            <Chip compact mode="flat" style={styles.sourceChip}>
              <Text numberOfLines={1} variant="labelMedium">
                {sourceName ?? 'Unknown source'}
              </Text>
            </Chip>
            {!!formattedDate && (
              <>
                <Text
                  style={[styles.dot, {color: theme.colors.onSurfaceVariant}]}>
                  •
                </Text>
                <Text
                  style={[
                    styles.subtle,
                    {color: theme.colors.onSurfaceVariant},
                  ]}
                  numberOfLines={1}>
                  {formattedDate}
                </Text>
              </>
            )}
          </View>
        }
      />

      {!!description && (
        <Card.Content style={styles.content}>
          <Text variant="bodyMedium">{description}</Text>
        </Card.Content>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cover: {height: 190},
  title: {fontSize: 20, fontWeight: '800', lineHeight: 26, paddingVertical: 12},
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 6,
    marginTop: 4,
  },
  sourceChip: {
    maxWidth: '70%',
    flexShrink: 1,
    minHeight: 26,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  dot: {marginTop: -1},
  subtle: {fontSize: 13},
  content: {paddingTop: 8},
  bylineWrap: {
    flex: 1,
    paddingLeft: 2,
    minWidth: 0,
  },
  byline: {
    marginTop: 2,
    flexShrink: 1,
  },
});
