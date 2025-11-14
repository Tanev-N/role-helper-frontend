import { connectStyles as styles } from "@/components/Session/ConnectSession";
import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

const ConnectScreen = () => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width < 1300;
    const isSmallScreen = width < 425;

    const dynamicFont = width < 425 ? 20 : width < 768 ? 24 : 30;
    const dynamicLogo = width < 425 ? 36 : width < 768 ? 48 : 64;
    const dynamicBlockPadding = width < 425 ? 16 : 24;

    const containerWidth = isMobile ? "90%" : 723;
    const { charactersStore, gamesStore } = useStore();

    const [sessionCode, setSessionCode] = useState("");
    const [characterNameFilter, setCharacterNameFilter] = useState("");
    const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

    useEffect(() => {
        charactersStore.fetchCharacters();
        gamesStore.clearError();
    }, [charactersStore, gamesStore]);

    const filteredCharacters = (charactersStore.getCharacters || []).filter((character) =>
        character.name.toLowerCase().includes(characterNameFilter.toLowerCase())
    );

    const isButtonDisabled =
        !sessionCode.trim() || !selectedCharacterId || gamesStore.IsLoading;

    const handleConnect = async () => {
        if (isButtonDisabled || !selectedCharacterId) return;

        try {
            const session = await gamesStore.enterSession(
                sessionCode.trim(),
                selectedCharacterId
            );

            if (session) {
                router.push(`/session/${session.id}`);
            }
        } catch (error: any) {
            Alert.alert(
                "Ошибка подключения",
                gamesStore.getError || "Не удалось подключиться к сессии"
            );
        }
    };

    return (
        <View style={[styles.container, isSmallScreen && { paddingTop: 120 }]}>
            {/* === ЛОГОТИП === */}
            <Text style={[styles.logo, { fontSize: dynamicLogo }]}>Critical Roll</Text>
            

            {/* === БЛОК 1: Код сессии === */}
            <View style={[
                styles.block, 
                { width: containerWidth, paddingHorizontal: dynamicBlockPadding, paddingVertical: dynamicBlockPadding }
                ]}>
                
                <TextInput
                    style={[styles.inputCentered, { fontSize: dynamicFont }]}
                    placeholder="Вставьте код для встречи"
                    placeholderTextColor={COLORS.textSecondary}
                    value={sessionCode}
                    onChangeText={setSessionCode}
                    textAlign="left"
                />
            </View>

            {/* === БЛОК 2: Выбор персонажа === */}
            <View style={[
                styles.block, 
                { width: containerWidth, paddingHorizontal: dynamicBlockPadding, paddingVertical: dynamicBlockPadding }
                ]}>
                <TextInput
                    style={[styles.inputCentered, { fontSize: dynamicFont }]}
                    placeholder="Введите имя персонажа"
                    placeholderTextColor={COLORS.textSecondary}
                    value={characterNameFilter}
                    onChangeText={setCharacterNameFilter}
                />

                <View style={styles.colorRow}>
                    {filteredCharacters && filteredCharacters.map((character) => (
                        <TouchableOpacity
                            key={character.id}
                            onPress={() => setSelectedCharacterId(character.id)}
                            style={[
                                styles.colorRect,
                                selectedCharacterId === character.id && styles.colorSelected,
                            ]}
                        >
                            {character.photo ? (
                                <Image
                                    source={{ uri: character.photo }}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: 11,
                                    }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: 11,
                                        backgroundColor: COLORS.primary,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: COLORS.textPrimary,
                                            fontSize: 24,
                                            fontFamily: "Roboto",
                                            fontWeight: "700",
                                        }}
                                    >
                                        {character.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={styles.addRect}
                        onPress={() => { router.push("/(app)/cabinet/character"); }}
                    >
                        <Plus size={36} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* === КНОПКА ПОДКЛЮЧЕНИЯ === */}
            <TouchableOpacity
                onPress={handleConnect}
                style={[
                    styles.buttonConnect,
                    isButtonDisabled && { opacity: 0.5 },
                ]}
                disabled={isButtonDisabled}
            >
                <Text style={styles.buttonText}>
                    {gamesStore.IsLoading ? "Подключение..." : "Подключиться"}
                </Text>
            </TouchableOpacity>

            {/* === ОТОБРАЖЕНИЕ ОШИБОК === */}
            {gamesStore.getError && (
                <Text style={{
                    color: "#FF4444",
                    marginTop: 16,
                    fontSize: 14,
                    fontFamily: "Roboto",
                    textAlign: "center",
                }}>
                    {gamesStore.getError}
                </Text>
            )}
        </View>
    );
};

export default observer(ConnectScreen);
