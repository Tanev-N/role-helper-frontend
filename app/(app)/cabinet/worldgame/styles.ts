import { StyleSheet } from "react-native";
import { COLORS } from "@/constant/colors";

export const worldGameStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
    },
    screenContent: {
        alignItems: "center",
        paddingBottom: 32,
    },

    container: {
        alignItems: "center",
        gap: 16,
    },

    worldCard: {
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "transparent",
    },
    worldImageContainer: {
        width: "100%",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: "hidden",
    },
    worldImage: {
        width: "100%",
        height: "100%",
    },
    worldNameContainer: {
        width: "100%",
        backgroundColor: "#2C2C31",
        justifyContent: "center",
        alignItems: "center",
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        paddingHorizontal: 8,
    },
    worldNameText: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 30,
        lineHeight: 30,
        textAlign: "center",
        color: "#BEBEBE",
    },

    sectionTitle: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 24,
        color: COLORS.textSecondary,
        textAlign: "center",
    },
    worldStoryCard: {
        width: "100%",
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    worldStoryText: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 22,
        color: COLORS.textPrimary,
    },

    sectionDivider: {
        width: "100%",
        height: 1,
        backgroundColor: COLORS.textLowEmphasis,
        marginTop: 8,
        marginBottom: 16,
    },

    sessionCard: {
        width: "100%",
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        paddingHorizontal: 24,
        paddingVertical: 16,
        marginBottom: 16,
    },
    sessionTitle: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 20,
        color: COLORS.textSecondary,
        textAlign: "center",
        marginBottom: 8,
    },
    sessionRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    sessionPreview: {
        flex: 1,
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 22,
        color: COLORS.textPrimary,
        marginRight: 12,
    },
    sessionArrowHitbox: {
        width: 40,
        justifyContent: "center",
        alignItems: "center",
    },
});