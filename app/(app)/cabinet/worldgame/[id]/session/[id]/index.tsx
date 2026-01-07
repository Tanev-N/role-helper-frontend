import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { sessionDetailsStyles as styles } from "./styles";

type Message = {
  id: string;
  text: string;
  fromUser: boolean;
  timestamp?: string;
};

const SessionDetailsScreen = observer(() => {
  const { gamesStore, sessionStore, charactersStore } = useStore();
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [messages, setMessages] = useState<Message[]>([]);

  const DESKTOP_MAX_WIDTH = 904;
  const containerWidth = Math.min(width * 0.95, DESKTOP_MAX_WIDTH);

  // Загружаем игроков завершенной сессии
  useEffect(() => {
    if (id) {
      gamesStore.fetchPreviousSessionPlayers(id as string);
    }
  }, [id, gamesStore]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        gamesStore.fetchPreviousSessionPlayers(id as string);
      }
    }, [id, gamesStore])
  );

  // Загружаем историю сессии
  useEffect(() => {
    if (id && sessionStore) {
      sessionStore.initSession(id as string);
    }
  }, [id, sessionStore]);

  useFocusEffect(
    useCallback(() => {
      if (id && sessionStore) {
        sessionStore.initSession(id as string);
      }
    }, [id, sessionStore])
  );

  // Преобразуем историю из store в сообщения для чата
  useEffect(() => {
    if (!sessionStore) return;
    const msgs: Message[] = [];
    sessionStore.getHistory.forEach((h: any, idx: number) => {
      if (h.query) {
        msgs.push({
          id: `s-q-${idx}`,
          text: h.query,
          fromUser: true,
          timestamp: h.timestamp,
        });
      }
      if (h.answer) {
        msgs.push({
          id: `s-a-${idx}`,
          text: h.answer,
          fromUser: false,
          timestamp: h.timestamp,
        });
      }
    });
    setMessages(msgs);
  }, [sessionStore, sessionStore?.history.length]);

  // Получаем сессию из previous sessions
  const session = useMemo(() => {
    return gamesStore.getPreviousSessions.find(
      (s) => s.id === id as string
    );
  }, [gamesStore.getPreviousSessions, id]);

  // Загружаем информацию о персонажах
  useEffect(() => {
    const sessionPlayers = gamesStore.getSessionPlayers;
    sessionPlayers && sessionPlayers.forEach((player) => {
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

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        {
          padding: 16,
          borderRadius: 16,
          marginVertical: 8,
          maxWidth: "85%",
          backgroundColor: "#2C2C31",
        },
        item.fromUser ? { alignSelf: "flex-end" } : { alignSelf: "flex-start" },
      ]}
    >
      <Text
        style={{
          fontFamily: "Roboto",
          fontWeight: "400",
          fontSize: 24,
          lineHeight: 24,
          color: COLORS.textPrimary,
        }}
      >
        {item.text}
      </Text>
    </View>
  );

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

        {/* История чата */}
        <View
          style={{
            marginTop: 24,
            backgroundColor: "#18191A",
            borderRadius: 16,
            padding: 24,
            minHeight: 400,
            maxHeight: 600,
          }}
        >
          <Text
            style={{
              fontFamily: "Roboto",
              fontWeight: "600",
              fontSize: 20,
              color: COLORS.textPrimary,
              marginBottom: 16,
            }}
          >
            История чата
          </Text>
          {messages.length > 0 ? (
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 40,
              }}
            >
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontFamily: "Roboto",
                  fontSize: 16,
                }}
              >
                История сообщений пуста
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
});

export default SessionDetailsScreen;
