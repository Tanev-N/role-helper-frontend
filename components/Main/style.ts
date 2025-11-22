import { StyleSheet } from "react-native";
import { COLORS } from "@/constant/colors";
import { SIZES } from "@/constant/sizes";

export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.backgroundPrimary,
        paddingTop: 100,
    },

    title: {
        fontFamily: "UncialAntiqua",
        fontWeight: "400",
        color: COLORS.primary,
        marginBottom: 20,
        textAlign: "center",
    },

    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: SIZES.borderRadius,
        gap: 14,
    },

    iconText: {
        color: COLORS.textSecondary,
        flexWrap: "nowrap",
        textAlign: "center",
        fontFamily: "Roboto",
        fontWeight: "400",
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },

    rulesContainer: {
        marginTop: 20,
        maxWidth: 600,
        alignItems: "center",
        paddingHorizontal: 20,
    },

    rulesText: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 20,
        color: COLORS.textLowEmphasis,
        textAlign: "center",
    },

    rulesLink: {
        color: COLORS.textLowEmphasis,
        textDecorationLine: "underline",
    },
});
