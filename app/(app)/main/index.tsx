import { observer } from "mobx-react-lite";
import { View, Text, Image, StyleSheet, Platform, Pressable } from "react-native";
import { useState } from 'react';
import { ICONS } from "@/constant/icons";
import { COLORS } from "@/constant/colors";
import { SIZES } from "@/constant/sizes";
import { router } from "expo-router";

const MainScreen = observer(() => {
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>Critical Roll</Text>
            <View style={styles.buttonContainer}>
                <IconBox label="Подключиться" source={ICONS.connect} path={"/(app)/connect"} />
                <IconBox label="Создать сессию" source={ICONS.createSession} path={"/(app)/session"} />
            </View>
        </View>
    );
});

export default MainScreen;
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
        backgroundColor: COLORS.backgroundPrimary,
    },
    title: {
        fontSize: 64,
        color: COLORS.primary,
        fontFamily: "Uncial Antiqua"

    },
    iconContainer: {
        width: '45%',          // или 45%
        aspectRatio: 1,        // чтобы сохранялась квадратная форма
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SIZES.paddingHorizontalLarge,
        paddingVertical: SIZES.paddingVerticalLarge,
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: SIZES.borderRadius,
        gap: 10,
    },
    icon: {
        width: SIZES.iconLarge,
        height: SIZES.iconLarge,
    },
    iconText: {
        fontSize: 20,
        color: COLORS.textSecondary,
        flexWrap: 'nowrap',
        textAlign: 'center',
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    }
});

function IconBox({ label, source, path = "/" }: { label: string; source: any; path: any }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Pressable
            onHoverIn={() => setHovered(true)}
            onHoverOut={() => setHovered(false)}
            onPress={() => { router.push(path) }}
            style={[styles.iconContainer, hovered ? { borderWidth: 2, borderColor: COLORS.primary } : {}]}
        >
            <Image source={source} style={styles.icon} accessibilityLabel={`${label} icon`} />
            <Text style={[styles.iconText]}>{label}</Text>
        </Pressable>
    );
}