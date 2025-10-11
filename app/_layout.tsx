import useStore from '@/hooks/store';
import { Slot } from 'expo-router';
import { View } from 'react-native';
import { useMemo } from 'react';

const DEFAULT_BG = '#ffffff';

function readCssVar(varName: string, fallback: string) {
  if (typeof document === 'undefined') return fallback;
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(varName);
    return v ? v.trim() || fallback : fallback;
  } catch {
    return fallback;
  }
}

// Keep root layout minimal to ensure the navigator mounts immediately.
// Platform-specific providers can be added in platform specific layout files.
export default function RootLayout() {
  useStore();

  const backgroundColor = useMemo(() => readCssVar('--background-primary', DEFAULT_BG), []);

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <Slot />
    </View>
  );
}