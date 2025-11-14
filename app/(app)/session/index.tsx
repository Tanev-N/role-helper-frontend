import { styles } from "@/components/Session/CreateSession";
import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { Game } from "@/stores/Games/api";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
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
                router.push(`/session/${session.id}`);
            }
        } catch (error: any) {
            const errorMessage = gamesStore.getError || "Не удалось создать сессию";
            Alert.alert("Ошибка", errorMessage);
            console.error("Create session error:", error);
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

            {/* === КНОПКА СОЗДАНИЯ === */}
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
        </View>
    );
};

export default observer(CreateSessionScreen);