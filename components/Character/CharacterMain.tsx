import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    Image,
    Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Pencil } from "lucide-react-native";
import { characterStyles as styles } from "./styles";
import { COLORS } from "../../constant/colors";

const CharacterMain = () => {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const [avatarUri, setAvatarUri] = useState<string | null>(null);

    // === Выбор изображения ===
    const pickImage = async () => {
        // Запрашиваем разрешение на доступ к галерее
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert("Разрешите доступ к галерее, чтобы выбрать изображение.");
            return;
        }

        // Открываем системный выбор файла
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"], 
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });

        if (!result.canceled) {
            // В web result.assets может содержать array
            const uri = result.assets?.[0]?.uri;
            if (uri) setAvatarUri(uri);
        }
    };

    return (
        <View>
            {/* === ПЕРВЫЙ ПОДБЛОК: аватар + поля === */}
            <View
                style={[
                    styles.mainInfo,
                    isMobile && { flexDirection: "column", alignItems: "center" },
                ]}
            >
                {/* === Аватар === */}
                <View style={styles.avatarContainer}>
                    {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatar} />
                    )}
                    <TouchableOpacity style={styles.avatarEdit} onPress={pickImage}>
                        <Pencil size={18} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* === Поля === */}
                <View
                    style={[
                        styles.infoFields,
                        isMobile && { width: "100%", height: "auto", marginTop: 16 },
                    ]}
                >
                    <View style={[styles.row, isMobile && { flexDirection: "column" }]}>
                        <TextInput
                            style={[styles.input, isMobile ? styles.inputWide : styles.inputHalf]}
                            placeholder="Имя персонажа"
                            placeholderTextColor={COLORS.textSecondary}
                        />
                    </View>

                    <View style={[styles.row, isMobile && { flexDirection: "column" }]}>
                        <TextInput
                            style={[styles.input, isMobile ? styles.inputWide : styles.inputHalf]}
                            placeholder="Раса"
                            placeholderTextColor={COLORS.textSecondary}
                        />
                        <TextInput
                            style={[styles.input, isMobile ? styles.inputWide : styles.inputHalf]}
                            placeholder="Уровень"
                            placeholderTextColor={COLORS.textSecondary}
                        />
                    </View>

                    <View style={[styles.row, isMobile && { flexDirection: "column" }]}>
                        <TextInput
                            style={[styles.input, isMobile ? styles.inputWide : styles.inputHalf]}
                            placeholder="Класс"
                            placeholderTextColor={COLORS.textSecondary}
                        />
                        <TextInput
                            style={[styles.input, isMobile ? styles.inputWide : styles.inputHalf]}
                            placeholder="Мировоззрение"
                            placeholderTextColor={COLORS.textSecondary}
                        />
                    </View>
                </View>
            </View>

            {/* === ВТОРОЙ ПОДБЛОК: характеристики === */}
            <View style={styles.statsRow}>
                {[
                    { name: "Сила", color: COLORS.strength },
                    { name: "Ловкость", color: COLORS.dexterity },
                    { name: "Телослож.", color: COLORS.constitution },
                    { name: "Интеллект", color: COLORS.intelligence },
                    { name: "Мудрость", color: COLORS.wisdom },
                    { name: "Харизма", color: COLORS.charisma },
                ].map((stat) => (
                    <View key={stat.name} style={styles.statBox}>
                        <View style={{ position: "relative", alignItems: "center" }}>
                            <Text style={[styles.statValue, { color: stat.color }]}>99</Text>
                            <Text style={styles.statBonus}>+9</Text>
                        </View>
                        <Text style={styles.statLabel}>{stat.name}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default CharacterMain;