import { COLORS } from "@/constant/colors";
import { imagesUrlDefault } from "@/constant/default_images";
import useStore from "@/hooks/store";
import { Character } from "@/stores/Characters/api";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ImageBackground,
    LayoutChangeEvent,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View
} from "react-native";
import CharacterModal from "./Character/CharacterModal";

type User = {
    id: number;
    name: string;
    characterId?: string;
    photo?: string;
};

const ChatUsers = () => {
    const { width } = useWindowDimensions();
    const [containerWidth, setContainerWidth] = useState(0);
    const [modalActiveCharacterId, setModalActiveCharacterId] = useState<string | null>(null);
    const [deathSaves, setDeathSaves] = useState<Record<string, boolean[]>>({});

    const isMobile = width < 1300;
    const { gamesStore, charactersStore } = useStore();
    const router = useRouter();

    // Подгружаем краткий список персонажей один раз (имя/фото),
    // чтобы не делать N запросов по одному id при каждом обновлении игроков.
    useEffect(() => {
        charactersStore.fetchCharacters();
    }, [charactersStore]);

    // Если бекенд прислал вложенный character — сохраняем его сразу (самый актуальный источник).
    // Важно: здесь НЕ делаем массовые fetchCharacterById по каждому игроку — это может фризить UI.
    useEffect(() => {
        const sessionPlayers = gamesStore.getSessionPlayers;
        if (!sessionPlayers || sessionPlayers.length === 0) return;

        sessionPlayers.forEach((player) => {
            const characterFromAPI = player.character;

            if (characterFromAPI) {
                charactersStore.updateCharacterFromAPI(characterFromAPI);
            }
        });
    }, [gamesStore.getSessionPlayers, charactersStore]);

    // Получаем игроков из store и преобразуем их в формат User.
    // НЕ используем useMemo, чтобы MobX нормально реагировал на изменения character.photo.
    const sessionPlayers = gamesStore.getSessionPlayers;
    const users: User[] =
        !sessionPlayers || sessionPlayers.length === 0
            ? []
            : sessionPlayers.map((player) => {
                  const charId = String(player.character_id);
                  const characterFromAPI = player.character;
                  const fullCharacter = characterFromAPI
                      ? characterFromAPI
                      : charactersStore.getCharacterById(charId);
                  const shortCharacter =
                      charactersStore.getCharacters?.find((char) => char.id === charId) || null;

                  const name =
                      characterFromAPI?.name ||
                      fullCharacter?.name ||
                      shortCharacter?.name ||
                      `Игрок ${player.id}`;
                  const photo =
                      characterFromAPI?.photo || fullCharacter?.photo || shortCharacter?.photo;

                  return {
                      id: player.id,
                      name,
                      characterId: charId,
                      photo,
                  };
              });

    useEffect(() => {
        if (modalActiveCharacterId && !charactersStore.getCharacterById(modalActiveCharacterId)) {
            const sessionPlayers = gamesStore.getSessionPlayers;
            const playerWithCharacter = sessionPlayers.find(
                (p) => String(p.character_id) === modalActiveCharacterId && p.character
            );
            if (playerWithCharacter?.character) {
                charactersStore.updateCharacterFromAPI(playerWithCharacter.character);
            } else {
                charactersStore.fetchCharacterById(modalActiveCharacterId);
            }
        }
    }, [modalActiveCharacterId, charactersStore, gamesStore.getSessionPlayers]);

    const modalCharacter =
        (modalActiveCharacterId &&
            charactersStore.getCharacterById(modalActiveCharacterId)) ||
        null;

    const isModalLoading = modalActiveCharacterId !== null && !modalCharacter;

    const toggleDeathSave = (characterId: string, index: number) => {
        setDeathSaves((prev: Record<string, boolean[]>) => {
            const current = prev[characterId] || [false, false, false];
            const updated = [...current];
            updated[index] = !updated[index];
            return { ...prev, [characterId]: updated };
        });
    };

    const calcMod = (ability?: number | null) => {
        if (ability === undefined || ability === null) return null;
        return Math.floor((ability - 10) / 2);
    };

    const getSkillValue = (name: string) => {
        const skill = modalCharacter?.skills?.find(
            (s: { name: string; modifier?: number | null }) => s.name === name
        );
        if (!skill) return null;
        return skill.modifier ?? 0;
    };

    const acrobatics = getSkillValue("Акробатика") ?? calcMod(modalCharacter?.dexterity);
    const passivePerception =
        getSkillValue("Внимательность") !== null
            ? 10 + (getSkillValue("Внимательность") ?? 0)
            : modalCharacter?.wisdom
                ? 10 + calcMod(modalCharacter.wisdom)!
                : null;


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
                if (style.parentNode) style.parentNode.removeChild(style);
            };
        }
    }, []);

    const modalBody = isModalLoading ? (
        <View style={styles.modalLoading}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.modalLoadingText}>Загрузка персонажа…</Text>
        </View>
    ) : modalCharacter ? (
        <StatsContent
            character={modalCharacter}
            passivePerception={passivePerception}
            acrobatics={acrobatics}
            deathSaves={deathSaves}
            onToggleDeathSave={toggleDeathSave}
            onOpenCharacter={() => {
                router.push(`/(app)/cabinet/character/${modalCharacter.id}`);
                setModalActiveCharacterId(null);
            }}
        />
    ) : (
        <View style={styles.modalLoading}>
            <Text style={styles.modalLoadingText}>Персонаж не найден</Text>
        </View>
    );

    if (isMobile) {
        return (
            <>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    style={styles.scrollMobile}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: 22,
                        paddingHorizontal: 24,
                        paddingVertical: 16,
                    }}
                >
                    {users.map((u) => (
                        <Pressable
                            key={`${u.id}-${u.photo || "default"}`}
                            style={[styles.userBoxMobile]}
                            onPress={() => {
                                if (u.characterId) setModalActiveCharacterId(String(u.characterId));
                            }}
                        >
                            <ImageBackground
                                key={`${u.id}-${u.photo || "default"}`}
                                source={
                                    u.photo
                                        ? { uri: u.photo }
                                        : { uri: imagesUrlDefault.charactersUrl }
                                }
                                style={styles.userBoxMobile}
                                resizeMode="cover"
                            />
                            <Text style={styles.userNameMobile}>{u.name}</Text>
                        </Pressable>
                    ))}
                </ScrollView>

                <CharacterModal
                    visible={modalActiveCharacterId !== null}
                    onClose={() => setModalActiveCharacterId(null)}
                    title={modalCharacter?.name || (isModalLoading ? "Загрузка…" : "Персонаж")}
                >
                    {modalBody}
                </CharacterModal>
            </>
        );
    }

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
        <>
            <ScrollView
                style={styles.scrollDesktop}
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
                showsVerticalScrollIndicator={true}
            >
                <View style={[styles.desktopContainer, { gap: totalGap }]} onLayout={onLayout}>
                    {columns.map((col, colIndex) => (
                        <View key={colIndex} style={[styles.column, { gap: totalGap }]}>
                            {col.map((u) => (
                                <Pressable
                                    key={`${u.id}-${u.photo || "default"}`}
                                    style={[
                                        styles.userBox,
                                        { width: boxSize, height: boxSize },
                                    ]}
                                    onPress={() => {
                                        if (u.characterId) setModalActiveCharacterId(String(u.characterId));
                                    }}
                                >
                                    <ImageBackground
                                        key={`${u.id}-${u.photo || "default"}`}
                                        source={
                                            u.photo
                                                ? { uri: u.photo }
                                                : { uri: imagesUrlDefault.charactersUrl }
                                        }
                                        style={styles.userBox}
                                        imageStyle={{ borderRadius: 8 }}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.userOverlay} />
                                    <Text style={styles.userName}>{u.name}</Text>
                                </Pressable>
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>

            <CharacterModal
                visible={modalActiveCharacterId !== null}
                onClose={() => setModalActiveCharacterId(null)}
                title={modalCharacter?.name || (isModalLoading ? "Загрузка…" : "Персонаж")}
            >
                {modalBody}
            </CharacterModal>
        </>
    );
};

export const StatsContent = ({
    character,
    passivePerception,
    acrobatics,
    deathSaves,
    onToggleDeathSave,
    onOpenCharacter,
}: {
    character: Character;
    passivePerception: number | null;
    acrobatics: number | null;
    deathSaves: Record<string, boolean[]>;
    onToggleDeathSave: (id: string, idx: number) => void;
    onOpenCharacter: () => void;
}) => {
    const deathTrack = deathSaves[String(character.id)] || [false, false, false];

    const statCards = [
        { label: "КД", value: character.armor_class ?? "—" },
        { label: "Внимател.", value: passivePerception ?? "—" },
        { label: "Сила", value: character.strength ?? "—" },
        { label: "Акробатика", value: acrobatics ?? "—" },
        { label: "Инициатива", value: character.initiative ?? "—" },
        { label: "Скорость", value: character.speed ?? "—" },
    ];

    return (
        <View style={styles.modalWrapper}>
            <Text style={styles.modalTitle}>Характеристики {character.name}</Text>

            <View style={styles.statsGrid}>
                {statCards.map((card) => (
                    <View key={card.label} style={styles.statCard}>
                        <Text style={styles.statLabel}>{card.label}</Text>
                        <Text style={styles.statValue}>{card.value}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.deathSaves}>
                <Text style={styles.deathTitle}>Спас броски</Text>
                <View style={styles.deathRow}>
                    {deathTrack.map((active, idx) => (
                        <Pressable
                            key={idx}
                            style={[styles.deathDot, active && styles.deathDotActive]}
                            onPress={() => onToggleDeathSave(String(character.id), idx)}
                        />
                    ))}
                </View>
            </View>

            <Pressable style={styles.moreButton} onPress={onOpenCharacter}>
                <Text style={styles.moreButtonText}>Подробнее</Text>
            </Pressable>
        </View>
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
        width: "100%",
        height: "100%",
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
        flexGrow: 0,
        width: "100%",
        maxHeight: 160,
    },
    userBoxMobile: {
        width: 100,
        height: 100,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
    },
    userNameMobile: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 20,
        lineHeight: 20,
        color: COLORS.textPrimary,
        textAlign: "center",
    },
    userOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 8,
    },
    modalLoading: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        gap: 12,
    },
    modalLoadingText: {
        color: COLORS.textSecondary,
        fontFamily: "Roboto",
        fontSize: 16,
    },
    /** Modal */
    modalWrapper: {
        gap: 16,
    },
    modalTitle: {
        fontFamily: "Roboto",
        fontWeight: "500",
        fontSize: 22,
        color: COLORS.textPrimary,
        textAlign: "center",
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: 12,
    },
    statCard: {
        width: "48%",
        backgroundColor: "#1F2023",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    statLabel: {
        color: COLORS.textSecondary,
        fontFamily: "Roboto",
        fontSize: 16,
        marginBottom: 6,
    },
    statValue: {
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
        fontWeight: "600",
        fontSize: 24,
    },
    deathSaves: {
        backgroundColor: "#1F2023",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: "center",
        gap: 10,
    },
    deathTitle: {
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
        fontSize: 18,
    },
    deathRow: {
        flexDirection: "row",
        gap: 14,
    },
    deathDot: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: COLORS.textPrimary,
        backgroundColor: "transparent",
    },
    deathDotActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    moreButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
    },
    moreButtonText: {
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
        fontSize: 18,
        fontWeight: "600",
    },
});
