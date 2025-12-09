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

    scrollHorizontal: {
        width: "100%",
    },

    scrollHorizontalContent: {
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        gap: 16,
        paddingVertical: 4,
        paddingRight: 8,
    },

    colorRect: {
        width: 92,
        height: 92,
        borderRadius: 11,
    },

    colorSelected: {
        borderWidth: 4,
        borderColor: COLORS.textPrimary,
    },

    addRect: {
        width: 92,
        height: 92,
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