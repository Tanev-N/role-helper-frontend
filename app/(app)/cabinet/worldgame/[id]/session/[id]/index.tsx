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
  const [charactersLoaded, setCharactersLoaded] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);

  const DESKTOP_MAX_WIDTH = 904;
  const containerWidth = Math.min(width * 0.95, DESKTOP_MAX_WIDTH);

  // Загружаем все данные параллельно: игроки, персонажи, история сессии, информация о сессии
  useEffect(() => {
    const loadAllData = async () => {
      if (!id) return;
      
      try {
        setCharactersLoaded(false);
        
        const promises: Promise<any>[] = [
          gamesStore.fetchPreviousSessionPlayers(id as string).catch((e) => {
            console.warn("Error loading session players:", e);
            return null;
          }),
          sessionStore ? sessionStore.initSession(id as string).catch((e) => {
            console.warn("Error loading session history:", e);
            return null;
          }) : Promise.resolve(),
        ];
        
        await Promise.all(promises);
        
        // Получаем game_id из первого игрока или из существующей сессии
        const sessionPlayers = gamesStore.getSessionPlayers;
        const existingSession = gamesStore.getPreviousSessions.find(
          (s) => s.id === id as string
        );
        const gameId = existingSession?.game_id || 
                       (sessionPlayers && sessionPlayers.length > 0 && sessionPlayers[0]?.game_id 
                         ? String(sessionPlayers[0].game_id) 
                         : null);
        
        // Если нет информации о сессии и есть game_id, загружаем previousSessions
        if (!existingSession && gameId) {
          try {
            await gamesStore.fetchPreviousSessions(gameId);
          } catch (e) {
            console.warn("Error loading previous sessions:", e);
          }
        }
        
        // Небольшая задержка для обновления MobX состояния
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        // Сразу загружаем всех персонажей параллельно
        if (sessionPlayers && sessionPlayers.length > 0) {
          const characterPromises = sessionPlayers.map((player) => {
            const charId = String(player.character_id);
            if (!charactersStore.getCharacterById(charId)) {
              return charactersStore.fetchCharacterById(charId).catch((e) => {
                console.warn(`Error loading character ${charId}:`, e);
                return null;
              });
            }
            return Promise.resolve();
          });
          await Promise.all(characterPromises);
        }
        
        setCharactersLoaded(true);
      } catch (error) {
        console.error("Error loading session data:", error);
        setCharactersLoaded(true); // Устанавливаем в true, чтобы не блокировать UI
      }
    };
    loadAllData();
  }, [id, gamesStore, charactersStore, sessionStore]);

  useFocusEffect(
    useCallback(() => {
      const loadAllData = async () => {
        if (!id) return;
        
        try {
          setCharactersLoaded(false);
          
          // Загружаем все данные параллельно
          const promises: Promise<any>[] = [
            // Загружаем игроков завершенной сессии
            gamesStore.fetchPreviousSessionPlayers(id as string).catch((e) => {
              console.warn("Error loading session players:", e);
              return null;
            }),
            // Загружаем историю сессии
            sessionStore ? sessionStore.initSession(id as string).catch((e) => {
              console.warn("Error loading session history:", e);
              return null;
            }) : Promise.resolve(),
          ];
          
          await Promise.all(promises);
          
          // Получаем game_id из первого игрока или из существующей сессии
          const sessionPlayers = gamesStore.getSessionPlayers;
          const existingSession = gamesStore.getPreviousSessions.find(
            (s) => s.id === id as string
          );
          const gameId = existingSession?.game_id || 
                         (sessionPlayers && sessionPlayers.length > 0 && sessionPlayers[0]?.game_id 
                           ? String(sessionPlayers[0].game_id) 
                           : null);
          
          // Если нет информации о сессии и есть game_id, загружаем previousSessions
          if (!existingSession && gameId) {
            try {
              await gamesStore.fetchPreviousSessions(gameId);
            } catch (e) {
              console.warn("Error loading previous sessions:", e);
            }
          }
          
          // Небольшая задержка для обновления MobX состояния
          await new Promise((resolve) => setTimeout(resolve, 100));
          
          // Сразу загружаем всех персонажей параллельно
          if (sessionPlayers && sessionPlayers.length > 0) {
            const characterPromises = sessionPlayers.map((player) => {
              const charId = String(player.character_id);
              if (!charactersStore.getCharacterById(charId)) {
                return charactersStore.fetchCharacterById(charId).catch((e) => {
                  console.warn(`Error loading character ${charId}:`, e);
                  return null;
                });
              }
              return Promise.resolve();
            });
            await Promise.all(characterPromises);
          }
          
          setCharactersLoaded(true);
        } catch (error) {
          console.error("Error loading session data:", error);
          setCharactersLoaded(true); // Устанавливаем в true, чтобы не блокировать UI
        }
      };
      loadAllData();
    }, [id, gamesStore, charactersStore, sessionStore])
  );

  // История сессии теперь загружается вместе с игроками выше

  // Преобразуем историю из store в сообщения для чата
  useEffect(() => {
    if (!sessionStore) return;
    try {
      const msgs: Message[] = [];
      const history = sessionStore.getHistory;
      if (Array.isArray(history)) {
        history.forEach((h: any, idx: number) => {
          if (h?.query) {
            msgs.push({
              id: `s-q-${idx}`,
              text: h.query,
              fromUser: true,
              timestamp: h.timestamp,
            });
          }
          if (h?.answer) {
            msgs.push({
              id: `s-a-${idx}`,
              text: h.answer,
              fromUser: false,
              timestamp: h.timestamp,
            });
          }
        });
      }
      setMessages(msgs);
    } catch (error) {
      console.error("Error processing session history:", error);
      setMessages([]);
    }
  }, [sessionStore, sessionStore?.history?.length]);

  // Получаем сессию из previous sessions
  const session = useMemo(() => {
    try {
      const previousSessions = gamesStore.getPreviousSessions;
      if (!Array.isArray(previousSessions)) return undefined;
      return previousSessions.find(
        (s) => s?.id === id as string
      );
    } catch (error) {
      console.error("Error getting session:", error);
      return undefined;
    }
  }, [gamesStore.getPreviousSessions, id]);

  useEffect(() => {
    if (session?.summary) {
      const defaultTexts = ["Тут будет описание", "Описание будет здесь", ""];
      const trimmedSummary = session.summary.trim();
      if (!defaultTexts.includes(trimmedSummary)) {
        setSummaryText(session.summary);
      }
    }
  }, [session?.summary]);


  const charactersList = useMemo(() => {
    try {
      const sessionPlayers = gamesStore.getSessionPlayers;
      if (!sessionPlayers || !Array.isArray(sessionPlayers) || sessionPlayers.length === 0) {
        return "Нет данных о персонажах";
      }

      return sessionPlayers
        .map((player) => {
          if (!player || !player.character_id) return "Неизвестный персонаж";
          const charId = String(player.character_id);
          const character = charactersStore.getCharacterById(charId);
          const shortCharacter = charactersStore.getCharacters?.find(
            (char) => char?.id === charId
          );
          const characterName =
            character?.name || shortCharacter?.name || `Персонаж ${charId}`;
          return characterName;
        })
        .join(", ");
    } catch (error) {
      console.error("Error building characters list:", error);
      return "Ошибка загрузки персонажей";
    }
  }, [
    gamesStore.getSessionPlayers,
    charactersStore.getCharacters,
    // Принудительно обновляем при изменении количества персонажей в store
    charactersStore.getCharacters?.length || 0,
    charactersLoaded, // Обновляем после загрузки персонажей
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
          <Text style={styles.infoCardTitle}>Персонажи</Text>
          <Text style={styles.infoCardText}>{charactersList}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Описание сессии</Text>
          {summaryText ? (
            <Text style={styles.infoCardText}>{summaryText}</Text>
          ) : (
            <Text style={styles.infoCardText}>Тут будет описание</Text>
          )}
        </View>

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
