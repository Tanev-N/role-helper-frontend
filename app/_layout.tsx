import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import useStore from "@/hooks/store";

export default function RootLayout() {
  useStore();

  const [loaded] = useFonts({
    UncialAntiqua: require("../assets/fonts/UncialAntiqua-Regular.ttf"),
    Roboto: require("../assets/fonts/Roboto-Regular.ttf"),
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
