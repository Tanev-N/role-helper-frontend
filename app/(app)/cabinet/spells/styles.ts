import { StyleSheet } from "react-native";
import { COLORS } from "@/constant/colors";

export const spellStyles = StyleSheet.create({
  // ====== СТРАНИЦА ======
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 16,
  },
  pageDivider: {
    height: 2,
    backgroundColor: COLORS.backgroundSecondary,
    marginBottom: 32,
  },

  createButtonWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  listWrapper: {
    gap: 24,
  },

  // ====== КАРТОЧКА ЗАКЛИНАНИЯ ======
  card: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.backgroundSecondary,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    flex: 1,
  },
  cardTitleSchool: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  cardLevelBadge: {
    backgroundColor: "#7B68EE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cardLevelText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  rowMobile: {
    flexDirection: "column",
    gap: 12,
  },

  infoBox: {
    flex: 1,
  },
  infoBoxMobile: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  valueHighlight: {
    fontSize: 16,
    color: "#4A90E2",
    fontWeight: "600",
  },
  valueBlue: {
    fontSize: 16,
    color: "#3FD4FF",
    fontWeight: "600",
  },
  valueGold: {
    fontSize: 16,
    color: "#FFD700",
    fontWeight: "600",
  },
  valueRed: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "600",
  },

  componentsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  componentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  componentText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },

  descriptionBox: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },

  higherLevelsBox: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  higherLevelsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFD700",
    marginBottom: 4,
  },
  higherLevelsText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },

  // ====== МОДАЛКА ======
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    maxHeight: "90%",
  },

  modalHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundSecondary,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitleInput: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    flex: 1,
    padding: 0,
  },
  modalTitleSlash: {
    fontSize: 20,
    color: COLORS.textSecondary,
    marginHorizontal: 8,
  },
  modalTitleInputType: {
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  modalLevelRow: {
    flexDirection: "row",
  },
  modalLevelInput: {
    fontSize: 16,
    color: "#7B68EE",
    fontWeight: "600",
    padding: 0,
  },

  modalBody: {
    padding: 24,
    gap: 20,
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  modalLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: "500",
  },
  modalInput: {
    backgroundColor: COLORS.backgroundPrimary,
    borderWidth: 1,
    borderColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  modalTextArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  componentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  componentTypeSelector: {
    flexDirection: "row",
    gap: 4,
  },
  componentTypeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundPrimary,
    borderWidth: 2,
    borderColor: COLORS.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  componentTypeButtonActive: {
    borderColor: "#4A90E2",
    backgroundColor: "rgba(74, 144, 226, 0.1)",
  },
  componentTypeText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  componentTypeTextActive: {
    color: "#4A90E2",
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },

  addComponentButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  addComponentText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },

  checkboxButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    backgroundColor: COLORS.backgroundPrimary,
    minWidth: 140,
  },
  checkboxButtonActive: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderColor: "#4A90E2",
  },
  checkboxText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },

  ritualButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#FFA500",
    borderRadius: 8,
    backgroundColor: COLORS.backgroundPrimary,
  },
  ritualButtonActive: {
    backgroundColor: "rgba(255, 165, 0, 0.1)",
  },
  ritualText: {
    color: "#FFA500",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },

  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.backgroundSecondary,
  },
  footerButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  footerButtonPrimary: {
    backgroundColor: COLORS.primary,
  },
  footerButtonSecondary: {
    backgroundColor: COLORS.backgroundPrimary,
    borderWidth: 1,
    borderColor: COLORS.backgroundSecondary,
  },
  footerButtonPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  footerButtonSecondaryText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});