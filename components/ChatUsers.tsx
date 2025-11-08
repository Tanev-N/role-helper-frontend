import React, { useState, useEffect, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    useWindowDimensions,
    ScrollView,
    LayoutChangeEvent,
    Platform,
} from "react-native";
import { observer } from "mobx-react-lite";
import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";

type User = {
    id: number;
    name: string;
    color: string;
};

// Массив цветов для игроков
const playerColors = [
    "#4caf50",
    "#651717",
    "#9c7a00",
    "#e91e63",
    "#0049d9",
    "#6cb72b",
    "#9c7a00",
    "#651717",
    "#4caf50",
    "#e91e63",
];

const ChatUsers = () => {
    const { width } = useWindowDimensions();
    const [containerWidth, setContainerWidth] = useState(0);
    const isMobile = width < 768;
    const { gamesStore, charactersStore } = useStore();

    // Загружаем персонажей при монтировании, если они еще не загружены
    useEffect(() => {
        if (charactersStore.getCharacters.length === 0) {
            charactersStore.fetchCharacters();
        }
    }, [charactersStore]);

    // Загружаем персонажей для игроков, если они еще не загружены
    useEffect(() => {
        const gamePlayers = gamesStore.getGamePlayers;
        if (gamePlayers && gamePlayers.length > 0) {
            gamePlayers.forEach((player) => {
                const character = charactersStore.getCharacters.find(
                    (char) => char.id === player.character_id
                );
                if (!character && !charactersStore.getCharacterById(player.character_id)) {
                    // Загружаем персонажа, если он не найден
                    charactersStore.fetchCharacterById(player.character_id);
                }
            });
        }
    }, [gamesStore.getGamePlayers, charactersStore]);

    // Получаем игроков из store и преобразуем их в формат User
    const users = useMemo(() => {
        const gamePlayers = gamesStore.getGamePlayers;
        if (!gamePlayers || gamePlayers.length === 0) {
            return [];
        }

        return gamePlayers.map((player, index) => {
            // Получаем информацию о персонаже
            const character = charactersStore.getCharacters.find(
                (char) => char.id === player.character_id
            ) || charactersStore.getCharacterById(player.character_id);

            // Используем имя персонажа или fallback
            const name = character?.name || `Игрок ${player.id}`;
            
            // Генерируем цвет на основе id игрока
            const color = playerColors[index % playerColors.length];

            return {
                id: player.id,
                name,
                color,
            } as User;
        });
    }, [gamesStore.getGamePlayers, charactersStore.getCharacters]);

    useEffect(() => {
        if (Platform.OS === "web" && typeof document !== "undefined") {
            const style = document.createElement("style");
            style.innerHTML = `
                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
            `;
            document.head.appendChild(style);
            return () => {
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            };
        }
    }, []);

    // === мобильная версия (одна вертикальная колонка сбоку)  - доработать! ===
    if (isMobile) {
        return (
            <ScrollView
                showsVerticalScrollIndicator={true}
                style={styles.scrollMobile}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 22,
                    paddingVertical: 24,
                }}
            >
                {users.map((u) => (
                    <View
                        key={u.id}
                        style={[styles.userBoxMobile, { backgroundColor: u.color }]}
                    >
                        <Text style={styles.userNameMobile}>{u.name}</Text>
                    </View>
                ))}
            </ScrollView>
        );
    }

    // === десктоп (2 колонки) ===
    const columns: User[][] = [[], []];
    users.forEach((u, i) => columns[i % 2].unshift(u));

    const totalGap = 22;
    const boxSize =
        containerWidth > 0
            ? Math.max(containerWidth / 2 - totalGap / 2, 100)
            : 120;

    const onLayout = (e: LayoutChangeEvent) => {
        setContainerWidth(e.nativeEvent.layout.width);
    };

    return (
        <ScrollView
            style={styles.scrollDesktop}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
            showsVerticalScrollIndicator={true}
        >
            <View style={[styles.desktopContainer, { gap: totalGap }]} onLayout={onLayout}>
                {columns.map((col, colIndex) => (
                    <View key={colIndex} style={[styles.column, { gap: totalGap }]}>
                        {col.map((u) => (
                            <View
                                key={u.id}
                                style={[
                                    styles.userBox,
                                    { backgroundColor: u.color, width: boxSize, height: boxSize },
                                ]}
                            >
                                <Text style={styles.userName}>{u.name}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default observer(ChatUsers);

const styles = StyleSheet.create({
    /** Десктоп */
    scrollDesktop: {
        flex: 1,
        width: "100%",
    },
    desktopContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        width: "100%",
        paddingVertical: 16,
    },
    column: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    userBox: {
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    userName: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 24,
        lineHeight: 24,
        color: COLORS.textPrimary,
        textAlign: "center",
    },

    /** мобилка */
    scrollMobile: {
        flex: 1,
        width: "100%",
    },
    userBoxMobile: {
        width: 100,
        height: 100,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    userNameMobile: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 20,
        lineHeight: 20,
        color: COLORS.textPrimary,
        textAlign: "center",
    },
});