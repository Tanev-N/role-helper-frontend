import { StyleSheet } from "react-native";
import { COLORS } from "@/constant/colors";

export const connectStyles = StyleSheet.create({
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

    input: {
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
        fontSize: 30,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.textLowEmphasis,
        marginBottom: 24,
        paddingVertical: 8,
    },

    inputCentered: {
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
        fontSize: 30,
        textAlign: "left",
    },

    colorRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
        marginTop: 8,
        justifyContent: "space-between",
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

    buttonConnect: {
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