import { styles } from "@/components/Session/CreateSession";
import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { Game, Session } from "@/stores/Games/api";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { Copy, Plus } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

const CreateSessionScreen = () => {
    const router = useRouter();
    const { gamesStore } = useStore();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const isSmallScreen = width < 425;
    const containerWidth = isMobile ? "90%" : 723;

    const [searchFilter, setSearchFilter] = useState("");
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [createdSession, setCreatedSession] = useState<Session | null>(null);

    // Загружаем игры при монтировании
    useEffect(() => {
        gamesStore.fetchGames();
    }, []);

    // Фильтруем игры по поисковому запросу
    const filteredGames = useMemo(() => {
        const games = gamesStore.getGames || [];
        if (!searchFilter.trim()) {
            return games;
        }
        return games.filter((game) =>
            game.name.toLowerCase().includes(searchFilter.toLowerCase())
        );
    }, [gamesStore.getGames, searchFilter]);

    // Цвета для карточек игр
    const colors = [COLORS.primary, COLORS.intelligence];

    const isButtonDisabled = !selectedGame || gamesStore.IsLoading;

    const handleCreateSession = async () => {
        if (isButtonDisabled || !selectedGame) return;

        try {
            const session = await gamesStore.createSession(selectedGame.id);
            if (session) {
                setCreatedSession(session);
            }
        } catch (error: any) {
            const errorMessage = gamesStore.getError || "Не удалось создать сессию";
            Alert.alert("Ошибка", errorMessage);
            console.error("Create session error:", error);
        }
    };

    const handleCopyCode = async () => {
        if (createdSession?.session_key) {
            await Clipboard.setStringAsync(createdSession.session_key);
            Alert.alert("Успешно", "Код сессии скопирован в буфер обмена");
        }
    };

    const handleGoToSession = () => {
        if (createdSession) {
            router.push(`/session/${createdSession.id}`);
        }
    };

    const handleCreateGame = () => {
        router.push("/(app)/cabinet/game");
    };

    return (
        <View style={[styles.container, isSmallScreen && { paddingTop: 120 }]}>
            {/* === ЛОГОТИП === */}
            <Text style={styles.logo}>Critical Roll</Text>

            {/* === БЛОК 1: Выбор мира === */}
            <View style={[styles.block, { width: containerWidth }]}>
                <TextInput
                    style={styles.input}
                    placeholder="Введите имя мира"
                    placeholderTextColor={COLORS.textSecondary}
                    value={searchFilter}
                    onChangeText={setSearchFilter}
                />

                {gamesStore.IsLoading && gamesStore.getGames && gamesStore.getGames.length === 0 ? (
                    <View style={{ alignItems: "center", paddingVertical: 40 }}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : (
                    <View style={styles.colorRow}>
                        {filteredGames && filteredGames.map((game, index) => (
                            <TouchableOpacity
                                key={game.id}
                                onPress={() => setSelectedGame(game)}
                                style={[
                                    styles.colorRect,
                                    {
                                        backgroundColor:
                                            colors[index % colors.length],
                                    },
                                    selectedGame?.id === game.id &&
                                    styles.colorSelected,
                                ]}
                            >
                                <Text
                                    style={{
                                        color: COLORS.textPrimary,
                                        fontFamily: "Roboto",
                                        fontSize: 18,
                                        fontWeight: "600",
                                        textAlign: "center",
                                        paddingHorizontal: 8,
                                    }}
                                    numberOfLines={2}
                                >
                                    {game.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.addRect}
                            onPress={handleCreateGame}
                        >
                            <Plus size={36} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* === БЛОК С КОДОМ СЕССИИ === */}
            {createdSession && (
                <View style={[styles.block, { width: containerWidth }]}>
                    <Text style={styles.label}>Код сессии</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: COLORS.backgroundPrimary,
                            borderRadius: 11,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            marginBottom: 16,
                        }}
                    >
                        <Text
                            style={{
                                color: COLORS.textPrimary,
                                fontFamily: "Roboto",
                                fontSize: 24,
                                fontWeight: "600",
                                letterSpacing: 2,
                            }}
                        >
                            {createdSession.session_key}
                        </Text>
                        <TouchableOpacity
                            onPress={handleCopyCode}
                            style={{
                                padding: 8,
                            }}
                        >
                            <Copy size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={handleGoToSession}
                        style={[
                            styles.buttonCreateSession,
                            {
                                width: "100%",
                                marginTop: 0,
                            },
                        ]}
                    >
                        <Text style={styles.buttonText}>Перейти в сессию</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* === КНОПКА СОЗДАНИЯ === */}
            {!createdSession && (
                <TouchableOpacity
                    onPress={handleCreateSession}
                    style={[
                        styles.buttonCreateSession,
                        isButtonDisabled && { opacity: 0.5 },
                    ]}
                    disabled={isButtonDisabled}
                >
                    <Text style={styles.buttonText}>
                        {gamesStore.IsLoading ? "Создание..." : "Создать"}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default observer(CreateSessionScreen);