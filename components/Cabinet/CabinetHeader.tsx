import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Edit2, LogOut } from "lucide-react-native";
import { styles } from "./styles";

export default function CabinetHeader({ authStore, router, blockWidth }: any) {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const userName = authStore.getUser?.login || "Имя пользователя";

  const initials = useMemo(() => {
    const name = userName.trim();
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [userName]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Ошибка", "Разрешите доступ к галерее");
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
    await authStore.logout();
    router.replace("/login");
  };

  return (
    <View style={[styles.headerBlock, { width: blockWidth }]}>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.avatar}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
          <View style={styles.editIcon}>
            <Edit2 size={16} color={"rgba(227,227,227,1)"} />
          </View>
        </View>
      </TouchableOpacity>

      <Text style={styles.userName}>{userName}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={32} color={"rgba(227,227,227,1)"} />
      </TouchableOpacity>
    </View>
  );
}
