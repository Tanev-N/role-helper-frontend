import useStore from "@/hooks/store";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ArrowRight, Globe2, Plus } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect } from "react";
import { ImageBackground, Pressable, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { styles } from "./styles";

const WorldsBlock = observer(() => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const blockWidth = Math.min(width * 0.95, 904);
  const router = useRouter();
  const { gamesStore } = useStore();

  useEffect(() => {
    gamesStore.fetchGames();
  }, [gamesStore]);

  // Обновляем данные при возврате на страницу
  useFocusEffect(
    useCallback(() => {
      gamesStore.fetchGames();
    }, [gamesStore])
  );

  const games = gamesStore.getGames || [];
  const worldsPerRow = isMobile ? 2 : 4;

  const worldCardWidth =
    (blockWidth - 35 * 2 - (worldsPerRow - 1) * 8) / worldsPerRow;

  return (
    <View style={[styles.sectionBlock, { width: blockWidth }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Globe2 size={28} color={"rgba(227,227,227,1)"} />
          <View style={{ marginLeft: 25 }}>
            <Text style={styles.sectionTitle}>Мои миры</Text>
            <Text style={styles.sectionSubtitle}>Доступно {games.length} {games.length === 1 ? 'мир' : games.length < 5 ? 'мира' : 'миров'}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => router.push("/cabinet/worlds")}
        >
          <ArrowRight size={20} color={"rgba(227,227,227,1)"} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={[styles.itemsGrid, { gap: 18, paddingHorizontal: 35 }]}>
        {games && games.map((game, i) => (
          <Pressable
            key={game.id}
            style={({ pressed }) => [
              styles.worldRect,
              {
                width: worldCardWidth,
                height: 88,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ImageBackground
              source={{ uri: game.photo }}
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                padding: 8,
              }}
              resizeMode="cover"
            >
              <Text
                style={{
                  color: "rgba(255,255,255,1)",
                  fontFamily: "Roboto",
                  fontWeight: "600",
                  fontSize: 14,
                  textAlign: "center",
                }}
                numberOfLines={2}
              >
                {game.name}
              </Text>
            </ImageBackground>
          </Pressable>
        ))}

        <TouchableOpacity
          style={[styles.addRect, { width: worldCardWidth, height: 88 }]}
          onPress={() => { router.push("/(app)/cabinet/game") }}
        >
          <Plus size={36} color={"rgba(227,227,227,1)"} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default WorldsBlock;
