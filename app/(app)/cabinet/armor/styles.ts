import { StyleSheet } from "react-native";
import { COLORS } from "@/constant/colors";

export const armorStyles = StyleSheet.create({
  pageTitle: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 30,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  pageDivider: {
    height: 1,
    backgroundColor: COLORS.textLowEmphasis,
    marginBottom: 24,
  },

  createButtonWrapper: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  createButtonText: {
    fontFamily: "Roboto",
    fontWeight: "500",
    fontSize: 18,
    color: COLORS.textPrimary,
  },

  listWrapper: {
    gap: 24,
  },

  card: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },

  cardTitle: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  cardTitleType: {
    fontStyle: "italic",
    color: COLORS.textSecondary,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  rowMobile: {
    flexDirection: "column",
  },

  infoBox: {
    flex: 1,
    backgroundColor: "#2C2C31",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  infoBoxMobile: {
    width: "100%",
  },
  infoBoxWide: {
    flex: 2,
  },
  infoBoxNarrow: {
    flex: 1,
  },

  label: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  valueHighlight: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  valueGold: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16,
    color: "#FFB347",
  },
  valueBlue: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16,
    color: "#4EA0FF",
  },

  modifiersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  modifierBadge: {
    backgroundColor: "#1F1F23",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modifierText: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 12,
    color: COLORS.textPrimary,
  },

  /* ===== MODAL ===== */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingVertical: 16,
    paddingHorizontal: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textLowEmphasis,
    paddingBottom: 8,
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 22,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  modalTitleType: {
    fontStyle: "italic",
    color: COLORS.textSecondary,
  },

  modalBody: {
    gap: 10,
  },

  modalRow: {
    flexDirection: "row",
    gap: 12,
  },
  modalRowSingle: {
    flexDirection: "column",
    gap: 4,
  },
  modalFieldGroup: {
    flex: 1,
  },

  modalLabel: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: "#18191A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  modalInputWide: {
    backgroundColor: "#18191A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  modalUniqueBlock: {
    marginTop: 4,
  },
  modalModsGrid: {
    marginTop: 8,
    gap: 6,
  },
  modalModRow: {
    flexDirection: "row",
    gap: 8,
  },
  modalInputSmall: {
    flex: 1,
  },

  addModifierButton: {
    marginTop: 6,
    alignItems: "center",
  },
  addModifierText: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
  footerButton: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  footerButtonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.textLowEmphasis,
  },
  footerButtonSecondaryText: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  footerButtonPrimary: {
    backgroundColor: COLORS.primary,
  },
  footerButtonPrimaryText: {
    fontFamily: "Roboto",
    fontWeight: "500",
    fontSize: 16,
    color: COLORS.textPrimary,
  },

    modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  modalTitleInput: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#18191A",
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: "center",
    minWidth: 120,
  },
  modalTitleInputType: {
    fontStyle: "italic",
  },
  modalTitleSlash: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 18,
    color: COLORS.textSecondary,
  },

});
