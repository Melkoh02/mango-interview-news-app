export type NewsCardProps = {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  sourceName?: string;
  publishedAt?: string;
  onPress?: () => void;
};
