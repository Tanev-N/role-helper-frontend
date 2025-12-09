import React, { useState } from "react";
import { Pressable, Image, Text } from "react-native";
import { router } from "expo-router";
import { COLORS } from "@/constant/colors";
import styles from "./style";

export function IconBox({
    label,
    source,
    path,
    buttonSize,
    iconSize,
    textSize,
}: {
    label: string;
    source: any;
    path: any;
    buttonSize: number;
    iconSize: number;
    textSize: number;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <Pressable
            onHoverIn={() => setHovered(true)}
            onHoverOut={() => setHovered(false)}
            onPress={() => router.push(path)}
            style={[
                styles.iconContainer,
                { width: buttonSize, height: buttonSize, padding: 12 },
                hovered && { borderWidth: 2, borderColor: COLORS.primary },
            ]}
        >
            <Image
                source={source}
                style={{ width: iconSize, height: iconSize, resizeMode: "contain" }}
            />
            <Text style={[styles.iconText, { fontSize: textSize }]}>{label}</Text>
        </Pressable>
    );
}
