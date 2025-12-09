import { StyleSheet } from "react-native";
import { COLORS } from "@/constant/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },

    logo: {
        fontSize: 64,
        fontFamily: "UncialAntiqua",
        fontWeight: "400",
        color: COLORS.primary,
        marginBottom: 44,
        textAlign: "center",
    },

    block: {
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        paddingHorizontal: 24,
        paddingVertical: 24,
        marginBottom: 24,
        maxWidth: "100%",
    },

    label: {
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
        fontSize: 30,
        marginBottom: 16,
    },

    input: {
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
        fontSize: 24,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.textLowEmphasis,
        marginBottom: 24,
        paddingVertical: 6,
        width: "100%",
    },

    // Обновленный стиль для горизонтального скролла
    scrollHorizontal: {
        width: "100%",
        maxHeight: 120,
    },

    scrollHorizontalContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },

    // Удаляем colorRow и заменяем на стиль для контейнера скролла
    colorRow: {
        width: "100%",
        height: 110, // Высота для карточек + отступы
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },

    colorRect: {
        width: 160,
        height: 90,
        borderRadius: 11,
        justifyContent: "center",
        alignItems: "center",
    },

    colorSelected: {
        borderWidth: 4,
        borderColor: COLORS.textPrimary,
    },

    addRect: {
        width: 160,
        height: 90,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: COLORS.textSecondary,
        justifyContent: "center",
        alignItems: "center",
    },

    buttonCreateSession: {
        width: 297,
        height: 90,
        backgroundColor: COLORS.primary,
        borderRadius: 11,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 32,
    },

    buttonText: {
        color: COLORS.textPrimary,
        fontSize: 30,
        fontFamily: "Roboto",
        fontWeight: "500",
    },
});