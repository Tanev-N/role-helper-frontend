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
        lineHeight: INPUT_FONT_SIZE,
        letterSpacing: 0,
        paddingHorizontal: 16,
        height: INPUT_HEIGHT,
        flex: 1,
        paddingVertical: 6,
        outlineStyle: "none",
        outlineWidth: 0,
    },

    inputWide: {
        width: "100%",
    },

    inputHalf: {
        flex: 1,
        minWidth: 140,
    },

    inputWithIcon: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 8,
        height: INPUT_HEIGHT,
        paddingLeft: 16,
        paddingRight: 40,
        position: "relative",
        outlineStyle: "none",
        outlineWidth: 0,
    },


    inputContainer: {
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 8,
        height: INPUT_HEIGHT,
        paddingHorizontal: 16,
        justifyContent: "center",
    },

    iconButton: {
        position: "absolute",
        right: 8,
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
    },

    inputIcon: {
        width: 28,
        height: 28,
        resizeMode: "contain",
    },

    iconPlaceholder: {
        width: 28,
        height: 28,
        borderRadius: 4,
        backgroundColor: COLORS.textLowEmphasis,
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

    toastWrapper: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 9999,
        elevation: 9999,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        fontFamily: 'Roboto',
        marginTop: 4,
        marginLeft: 4,
    },

    statError: {
        color: '#ff6b6b',
        fontSize: 10,
        fontFamily: 'Roboto',
        marginTop: 2,
        textAlign: 'center',
        maxWidth: 60,
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
        justifyContent: "center",
        flexWrap: "wrap",
        width: "100%",
        gap: 16,
    },

    // Левая часть (модификаторы)
    modifiersBlock: {
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 360,
        maxWidth: 560, 
        flexBasis: "55%",
    },

    // Правая часть (инициатива, КД, скорость, хиты, кнопки)
    rightColumn: {
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 260,
        maxWidth: 320,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 12,
        flexBasis: "35%",
    },

    // сетка квадратных карточек
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
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
        flexBasis: "30%",
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

    // ==================== БРОНЯ / ОРУЖИЕ / ЗАКЛИНАНИЯ ====================

    equipmentCard: {
        width: "100%",
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        paddingHorizontal: 24,
        paddingVertical: 16,
        marginBottom: 16,
    },

    equipmentHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        position: "relative",
    },

    equipmentTitle: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 20,
        color: COLORS.textSecondary,
        textAlign: "center",
    },

    equipmentArrowButton: {
        position: "absolute",
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },

    equipmentRow: {
        flexDirection: "row",
        flexWrap: "nowrap",           // одна строка
        alignItems: "center",
        justifyContent: "flex-start",
        columnGap: 12,
    },

    // базовый стиль слота — размеры задаём из компонента
    equipmentSlot: {
        borderRadius: 8,
    },

    equipmentAddSlot: {
        borderRadius: 8,
        backgroundColor: COLORS.backgroundPrimary,
        borderWidth: 1,
        borderColor: COLORS.textLowEmphasis,
        justifyContent: "center",
        alignItems: "center",
    },

    equipmentAddText: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 32,
        lineHeight: 32,
        color: COLORS.textSecondary,
        textAlign: "center",
    },
});