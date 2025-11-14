import { StyleSheet } from "react-native";
import { COLORS } from "../../constant/colors";

// размеры для вычислений
const AVATAR_HEIGHT = 270;
const INPUT_FONT_SIZE = 24;
const INPUT_HEIGHT = INPUT_FONT_SIZE * 3; // 3x выше текста
const INPUT_SPACING = (AVATAR_HEIGHT - 3 * INPUT_HEIGHT) / 2; // ≈ 39

export const characterStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
        paddingTop: 40,
    },

    sectionTitle: {
        color: COLORS.textSecondary,
        fontFamily: "Roboto",
        fontSize: 30,
        textAlign: "center",
        marginVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.textLowEmphasis,
        paddingBottom: 4,
        width: "100%",
        maxWidth: 904,
        alignSelf: "center",
    },

    block: {
        width: "100%",
        maxWidth: 904,
        alignSelf: "center",
        backgroundColor: "transparent",
        borderRadius: 0,
        padding: 0,
        marginBottom: 24,
    },

    // --- Основная инфа
    mainInfo: {
        flexDirection: "row",
        alignItems: "stretch",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 24,
        padding: 20,
    },

    avatar: {
        width: 190,
        height: AVATAR_HEIGHT,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
    },

    avatarContainer: { position: "relative" },

    avatarEdit: {
        position: "absolute",
        bottom: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 12,
        padding: 4,
    },

    infoFields: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        height: AVATAR_HEIGHT,
        minWidth: 300,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 22,
        flexWrap: "wrap",
        marginBottom: INPUT_SPACING,
    },

    input: {
        backgroundColor: COLORS.backgroundSecondary,
        color: COLORS.textPrimary,
        borderRadius: 8,
        borderWidth: 0,
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: INPUT_FONT_SIZE,
        lineHeight: INPUT_FONT_SIZE, // 100%
        letterSpacing: 0,
        paddingHorizontal: 16,
        height: INPUT_HEIGHT,
    },

    inputWide: {
        width: "100%",
    },

    inputHalf: {
        flex: 1,
        minWidth: 140,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 24,
        padding: 20,
    },

    statBox: {
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        aspectRatio: 1,
        minWidth: 120,
        maxWidth: 150,
        flexGrow: 1,
        flexBasis: "15%",
    },

    statValue: {
        fontSize: 34,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 40,
        width: 60,
        maxWidth: 60,
    },

    statBonus: {
        fontSize: 24,
        color: COLORS.textSecondary,
        fontWeight: "400",
        position: "absolute",
        right: -26,
        top: -6,
        
    },

    statLabel: {
        fontSize: 24,
        color: COLORS.textPrimary,
        textAlign: "center",
        marginTop: 8,
    },

    // ==================== ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ ====================

    secondaryBlock: {
        flexDirection: "column",
        gap: 24,
        padding: 20,
        width: "100%",
        maxWidth: 904,
        alignSelf: "center",
    },

    // общий ряд — модификаторы слева и карточки справа
    additionalRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        width: "100%",
        gap: 16,
    },

    // Левая часть (модификаторы)
    modifiersBlock: {
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 300,
        // maxWidth: 460,
    },

    // Правая часть (инициатива, КД, скорость, хиты, кнопки)
    rightColumn: {
        flexGrow: 0,
        flexShrink: 0,
        minWidth: 260,
        maxWidth: 320,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 12,
    },

    // сетка квадратных карточек
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center", // центрирование на мобилке
        alignItems: "center",
        gap: 12,
        width: "100%",
    },

    // квадратные карточки (Иниц., КД, Хиты и т.д.)
    smallStatBox: {
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        aspectRatio: 1,
        minWidth: 120,
        maxWidth: 150,
        flexGrow: 1,
        flexBasis: "30%", // чтобы на мобилке помещалось 3 в ряд
    },

    smallStatValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        textAlign: "center",
        width: 60,
        maxWidth: 60,
    },

    smallStatLabel: {
        fontSize: 24,
        color: COLORS.textSecondary,
        marginTop: 4,
    },

    //   кнопки "Предыстория" и "Подробнее"
    actionButton: {
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        width: "100%",
        padding: 8,
        aspectRatio: 2,
        minWidth: 260,
        flexGrow: 1,
        flexBasis: "15%",
    },

    actionButtonText: {
        color: COLORS.textPrimary,
        fontSize: 24,
        fontWeight: "500",
    },
});