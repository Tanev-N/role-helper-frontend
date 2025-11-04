import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constant/colors";

const CharacterEquipment = () => {
    const items = [
        { name: "Меч", color: COLORS.primary },
        { name: "Щит", color: COLORS.wisdom },
        { name: "Зелье лечения", color: COLORS.intelligence },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Снаряжение</Text>
            <View style={styles.itemsContainer}>
                {items.map((item) => (
                    <View key={item.name} style={[styles.item, { backgroundColor: item.color }]}>
                        <Text style={styles.itemText}>{item.name}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default CharacterEquipment;

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
    },
    title: {
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
        fontSize: 24,
        marginBottom: 8,
    },
    itemsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    item: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    itemText: {
        color: COLORS.textPrimary,
        fontSize: 18,
    },
});