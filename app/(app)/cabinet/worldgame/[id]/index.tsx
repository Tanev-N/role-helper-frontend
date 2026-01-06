import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View
} from "react-native";

import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { worldGameStyles as styles } from "./styles";

const WorldGameScreen = observer(() => {
  const { gamesStore } = useStore();
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();

  const DESKTOP_MAX_WIDTH = 904;
  const containerWidth = Math.min(width * 0.95, DESKTOP_MAX_WIDTH);

  const CARD_RATIO_FULL = 368 / 904;
  const CARD_RATIO_IMAGE = 273 / 904;
  const CARD_RATIO_NAME = 81 / 904;

  const cardWidth = containerWidth;
  const cardHeight = cardWidth * CARD_RATIO_FULL;
  const imageHeight = cardWidth * CARD_RATIO_IMAGE;
  const nameHeight = cardWidth * CARD_RATIO_NAME;

  const world = gamesStore.getGames.find((game) => game.id === id as any);

  useEffect(() => {
    if (id) {
      gamesStore.fetchPreviousSessions(Number(id));
    }
  }, [id, gamesStore]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        gamesStore.fetchPreviousSessions(Number(id));
      }
    }, [id, gamesStore])
  );

  const sessions = gamesStore.getPreviousSessions.filter(
    (session) => session.game_id === Number(id)
  );

  const formatSessionTitle = (session: any, index: number) => {
    if (session.created_at) {
      const date = new Date(session.created_at);
      return `СЕССИЯ ${date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}`;
    }
    return `СЕССИЯ ${index + 1}`;
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.screenContent,
        { paddingTop: isMobile ? 110 : 90 },
      ]}
    >
      <View style={[styles.container, { width: containerWidth }]}>
        {/* === КАРТОЧКА МИРА === */}
        <View style={[styles.worldCard, { width: cardWidth, height: cardHeight }]}>
          <View style={[styles.worldImageContainer, { height: imageHeight }]}>
            <Image
              source={world && world.photo ? { uri: world.photo } : undefined}
              style={styles.worldImage}
              resizeMode="cover"
            />
          </View>

          <View style={[styles.worldNameContainer, { height: nameHeight }]}>
            <Text style={styles.worldNameText}>{world && world.name}</Text>
          </View>
        </View>

        {/* === ИСТОРИЯ МИРА === */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          История мира
        </Text>

        <View style={styles.worldStoryCard}>
          <Text style={styles.worldStoryText}>{world && world.description}</Text>
        </View>

        {/* === ВАШИ СЕССИИ === */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>
          ВАШИ СЕССИИ
        </Text>
        <View style={styles.sectionDivider} />
        {sessions.map((session, index) => (
          <View key={session.id} style={styles.sessionCard}>
            <Text style={styles.sessionTitle}>
              {formatSessionTitle(session, index)}
            </Text>

            <View style={styles.sessionRow}>
              <Text style={styles.sessionPreview} numberOfLines={5}>
                {session.summary || "Описание сессии отсутствует"}
              </Text>

              <Pressable
                style={styles.sessionArrowHitbox}
                onPress={() => {
                  router.push(
                    ("/(app)/cabinet/worldgame/" +
                      id +
                      "/session/" +
                      session.id) as any
                  );
                }}
              >
                <ChevronRight size={24} color={COLORS.textPrimary} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
});

export default WorldGameScreen;
