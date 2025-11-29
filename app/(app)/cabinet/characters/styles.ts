import { StyleSheet } from "react-native";
import { COLORS } from "@/constant/colors";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
    },

    screenContent: {
        alignItems: "center",
        paddingBottom: 32,
    },

    title: {
        fontFamily: "Roboto",
        fontWeight: "400",
        color: COLORS.textSecondary,
        textAlign: "center",
        marginBottom: 8,
    },

    titleDivider: {
        height: 1,
        backgroundColor: COLORS.textLowEmphasis,
        marginBottom: 24,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },

    cardWrapper: {
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "transparent",
    },

    avatarContainer: {
        width: "100%",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: "hidden",
    },

    avatarImage: {
        width: "100%",
        height: "100%",
    },

    nameContainer: {
        width: "100%",
        backgroundColor: "#2C2C31",
        justifyContent: "center",
        alignItems: "center",
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        paddingHorizontal: 8,
    },

    nameText: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 30,
        lineHeight: 30,
        textAlign: "center",
        color: "#BEBEBE",
    },
});