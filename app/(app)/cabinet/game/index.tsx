import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";

const CreateGameScreen = observer(() => {
    const router = useRouter();
    const { gamesStore } = useStore();
    const { width } = useWindowDimensions();
    const blockWidth = Math.min(width * 0.95, 904);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleCreateGame = async () => {
        // Валидация обязательных полей
        if (!name.trim()) {
            Alert.alert("Ошибка", "Введите название игры");
            return;
        }

        try {
            await gamesStore.createGame(name.trim(), description.trim() || "");
            // Автоматический переход на предыдущую страницу после успешного создания
            router.back();
        } catch (error: any) {
            const errorMessage = gamesStore.getError || "Не удалось создать игру";
            Alert.alert("Ошибка", errorMessage);
            console.error("Create game error:", error);
        }
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: COLORS.backgroundPrimary }}
            contentContainerStyle={{
                alignItems: "center",
                paddingTop: 40,
                paddingBottom: 60,
                justifyContent: "center",
                height: "100%",
            }}
        >
            <View style={{
                width: blockWidth,
                backgroundColor: COLORS.backgroundSecondary,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
                padding: 32,
            }}>
                <Text style={{
                    fontFamily: "Roboto",
                    fontWeight: "700",
                    fontSize: 28,
                    color: COLORS.textPrimary,
                    marginBottom: 24,
                }}>
                    Создать игру
                </Text>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontFamily: "Roboto",
                        fontWeight: "400",
                        fontSize: 18,
                        color: COLORS.textPrimary,
                        marginBottom: 8,
                    }}>
                        Название игры *
                    </Text>
                    <TextInput
                        placeholder="Введите название игры"
                        placeholderTextColor={COLORS.textLowEmphasis}
                        value={name}
                        onChangeText={setName}
                        style={{
                            backgroundColor: "rgba(24,25,26,1)",
                            borderColor: "rgba(255,255,255,0.1)",
                            borderWidth: 1,
                            borderRadius: 10,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            fontSize: 18,
                            color: COLORS.textPrimary,
                            fontFamily: "Roboto",
                        }}
                    />
                </View>

                <View style={{ marginBottom: 32 }}>
                    <Text style={{
                        fontFamily: "Roboto",
                        fontWeight: "400",
                        fontSize: 18,
                        color: COLORS.textPrimary,
                        marginBottom: 8,
                    }}>
                        Описание
                    </Text>
                    <TextInput
                        placeholder="Введите описание игры (необязательно)"
                        placeholderTextColor={COLORS.textLowEmphasis}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        style={{
                            backgroundColor: "rgba(24,25,26,1)",
                            borderColor: "rgba(255,255,255,0.1)",
                            borderWidth: 1,
                            borderRadius: 10,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            fontSize: 18,
                            color: COLORS.textPrimary,
                            fontFamily: "Roboto",
                            minHeight: 100,
                        }}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleCreateGame}
                    disabled={gamesStore.IsLoading || !name.trim()}
                    style={{
                        backgroundColor: COLORS.primary,
                        borderRadius: 16,
                        paddingVertical: 16,
                        paddingHorizontal: 32,
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: (gamesStore.IsLoading || !name.trim()) ? 0.5 : 1,
                    }}
                >
                    <Text style={{
                        color: COLORS.textPrimary,
                        fontSize: 24,
                        fontWeight: "600",
                        fontFamily: "Roboto",
                    }}>
                        {gamesStore.IsLoading ? "Создание..." : "Создать игру"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
});

export default CreateGameScreen;

