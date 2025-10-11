import React from "react";
import { View, ImageBackground, StyleSheet, useWindowDimensions } from "react-native";
import { COLORS } from "../UI/Colors";

type Props = {
  children: React.ReactNode;
  width?: number;
};

const BASE = { W: 1920, H: 1080 };

const useScale = () => {
  const { width, height } = useWindowDimensions();
  return Math.min(width / BASE.W, height / BASE.H, 1);
};

export default function AuthCard({ children, width }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = width ?? (screenWidth >= 1024 ? 763 : Math.min(763, screenWidth - 24));

  return (
    <ImageBackground
      source={require("@/assets/images/bg_img.png")}
      style={s.bg}
      imageStyle={s.bgImage}
      resizeMode="cover"
    >
      <View style={[s.center]}>
        <View style={[s.card, { width: cardWidth }]}>{children}</View>
      </View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  bgImage: {
    width: "100%",
    height: "100%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    // borderColor: "rgba(255,255,255,0.25)",
    paddingTop:71,
    paddingBottom: 89,
    paddingHorizontal: 25,
    alignSelf: "center",
    justifyContent: "flex-start",
  },
});
