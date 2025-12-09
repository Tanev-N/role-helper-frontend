import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  Pressable,
  Image,
} from "react-native";
import { observer } from "mobx-react-lite";
import { useFocusEffect } from "@react-navigation/native";
import { ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

import useStore from "@/hooks/store";
import { COLORS } from "@/constant/colors";
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

  const games = gamesStore.getGames || [];

  /** ===== ТЕСТОВЫЕ МИРЫ  ===== */
  const testWorlds = [
    {
      id: "test-world-1",
      name: "Название мира",
      image: require("@/assets/images/worlds_ex1.png"),
    },
    {
      id: "test-world-2",
      name: "Название мира",
      image: require("@/assets/images/worlds_ex1.png"),
    },
  ];

  // Сделано для демонстрации
  const worlds: any[] = games.length === 0 ? testWorlds : (games as any[]);

  const colors = [
    "rgba(73,124,0,1)",
    "rgba(151,0,136,1)",
    "rgba(0,60,179,1)",
    "rgba(138,113,0,1)",
    "rgba(92,15,0,1)",
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
          const bgColor = colors[index % colors.length];
          const imageSrc = (world as any).image;

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
                {imageSrc && (
                  <Image
                    source={
                      typeof imageSrc === "number"
                        ? imageSrc
                        : { uri: imageSrc }
                    }
                    style={styles.worldImage}
                    resizeMode="cover"
                  />
                )}

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
                    router.push("/(app)/cabinet/worldgame" as any);

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
