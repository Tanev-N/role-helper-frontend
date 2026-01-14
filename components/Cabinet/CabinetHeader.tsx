import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Edit2, LogOut } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import { styles } from "./styles";

const CabinetHeader = observer(({ authStore, router, blockWidth }: any) => {
  const userName = authStore.getUser?.login || "Имя пользователя";
  const avatarUrl = authStore.getUser?.avatar_url || null;


  const initials = useMemo(() => {
    const name = userName.trim();
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, [userName]);

  const pickImage = async () => {
    console.log("pickImage called");
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Ошибка", "Разрешите доступ к галерее");
        return;
      }
      console.log("Permission granted, launching image picker");
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      
      console.log("ImagePicker result:", result);
      
      if (!result.canceled && result.assets[0]?.uri) {
        const success = await authStore.uploadAvatar(result.assets[0].uri);
        if (!success) {
          Alert.alert("Ошибка", "Не удалось загрузить аватар");
        }
      }
    } catch (error) {
      console.error("Error in pickImage:", error);
      Alert.alert("Ошибка", `Ошибка при выборе изображения: ${error}`);
    }
  };

  const handleLogout = async () => {
    await authStore.logout();
    router.replace("/login");
  };

  return (
    <View style={[styles.headerBlock, { width: blockWidth }]}>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.avatar}>
          {avatarUrl ? (
            <Image 
              source={{ uri: avatarUrl }} 
              style={styles.avatarImage}
            />
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
});

export default CabinetHeader;
