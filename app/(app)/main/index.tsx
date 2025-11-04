import { observer } from "mobx-react-lite";
import { View, Text, Image, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { useState } from "react";
import { ICONS } from "@/constant/icons";
import { COLORS } from "@/constant/colors";
import { SIZES } from "@/constant/sizes";
import { router } from "expo-router";

const MainScreen = observer(() => {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        <View style={styles.mainContainer}>
            {/* === ЗАГОЛОВОК === */}
            <Text style={styles.title}>Critical Roll</Text>

            {/* === КНОПКИ === */}
            <View
                style={[
                styles.buttonContainer,
                isMobile && { flexDirection: "column", gap: 30 },
                ]}
            >
                <IconBox
                    label="Подключиться"
                    source={ICONS.connect}
                    path={"/(app)/connect"}
                />
                <IconBox
                    label="Создать сессию"
                    source={ICONS.createSession}
                    path={"/(app)/session"}
                />
            </View>

            {/* === ССЫЛКА НА ПРАВИЛА === */}
            <View style={styles.rulesContainer}>
                <Text style={styles.rulesText}>
                    ознакомься с правилами игры —{" "}
                    <Text
                        style={styles.rulesLink}
                        onPress={() => router.push("https://free-dnd.ttrpg.ru/")}
                    >
                        тык
                    </Text>
                </Text>
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
        paddingTop: 60,
    },
    title: {
        fontSize: 64,
        fontFamily: "UncialAntiqua",
        fontWeight: "400",
        color: COLORS.primary,
        marginBottom: 44,
        textAlign: "center",
    },
    iconContainer: {
        width: "45%",
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
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
        flexWrap: "nowrap",
        textAlign: "center",
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },
    rulesContainer: {
        marginTop: 40,
    },
    rulesText: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 24,
        color: COLORS.textLowEmphasis,
        textAlign: "center",
    },
    rulesLink: {
        color: COLORS.textLowEmphasis,
        textDecorationLine: "underline",
    },
});

function IconBox({
    label,
    source,
    path = "/",
}: {
    label: string;
    source: any;
    path: any;
}) {
    const [hovered, setHovered] = useState(false);

    return (
    <Pressable
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onPress={() => {
            router.push(path);
        }}
        style={[
            styles.iconContainer,
            hovered ? { borderWidth: 2, borderColor: COLORS.primary } : {},
        ]}
    >
        <Image source={source} style={styles.icon} accessibilityLabel={`${label} icon`} />
        <Text style={[styles.iconText]}>{label}</Text>
    </Pressable>
  );
}