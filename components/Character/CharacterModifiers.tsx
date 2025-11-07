import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { COLORS } from "../../constant/colors";

const CharacterModifiers = () => {
    const modifiers = [
        { label: "Атлетика", attr: "сил", color: COLORS.strength },
        { label: "Акробатика", attr: "лов", color: COLORS.dexterity },
        { label: "Ловкость рук", attr: "лов", color: COLORS.dexterity },
        { label: "Скрытность", attr: "лов", color: COLORS.dexterity },
        { label: "Анализ", attr: "инт", color: COLORS.intelligence },
        { label: "История", attr: "инт", color: COLORS.intelligence },
        { label: "Магия", attr: "инт", color: COLORS.intelligence },
        { label: "Природа", attr: "инт", color: COLORS.intelligence },
        { label: "Религия", attr: "инт", color: COLORS.intelligence },
        { label: "Внимательность", attr: "мдр", color: COLORS.wisdom },
        { label: "Выживание", attr: "мдр", color: COLORS.wisdom },
        { label: "Медицина", attr: "мдр", color: COLORS.wisdom },
        { label: "Проницательность", attr: "мдр", color: COLORS.wisdom },
        { label: "Уход за животными", attr: "мдр", color: COLORS.wisdom },
        { label: "Выступление", attr: "хар", color: COLORS.charisma },
        { label: "Запугивание", attr: "хар", color: COLORS.charisma },
        { label: "Обман", attr: "хар", color: COLORS.charisma },
        { label: "Убеждение", attr: "хар", color: COLORS.charisma },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Модификаторы</Text>

            <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={true}>
                {modifiers.map((mod, index) => (
                    <View key={index} style={styles.row}>
                        <View style={styles.dot} />
                        <Text style={[styles.value, { color: mod.color }]}>+9</Text>
                        <Text style={styles.name}>
                            {mod.label} (<Text style={{ color: mod.color }}>{mod.attr}</Text>)
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default CharacterModifiers;

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexGrow: 1,
        flexShrink: 1,
        maxWidth: "100%",
        height: 820,
        overflow: "hidden",
    },

    scrollArea: {
        flex: 1,
    },

    title: {
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 24,
        lineHeight: 24,
        letterSpacing: 0,
        textAlign: "center",
        marginBottom: 12,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.textPrimary,
    },

    value: {
        fontSize: 24,
        fontWeight: "500",
    },

    name: {
        fontSize: 24,
        color: COLORS.textSecondary,
        flexShrink: 1,
    },
});