import { createEndpointImage } from "@/api/api";
import { COLORS } from "@/constant/colors";
import { imagesUrlDefault } from "@/constant/default_images";
import useStore from "@/hooks/store";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Modal, ScrollView, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";

const CreateGameScreen = observer(() => {
    const router = useRouter();
    const { gamesStore, imageStore } = useStore();
    const { width } = useWindowDimensions();
    const blockWidth = Math.min(width * 0.95, 904);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [pulseAnim] = useState(new Animated.Value(1));
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    const handleCreateGame = async () => {
        try {
            let imageUrl = "";

            // Показываем заставку генерации изображения
            setIsGeneratingImage(true);

            // Запускаем анимацию пульсации
            animationRef.current = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            animationRef.current.start();

            const imageRawUrl = await imageStore.generateWorldImage(
                name,
                description || "Фентези мир для ролевой игры"
            );

            // Скрываем заставку после генерации
            setIsGeneratingImage(false);
            if (animationRef.current) {
                animationRef.current.stop();
                animationRef.current = null;
            }
            pulseAnim.setValue(1);

            if (imageRawUrl) {
                imageUrl = createEndpointImage(imageRawUrl);
            }
            else {
                imageUrl = imagesUrlDefault.worldsUrl;
            }
            await gamesStore.createGame(name.trim(), description.trim() || "", imageUrl);
        } catch (error: any) {
            setIsGeneratingImage(false);
            if (animationRef.current) {
                animationRef.current.stop();
                animationRef.current = null;
            }
            pulseAnim.setValue(1);
            const errorMessage = gamesStore.getError || "Не удалось создать мир";
            Alert.alert("Ошибка", errorMessage);
            console.error("Create game error:", error);
        }
        router.back();
    };

    return (
        <>
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
                        Создать мир
                    </Text>

                    <View style={{ marginBottom: 20 }}>
                        <Text style={{
                            fontFamily: "Roboto",
                            fontWeight: "400",
                            fontSize: 18,
                            color: COLORS.textPrimary,
                            marginBottom: 8,
                        }}>
                            Название мира *
                        </Text>
                        <TextInput
                            placeholder="Введите название мира"
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
                            placeholder="Введите описание мира (необязательно)"
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

            <Modal
                visible={isGeneratingImage}
                transparent={true}
                animationType="fade"
            >
                <View style={{
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <View style={{
                        backgroundColor: COLORS.backgroundSecondary,
                        borderRadius: 24,
                        padding: 40,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.1)",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                    }}>
                        <Animated.View style={{
                            transform: [{ scale: pulseAnim }],
                            marginBottom: 24,
                        }}>
                            <ActivityIndicator
                                size="large"
                                color={COLORS.primary}
                                style={{ marginBottom: 8 }}
                            />
                        </Animated.View>

                        <Text style={{
                            fontFamily: "Roboto",
                            fontWeight: "600",
                            fontSize: 20,
                            color: COLORS.textPrimary,
                            marginBottom: 8,
                            textAlign: "center",
                        }}>
                            Генерация с помощью AI
                        </Text>

                        <Text style={{
                            fontFamily: "Roboto",
                            fontWeight: "400",
                            fontSize: 14,
                            color: COLORS.textSecondary,
                            textAlign: "center",
                            marginTop: 8,
                        }}>
                            Создаём изображение мира...
                        </Text>
                    </View>
                </View>
            </Modal>
        </>
    );
});

export default CreateGameScreen;

