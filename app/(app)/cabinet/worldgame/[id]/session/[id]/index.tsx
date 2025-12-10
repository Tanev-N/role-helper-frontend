import { observer } from "mobx-react-lite";
import React from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

import { sessionDetailsStyles as styles } from "./styles";

const SessionDetailsScreen = observer(() => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const DESKTOP_MAX_WIDTH = 904;
  const containerWidth = Math.min(width * 0.95, DESKTOP_MAX_WIDTH);

  // ===== тестовые данные =====
  const session = {
    title: "СЕССИЯ 1",
    players: "Джо Пьяный Король, Гига ЧИТ, Фрирен, Гойдaрик",
    characters: "Дубинка, Шиншила, Пельмешка, Конина",
    npcs: "Барон Серая Грива, Темная Дева, Семен, Белка",
  };

  const chatMessages = [
    {
      id: "m1",
      side: "left" as const,
      text: "Здравствуйте! Что вы хотите?",
    },
    {
      id: "m2",
      side: "right" as const,
      text: "Начать новую игру!",
    },
    {
      id: "m3",
      side: "left" as const,
      text:
        "Добро пожаловать в мир приключений!\n" +
        "В этом разделе будет размещено описание кампании Dungeons & Dragons — истории, полной опасностей, магии и неожиданных поворотов.\n" +
        "Соберите свою партию, бросьте кости и отправьтесь навстречу судьбе: древние подземелья ждут своих героев.\n" +
        "Здесь появятся сведения о персонажах, локациях и легендах, с которыми вы столкнётесь в ходе путешествия.",
    },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.screenContent,
        { paddingTop: isMobile ? 96 : 72 },
      ]}
    >
      <View style={[styles.container, { width: containerWidth }]}>
        <Text style={styles.sessionTitle}>{session.title}</Text>
        <View style={styles.titleDivider} />

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Игроки</Text>
          <Text style={styles.infoCardText}>{session.players}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Персонажи</Text>
          <Text style={styles.infoCardText}>{session.characters}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>NPC</Text>
          <Text style={styles.infoCardText}>{session.npcs}</Text>
        </View>

        {/* === ЧАТ === */}
        <View style={styles.chatCard}>

          <View style={styles.chatHeader}>
            <Text style={styles.chatHeaderText}>Чат</Text>
          </View>

          <View style={styles.chatInnerWrapper}>
            <View style={styles.chatInner}>
              {chatMessages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.chatBubbleWrapper,
                    msg.side === "right"
                      ? { alignItems: "flex-end" }
                      : { alignItems: "flex-start" },
                  ]}
                >
                  <View
                    style={[
                      styles.chatBubble,
                      msg.side === "right"
                        ? styles.chatBubbleRight
                        : styles.chatBubbleLeft,
                    ]}
                  >
                    <Text style={styles.chatBubbleText}>{msg.text}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

        </View>


      </View>
    </ScrollView>
  );
});

export default SessionDetailsScreen;
