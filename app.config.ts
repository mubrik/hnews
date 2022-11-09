import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'hacker-news',
  slug: 'expo.dev/@mubrik/hacker-news'
});
