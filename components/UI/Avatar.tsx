import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { Edit2 } from "lucide-react-native";

interface AvatarProps {
  /** URI аватарки */
  uri?: string | null;
  /** Текст инициалов (например: "ШГ") */
  initials?: string;
  /** Размер аватарки в пикселях (по умолчанию 79) */
  size?: number;
  /** Цвет фона, если нет фото */
  backgroundColor?: string;
  /** Цвет текста инициалов */
  textColor?: string;
  /** Нужно ли показывать иконку редактирования */
  editable?: boolean;
  /** Обработчик нажатия на аватарку (например, выбрать фото) */
  onPress?: (event: GestureResponderEvent) => void;
}

export default function Avatar({
  uri,
  initials = "?",
  size = 79,
  backgroundColor = "#0075FF",
  textColor = "#FFFFFF",
  editable = false,
  onPress,
}: AvatarProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={editable ? 0.7 : 1}
      disabled={!editable}
    >
      <View
        style={[
          s.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: backgroundColor,
          },
        ]}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
          />
        ) : (
          <Text
            style={[
              s.initials,
              { color: textColor, fontSize: size * 0.38, lineHeight: size * 0.4 },
            ]}
          >
            {initials}
          </Text>
        )}

        {editable && (
          <View style={[s.editIcon, { right: size * 0.05, bottom: size * 0.05 }]}>
            <Edit2 size={size * 0.2} color={"rgba(227,227,227,1)"} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  initials: {
    fontFamily: "Roboto",
    fontWeight: "700",
    textAlign: "center",
  },
  editIcon: {
    position: "absolute",
    backgroundColor: "rgba(44,44,49,1)",
    borderRadius: 16,
    padding: 4,
  },
});
