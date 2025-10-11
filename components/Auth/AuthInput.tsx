import React from "react";
import { TextInput, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../UI/Colors";
import { TYPOGRAPHY } from "../UI/Typography";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secure?: boolean;
  error?: string;
  onBlur?: () => void; // добавили сюда поддержку onBlur
};

export default function AuthInput({
  placeholder,
  value,
  onChangeText,
  secure,
  error,
  onBlur, // деструктурируем
}: Props) {
  return (
    <View style={s.field}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#BBBBBB"
        secureTextEntry={secure}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur} // пробрасываем в TextInput
        style={s.input}
      />
      {error && <Text style={s.errorText}>*{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  field: {
    width: "80%",
    alignSelf: "center",
    marginVertical: 8,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderColor: COLORS.inputBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 24,
    color: COLORS.white,
    fontFamily: "Roboto",
  },
  errorText: {
    ...TYPOGRAPHY.error,
    fontSize: 18,
    marginTop: 6,
    textAlign: "left",
  },
});
