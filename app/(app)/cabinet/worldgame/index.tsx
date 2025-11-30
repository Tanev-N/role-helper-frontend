import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { observer } from "mobx-react-lite";
import { ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

import { COLORS } from "@/constant/colors";
import { worldGameStyles as styles } from "./styles";

const WorldGameScreen = observer(() => {
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

  const world = {
    id: "world-1",
    name: "Название мира",
    image: require("@/assets/images/worlds_ex1.png"),
    story:
      "В далеком далеком царстве, в пятом государстве, жил был король Псих. " +
      "Он уничтожал свое королевство каждый день и никто не мог ему помешать. " +
      "В его подчинении огромное войско бездумных солдат. Мирные жители страдают. " +
      "Ваша задача состоит в спасении этого умершего королевства.",
  };

  const sessions = [
    {
      id: "session-1",
      title: "СЕССИЯ 1",
      preview:
        "Герои встретили героев прошлого и научились у них ремеслу. Герой Теодор одолел злого колдуна и повысил свой уровень на 1. Были выполнены цели первого этапа...",
    },
    {
      id: "session-2",
      title: "СЕССИЯ 2",
      preview:
        "Герои исследовали руины древнего храма и нашли таинственный артефакт. Старые враги вернулись, но теперь у отряда больше опыта и снаряжения...",
    },
  ];

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
              source={world.image}
              style={styles.worldImage}
              resizeMode="cover"
            />
          </View>

          <View style={[styles.worldNameContainer, { height: nameHeight }]}>
            <Text style={styles.worldNameText}>{world.name}</Text>
          </View>
        </View>

        {/* === ИСТОРИЯ МИРА === */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          История мира
        </Text>

        <View style={styles.worldStoryCard}>
          <Text style={styles.worldStoryText}>{world.story}</Text>
        </View>

        {/* === ВАШИ СЕССИИ === */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>
          ВАШИ СЕССИИ
        </Text>
        <View style={styles.sectionDivider} />

        {sessions.map((session) => (
          <View key={session.id} style={styles.sessionCard}>
            <Text style={styles.sessionTitle}>{session.title}</Text>

            <View style={styles.sessionRow}>
              <Text style={styles.sessionPreview} numberOfLines={5}>
                {session.preview}
              </Text>

              <Pressable
                style={styles.sessionArrowHitbox}
                onPress={() => {
                  router.push("/cabinet/session" as any);
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
