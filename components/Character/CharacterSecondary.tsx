import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { characterStyles as styles } from "./styles";
import CharacterModifiers from "./CharacterModifiers";
import CharacterEquipment from "./CharacterEquipment";
import CharacterModal from "./CharacterModal";
import { COLORS } from "../../constant/colors";

interface CharacterSecondaryProps {
    initiative: string;
    armorClass: string;
    speed: string;
    hitPoints: string;
    tempHitPoints: string;
    hitDice: string;
    background: string;
    features: string;
    onInitiativeChange: (value: string) => void;
    onArmorClassChange: (value: string) => void;
    onSpeedChange: (value: string) => void;
    onHitPointsChange: (value: string) => void;
    onTempHitPointsChange: (value: string) => void;
    onHitDiceChange: (value: string) => void;
    onBackgroundChange: (value: string) => void;
    onFeaturesChange: (value: string) => void;
    dexterityMod: number;
}

const CharacterSecondary = ({
    initiative,
    armorClass,
    speed,
    hitPoints,
    tempHitPoints,
    hitDice,
    background,
    features,
    onInitiativeChange,
    onArmorClassChange,
    onSpeedChange,
    onHitPointsChange,
    onTempHitPointsChange,
    onHitDiceChange,
    onBackgroundChange,
    onFeaturesChange,
    dexterityMod,
}: CharacterSecondaryProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<"Предыстория" | "Подробнее" | null>(null);

    const openModal = (type: "Предыстория" | "Подробнее") => {
        setModalType(type);
        setModalVisible(true);
    };

    const closeModal = () => setModalVisible(false);

    const stats = [
        { label: "Иниц.", value: initiative, onChange: onInitiativeChange, placeholder: dexterityMod.toString() },
        { label: "КД", value: armorClass, onChange: onArmorClassChange, placeholder: "0" },
        { label: "Скорость", value: speed, onChange: onSpeedChange, placeholder: "30" },
        { label: "Хиты", value: hitPoints, onChange: onHitPointsChange, placeholder: "0" },
        { label: "Врем. хиты", value: tempHitPoints, onChange: onTempHitPointsChange, placeholder: "0" },
        { label: "Кость хитов", value: hitDice, onChange: onHitDiceChange, placeholder: "1d10" },
    ];

    return (
        <View style={styles.secondaryBlock}>
            {/* === ВЕРХНИЙ РЯД === */}
            <View style={styles.additionalRow}>
                {/* Левая часть — модификаторы */}
                <View style={styles.modifiersBlock}>
                    <CharacterModifiers />
                </View>

                {/* Правая часть — характеристики и кнопки */}
                <View style={styles.rightColumn}>
                    <View style={styles.statsGrid}>
                        {stats.map((stat) => (
                            <View key={stat.label} style={styles.smallStatBox}>
                                <TextInput
                                    style={styles.smallStatValue}
                                    value={stat.value}
                                    onChangeText={stat.onChange}
                                    placeholder={stat.placeholder}
                                    placeholderTextColor={COLORS.textSecondary}
                                    keyboardType={stat.label === "Кость хитов" ? "default" : "numeric"}
                                />
                                <Text style={styles.smallStatLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => openModal("Предыстория")}
                    >
                        <Text style={styles.actionButtonText}>Предыстория</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => openModal("Подробнее")}
                    >
                        <Text style={styles.actionButtonText}>Подробнее</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* === Снаряжение === */}
            <CharacterEquipment />

            {/* === Модалка === */}
            <CharacterModal visible={modalVisible} onClose={closeModal} title={modalType || ""}>
                {modalType === "Предыстория" && (
                    <TextInput
                        style={{
                            color: COLORS.textSecondary,
                            fontSize: 16,
                            lineHeight: 22,
                            minHeight: 200,
                            textAlignVertical: "top",
                        }}
                        multiline
                        placeholder="Введите предысторию персонажа..."
                        placeholderTextColor={COLORS.textSecondary}
                        value={background}
                        onChangeText={onBackgroundChange}
                    />
                )}
                {modalType === "Подробнее" && (
                    <TextInput
                        style={{
                            color: COLORS.textSecondary,
                            fontSize: 16,
                            lineHeight: 22,
                            minHeight: 200,
                            textAlignVertical: "top",
                        }}
                        multiline
                        placeholder="Введите дополнительную информацию о персонаже: способности, заклинания, снаряжение и т.д."
                        placeholderTextColor={COLORS.textSecondary}
                        value={features}
                        onChangeText={onFeaturesChange}
                    />
                )}
            </CharacterModal>
        </View>
    );
};

export default CharacterSecondary;