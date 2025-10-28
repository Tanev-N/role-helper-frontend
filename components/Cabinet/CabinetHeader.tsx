import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import Toast from "react-native-toast-message";

import Avatar from "@/components/UI/Avatar";
import { s } from "./styles";
import useStore from "@/hooks/store";

const CabinetHeader = observer(() => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const { authStore } = useStore();
  const router = useRouter();

  const userName = authStore?.getUser?.login || "Шумеев Григорий";

  const initials = useMemo(
    () =>
      userName
        .split(" ")
        .map((w) => w[0]?.toUpperCase())
        .join("")
        .slice(0, 2),
    [userName]
  );

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Разрешите доступ к галерее");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const handleLogout = async () => {
    Alert.alert("Выход из профиля", "Вы действительно хотите выйти?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Выйти",
        style: "destructive",
        onPress: async () => {
          try {
            await authStore.logout();

            Toast.show({
              type: "info",
              text1: "Вы вышли из системы",
              position: "bottom",
              visibilityTime: 2000,
            });

            setTimeout(() => {
              router.replace("/login");
            }, 500);
          } catch (e) {
            console.warn("Ошибка выхода:", e);
            Alert.alert("Ошибка", "Не удалось выйти из системы");
          }
        },
      },
    ]);
  };

  return (
    <View style={[s.headerBlock, { width: "95%" }]}>
      <Avatar
        uri={avatarUri}
        initials={initials}
        size={79}
        editable
        onPress={pickImage}
      />

      <Text style={s.userName}>{userName}</Text>

      <TouchableOpacity style={s.logoutButton} onPress={handleLogout}>
        <LogOut size={32} color={"rgba(227,227,227,1)"} />
      </TouchableOpacity>
    </View>
  );
});

export default CabinetHeader;
