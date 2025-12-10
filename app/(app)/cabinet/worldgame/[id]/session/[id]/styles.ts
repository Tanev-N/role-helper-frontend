import { StyleSheet } from "react-native";
import { COLORS } from "@/constant/colors";
import { AlignCenter } from "lucide-react-native";

export const sessionDetailsStyles = StyleSheet.create({
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

  sessionTitle: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 24,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 4,
  },

  titleDivider: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.textLowEmphasis,
    marginBottom: 16,
  },

  /** ===== КАРТОЧКИ  ===== */
  infoCard: {
    width: "100%",
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 12,
  },

  infoCardTitle: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 20,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },

  infoCardText: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.textPrimary,
    textAlign: "left",
    alignSelf: "flex-start",
    paddingLeft: 24,
  },

  /* === ЧАТ === */

chatCard: {
  width: "100%",
  backgroundColor: COLORS.backgroundSecondary,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.1)",
  paddingBottom: 16,
  overflow: "hidden",
  marginTop: 12,
},


chatHeader: {
  width: "100%",
  backgroundColor: "#2C2C31",
  paddingVertical: 10,
  justifyContent: "center",
  alignItems: "center",
},

chatHeaderText: {
  fontFamily: "Roboto",
  fontWeight: "400",
  fontSize: 20,
  color: COLORS.textSecondary,
  textAlign: "center",
},


chatInner: {
  width: "95%",        
  backgroundColor: "#151518",
  borderRadius: 16,
  paddingVertical: 16,
  paddingHorizontal: 12,
  alignSelf: "center",
},
chatInnerWrapper: {
  width: "100%",
  alignItems: "center",
},


chatBubbleWrapper: {
  width: "100%",
  marginBottom: 12,
},

chatBubble: {
  maxWidth: "80%",
  borderRadius: 16,
  paddingHorizontal: 12,
  paddingVertical: 8,
},

chatBubbleLeft: {
  backgroundColor: "#2C2C31",
  alignSelf: "flex-start",
},

chatBubbleRight: {
  backgroundColor: COLORS.primary,
  alignSelf: "flex-end",
},

chatBubbleText: {
  fontFamily: "Roboto",
  fontWeight: "400",
  fontSize: 14,
  lineHeight: 18,
  color: COLORS.textPrimary,
},



});
