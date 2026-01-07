import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo } from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

import useStore from "@/hooks/store";
import { sessionDetailsStyles as styles } from "./styles";

const SessionDetailsScreen = observer(() => {
  const { gamesStore, charactersStore } = useStore();
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const DESKTOP_MAX_WIDTH = 904;
  const containerWidth = Math.min(width * 0.95, DESKTOP_MAX_WIDTH);

  useEffect(() => {
    if (id) {
      gamesStore.fetchSessionPlayers(id as string);
    }
  }, [id, gamesStore]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        gamesStore.fetchSessionPlayers(id as string);
      }
    }, [id, gamesStore])
  );

  // Получаем сессию из previous sessions
  const session = useMemo(() => {
    return gamesStore.getPreviousSessions.find(
      (s) => s.id === id as string
    );
  }, [gamesStore.getPreviousSessions, id]);

  // Загружаем информацию о персонажах
  useEffect(() => {
    const sessionPlayers = gamesStore.getSessionPlayers;
    sessionPlayers.forEach((player) => {
      const charId = String(player.character_id);
      if (!charactersStore.getCharacterById(charId)) {
        charactersStore.fetchCharacterById(charId);
      }
    });
  }, [gamesStore.getSessionPlayers, charactersStore]);

  // Формируем списки игроков и персонажей
  const playersList = useMemo(() => {
    const sessionPlayers = gamesStore.getSessionPlayers;
    if (!sessionPlayers || sessionPlayers.length === 0) {
      return "Нет данных об игроках";
    }

    return sessionPlayers
      .map((player) => {
        const charId = String(player.character_id);
        const character = charactersStore.getCharacterById(charId);
        const shortCharacter = charactersStore.getCharacters?.find(
          (char) => char.id === charId
        );
        const characterName =
          character?.name || shortCharacter?.name || `Персонаж ${charId}`;
        return characterName;
      })
      .join(", ");
  }, [
    gamesStore.getSessionPlayers,
    charactersStore.getCharacterById,
    charactersStore.getCharacters,
  ]);

  const charactersList = useMemo(() => {
    const sessionPlayers = gamesStore.getSessionPlayers;
    if (!sessionPlayers || sessionPlayers.length === 0) {
      return "Нет данных о персонажах";
    }

    return sessionPlayers
      .map((player) => {
        const charId = String(player.character_id);
        const character = charactersStore.getCharacterById(charId);
        const shortCharacter = charactersStore.getCharacters?.find(
          (char) => char.id === charId
        );
        const characterName =
          character?.name || shortCharacter?.name || `Персонаж ${charId}`;
        return characterName;
      })
      .join(", ");
  }, [
    gamesStore.getSessionPlayers,
    charactersStore.getCharacterById,
    charactersStore.getCharacters,
  ]);

  const formatSessionTitle = () => {
    if (!session) return "СЕССИЯ";
    if (session.created_at) {
      const date = new Date(session.created_at);
      return `СЕССИЯ ${date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}`;
    }
    return "СЕССИЯ";
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.screenContent,
        { paddingTop: isMobile ? 96 : 72 },
      ]}
    >
      <View style={[styles.container, { width: containerWidth }]}>
        <Text style={styles.sessionTitle}>{formatSessionTitle()}</Text>
        <View style={styles.titleDivider} />

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Игроки</Text>
          <Text style={styles.infoCardText}>{playersList}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Персонажи</Text>
          <Text style={styles.infoCardText}>{charactersList}</Text>
        </View>

        {session?.summary && (
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Описание сессии</Text>
            <Text style={styles.infoCardText}>{session.summary}</Text>
          </View>
        )}


      </View>
    </ScrollView>
  );
});

export default SessionDetailsScreen;
