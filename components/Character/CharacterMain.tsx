import * as ImagePicker from "expo-image-picker";
import { Pencil } from "lucide-react-native";
import React from "react";
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { COLORS } from "../../constant/colors";
import { characterStyles as styles } from "./styles";

interface CharacterMainProps {
    name: string;
    race: string;
    level: string;
    className: string;
    alignment: string;
    strength: string;
    dexterity: string;
    constitution: string;
    intelligence: string;
    wisdom: string;
    charisma: string;
    photo?: string;
    onNameChange: (value: string) => void;
    onRaceChange: (value: string) => void;
    onLevelChange: (value: string) => void;
    onClassChange: (value: string) => void;
    onAlignmentChange: (value: string) => void;
    onStrengthChange: (value: string) => void;
    onDexterityChange: (value: string) => void;
    onConstitutionChange: (value: string) => void;
    onIntelligenceChange: (value: string) => void;
    onWisdomChange: (value: string) => void;
    onCharismaChange: (value: string) => void;
    onPhotoChange: (value: string) => void;
}

const CharacterMain = ({
    name,
    race,
    level,
    className,
    alignment,
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    photo,
    onNameChange,
    onRaceChange,
    onLevelChange,
    onClassChange,
    onAlignmentChange,
    onStrengthChange,
    onDexterityChange,
    onConstitutionChange,
    onIntelligenceChange,
    onWisdomChange,
    onCharismaChange,
    onPhotoChange,
}: CharacterMainProps) => {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

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
            if (uri) onPhotoChange(uri);
        }
    };

    // Функция для расчета модификатора
    const calculateModifier = (value: string): number => {
        const num = parseInt(value) || 0;
        return Math.floor((num - 10) / 2);
    };

    const stats = [
        { name: "Сила", value: strength, color: COLORS.strength, onChange: onStrengthChange },
        { name: "Ловкость", value: dexterity, color: COLORS.dexterity, onChange: onDexterityChange },
        { name: "Телослож.", value: constitution, color: COLORS.constitution, onChange: onConstitutionChange },
        { name: "Интеллект", value: intelligence, color: COLORS.intelligence, onChange: onIntelligenceChange },
        { name: "Мудрость", value: wisdom, color: COLORS.wisdom, onChange: onWisdomChange },
        { name: "Харизма", value: charisma, color: COLORS.charisma, onChange: onCharismaChange },
    ];

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
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.avatar} />
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
                            value={name}
                            onChangeText={onNameChange}
                        />
                    </View>

                    <View style={[styles.row, isMobile && { flexDirection: "column" }]}>
                        <TextInput
                            style={[styles.input, isMobile ? styles.inputWide : styles.inputHalf]}
                            placeholder="Раса"
                            placeholderTextColor={COLORS.textSecondary}
                            value={race}
                            onChangeText={onRaceChange}
                        />
                        <TextInput
                            style={[styles.input, isMobile ? styles.inputWide : styles.inputHalf]}
                            placeholder="Уровень"
                            placeholderTextColor={COLORS.textSecondary}
                            value={level}
                            onChangeText={onLevelChange}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={[styles.row, isMobile && { flexDirection: "column" }]}>
                        <TextInput
                            style={[styles.input, isMobile ? styles.inputWide : styles.inputHalf]}
                            placeholder="Класс"
                            placeholderTextColor={COLORS.textSecondary}
                            value={className}
                            onChangeText={onClassChange}
                        />
                        <TextInput
                            style={[styles.input, isMobile ? styles.inputWide : styles.inputHalf]}
                            placeholder="Мировоззрение"
                            placeholderTextColor={COLORS.textSecondary}
                            value={alignment}
                            onChangeText={onAlignmentChange}
                        />
                    </View>
                </View>
            </View>

            {/* === ВТОРОЙ ПОДБЛОК: характеристики === */}
            <View style={styles.statsRow}>
                {stats.map((stat) => {
                    const modifier = calculateModifier(stat.value);
                    const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;
                    return (
                        <View key={stat.name} style={styles.statBox}>
                            <View style={{ position: "relative", alignItems: "center" }}>
                                <TextInput
                                    style={[styles.statValue, { color: stat.color, textAlign: "center" }]}
                                    value={stat.value}
                                    onChangeText={stat.onChange}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    placeholderTextColor={stat.color}
                                />
                                <Text style={styles.statBonus}>{modifierText}</Text>
                            </View>
                            <Text style={styles.statLabel}>{stat.name}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default CharacterMain;