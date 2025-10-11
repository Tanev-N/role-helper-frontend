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
      style={[s.button, { backgroundColor: COLORS.buttonActive }]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[s.text, { color: active ? COLORS.white : "#ffffffcb" }]}>
        {title}
      </Text>
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
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 30,
    lineHeight: 30,
    textAlign: "center",
  },
});
