import useStore from '@/hooks/store';
import { Slot } from 'expo-router';

// Keep root layout minimal to ensure the navigator mounts immediately.
// Platform-specific providers (SafeArea, GestureHandler, StatusBar) can be
// added in app/_layout.native.tsx or app/_layout.web.tsx if needed.
export default function RootLayout() {
  useStore();

  return <Slot />;
}