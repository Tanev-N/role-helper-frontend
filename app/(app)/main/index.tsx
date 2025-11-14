import { observer } from "mobx-react-lite";
import { View, Text, Image, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { useState } from "react";
import { ICONS } from "@/constant/icons";
import { COLORS } from "@/constant/colors";
import { SIZES } from "@/constant/sizes";
import { router } from "expo-router";

import styles from "@/components/Main/style";
import { IconBox } from "@/components/Main/MainComponents";

const MainScreen = observer(() => {
    const { width } = useWindowDimensions();
    const isTablet = width < 1300;
    const isMobile = width < 768;
    const isSmallMobile = width < 420;

    /** === АДАПТИВНЫЕ РАЗМЕРЫ === */
    const dynamicLogo = isSmallMobile
        ? 40
        : isMobile
        ? 52
        : isTablet
        ? 60
        : 64;

    const dynamicButtonSize = isSmallMobile
        ? 130
        : isMobile
        ? 160
        : 200;

    const dynamicIconSize = dynamicButtonSize * 0.45;

    const dynamicButtonText = isSmallMobile
        ? 18
        : isMobile
        ? 20
        : 22;

    const dynamicGap = isMobile ? 30 : 50;

    return (
        <View style={[styles.mainContainer, { gap: dynamicGap }]}>
            {/* === ЗАГОЛОВОК === */}
            <Text style={[styles.title, { fontSize: dynamicLogo }]}>
                Critical Roll
            </Text>

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
                    buttonSize={dynamicButtonSize}
                    iconSize={dynamicIconSize}
                    textSize={dynamicButtonText}
                />

                <IconBox
                    label="Создать сессию"
                    source={ICONS.createSession}
                    path={"/(app)/session"}
                    buttonSize={dynamicButtonSize}
                    iconSize={dynamicIconSize}
                    textSize={dynamicButtonText}
                />
            </View>

            {/* === ССЫЛКА НА ПРАВИЛА === */}
            <View
                style={[
                    styles.rulesContainer,
                    isMobile && { paddingHorizontal: 24, width: "100%" },
                ]}
            >
                <Text style={[styles.rulesText, { flexWrap: "wrap", width: "100%", textAlign: "center" }]}>
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