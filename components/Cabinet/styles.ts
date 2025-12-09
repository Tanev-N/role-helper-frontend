import { StyleSheet } from "react-native";
import { COLORS } from "@/constant/colors";
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
        paddingHorizontal: 16, 
    },

    // Header
    headerBlock: {
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,            
        paddingHorizontal: 12,           
        marginBottom: 20,
    },

    avatar: {
        width: 70,      
        height: 70,
        borderRadius: 35,
        backgroundColor: "#0075FF",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 12,
    },
    avatarImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    avatarText: {
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 26,     
        lineHeight: 26,
    },

    editIcon: {
        position: "absolute",
        bottom: -2,
        right: -2,
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 14,
        padding: 4,
    },

    userName: {
        marginLeft: 24,
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 24,
        lineHeight: 24,
        flexShrink: 1,  
    },

    logoutButton: { marginLeft: "auto", marginRight: 12 },

    // ================= BLOCKS =================
    sectionBlock: {
        backgroundColor: "rgba(44,44,49,1)",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        paddingVertical: 14, 
        paddingHorizontal: 14,
        marginBottom: 20,

        width: "100%",
        alignSelf: "center",

        maxWidth: 904,
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 8,
    },

    sectionTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 20,   
    },

    sectionTitle: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 20,    
        color: COLORS.textPrimary,
        lineHeight: 20,
    },

    sectionSubtitle: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 16,     
        color: COLORS.textPrimary,
        opacity: 0.8,
        marginTop: 4,
    },

    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#e3e3e380",
        justifyContent: "center",
        alignItems: "center",
    },

    divider: {
        height: 1,
        backgroundColor: "#ffffff33",
        marginHorizontal: 20,   
        marginVertical: 12,
    },

    // ================= GRID =================
    itemsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: 10,
        justifyContent: 'flex-start', 
        width: "100%",
    },

    characterSquare: {
        borderRadius: 8,
    },

    addSquare: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(227,227,227,1)",
        justifyContent: "center",
        alignItems: "center",
    },

    // Миры + добавление
    worldRect: { borderRadius: 8 },
    addRect: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(227,227,227,1)",
        justifyContent: "center",
        alignItems: "center",
    },
});