import { StyleSheet } from "react-native";
import { COLORS } from "@/constant/colors";

export const worldsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  screenContent: {
    alignItems: "center",
    paddingBottom: 32,
  },

  pageTitle: {
    fontFamily: "Roboto",
    fontWeight: "400",
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  pageDivider: {
    height: 1,
    backgroundColor: COLORS.textLowEmphasis,
    marginBottom: 24,
  },

  list: {
    flexDirection: "column",
    rowGap: 24,
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
    position: "relative",
  },

  worldImage: {
    width: "100%",
    height: "100%",
  },

  worldArrowHitbox: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
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
});
