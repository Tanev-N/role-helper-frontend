import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { COLORS } from "../UI/Colors";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function AuthButton({ title, onPress, disabled }: Props) {
  const active = !disabled;
  return (
    <Pressable
      style={[
        s.button,
        {
          backgroundColor: active ? COLORS.buttonActive : COLORS.buttonInactive,
          opacity: active ? 1 : 0.5,
        },
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={s.text}>{title}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  button: {
    marginTop: 32,
    borderRadius: 10,
    paddingVertical: 24,
    paddingHorizontal: 25,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: COLORS.white,
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 30,
    lineHeight: 30,
    textAlign: "center",
  },
});
