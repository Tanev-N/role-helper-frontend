import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { characterStyles as styles } from "./styles";
import CharacterModifiers from "./CharacterModifiers";
import CharacterEquipment from "./CharacterEquipment";
import CharacterModal from "./CharacterModal";
import { COLORS } from "../../constant/colors";

const CharacterSecondary = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<"Предыстория" | "Подробнее" | null>(null);

    const openModal = (type: "Предыстория" | "Подробнее") => {
        setModalType(type);
        setModalVisible(true);
    };

    const closeModal = () => setModalVisible(false);

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
                        {["Иниц.", "КД", "Скорость", "Хиты", "Врем. хиты", "Кость хитов"].map((item) => (
                            <View key={item} style={styles.smallStatBox}>
                                <Text style={styles.smallStatValue}>99</Text>
                                <Text style={styles.smallStatLabel}>{item}</Text>
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
                    <Text style={{ color: COLORS.textSecondary, fontSize: 16, lineHeight: 22 }}>
                        Родился в маленькой деревне, вырос среди приключений и мечтал стать героем.{"\n\n"}
                        Теперь он стоит на пороге новых испытаний, готовый доказать свою доблесть.
                    </Text>
                )}
                {modalType === "Подробнее" && (
                    <Text style={{ color: COLORS.textSecondary, fontSize: 16, lineHeight: 22 }}>
                        Здесь можно добавить дополнительную информацию о персонаже: способности, заклинания,
                        снаряжение и т.д.
                    </Text>
                )}
            </CharacterModal>
        </View>
    );
};

export default CharacterSecondary;