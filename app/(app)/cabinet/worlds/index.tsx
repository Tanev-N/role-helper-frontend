import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { Game } from "@/stores/Games/api";
import { worldsStyles as styles } from "./styles";

const WorldsListScreen = observer(() => {
  const { gamesStore } = useStore();
  const { width } = useWindowDimensions();
  const router = useRouter();

  const isMobile = width < 768;
  const isSmallMobile = width < 420;

  const DESKTOP_MAX_WIDTH = 904;
  const containerWidth = Math.min(width * 0.95, DESKTOP_MAX_WIDTH);

  const CARD_RATIO_FULL = 368 / 904;
  const CARD_RATIO_IMAGE = 273 / 904;
  const CARD_RATIO_NAME = 81 / 904;

  const cardWidth = containerWidth;
  const cardHeight = cardWidth * CARD_RATIO_FULL;
  const imageHeight = cardWidth * CARD_RATIO_IMAGE;
  const nameHeight = cardWidth * CARD_RATIO_NAME;

  useEffect(() => {
    gamesStore.fetchGames();
  }, [gamesStore]);

  useFocusEffect(
    useCallback(() => {
      gamesStore.fetchGames();
    }, [gamesStore])
  );

  const worlds: Game[] = gamesStore.getGames || [];

  // Fallback цвета для фона, если изображения нет
  const fallbackColors = [
    COLORS.primary,
    COLORS.intelligence,
    COLORS.wisdom,
    COLORS.charisma,
    COLORS.strength,
  ];

  const titleSize = isSmallMobile ? 22 : 24;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.screenContent,
        { paddingTop: isMobile ? 80 : 64 },
      ]}
    >
      <View style={{ width: containerWidth }}>
        <Text style={[styles.pageTitle, { fontSize: titleSize }]}>
          ВАШИ МИРЫ
        </Text>
        <View style={styles.pageDivider} />
      </View>

      {/* Список карточек миров */}
      <View style={[styles.list, { width: containerWidth }]}>
        {worlds.map((world, index) => {
          const bgColor = fallbackColors[index % fallbackColors.length];
          const imageSrc = world.photo;

          const arrowTop = imageHeight * (115 / 273);
          const arrowRight = cardWidth * (50 / 904);

          return (
            <View
              key={world.id}
              style={[
                styles.worldCard,
                {
                  width: cardWidth,
                  height: cardHeight,
                },
              ]}
            >
              <View
                style={[
                  styles.worldImageContainer,
                  {
                    height: imageHeight,
                    backgroundColor: bgColor,
                  },
                ]}
              >
                {imageSrc ? (
                  <Image
                    source={{ uri: imageSrc }}
                    style={styles.worldImage}
                    resizeMode="cover"
                  />
                ) : null}

                <Pressable
                  style={[
                    styles.worldArrowHitbox,
                    {
                      width: 44,
                      height: 44,
                      top: arrowTop,
                      right: arrowRight,
                    },
                  ]}
                  onPress={() => {
                    router.push("/(app)/cabinet/worldgame/" + world.id as any);

                  }}

                >
                  <ChevronRight size={32} color={COLORS.textPrimary} />
                </Pressable>
              </View>

              <View
                style={[
                  styles.worldNameContainer,
                  {
                    height: nameHeight,
                  },
                ]}
              >
                <Text style={styles.worldNameText} numberOfLines={2}>
                  {world.name}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
});

export default WorldsListScreen;
