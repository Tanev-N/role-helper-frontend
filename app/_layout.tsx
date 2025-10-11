import useStore from '@/hooks/store';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';

// Keep root layout minimal to ensure the navigator mounts immediately.
// Platform-specific providers (SafeArea, GestureHandler, StatusBar) can be
// added in app/_layout.native.tsx or app/_layout.web.tsx if needed.
export default function RootLayout() {
  useStore();

  const [fontsLoaded] = useFonts({
    'Uncial Antiqua': require('../assets/font/UncialAntiqua-Regular.ttf'),
  });

  return <Slot />;
}