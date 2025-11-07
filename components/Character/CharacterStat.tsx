import React from "react";
import { View, Text } from "react-native";
import { characterStyles as styles } from "./styles";

const CharacterStat = ({ name, color }: { name: string; color: string }) => (
    <View style={styles.statBox}>
        <Text style={[styles.statValue, { color }]}>99</Text>
        <Text style={styles.statBonus}>+9</Text>
        <Text style={styles.statLabel}>{name}</Text>
    </View>
);

export default CharacterStat;
