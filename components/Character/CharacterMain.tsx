import * as ImagePicker from "expo-image-picker";
import { ChevronDown, Pencil } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import { COLORS } from "../../constant/colors";
import { DND_CLASSES, DND_RACES } from "../../constant/dnd";
import SelectionModal from "./SelectionModal";
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
    characterId?: string; // ID персонажа для загрузки фото (если есть)
    charactersStore?: any; // CharactersStore для загрузки фото
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
    onValidationChange?: (isValid: boolean) => void; // Новый пропс для валидации
}

// Константы для валидации
const STAT_MIN_VALUE = 1;
const STAT_MAX_VALUE = 30;
const LEVEL_MIN_VALUE = 1;
const LEVEL_MAX_VALUE = 20;

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
    characterId,
    charactersStore,
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
    onValidationChange,
}: CharacterMainProps) => {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    // Состояния для модальных окон
    const [raceModalVisible, setRaceModalVisible] = useState(false);
    const [classModalVisible, setClassModalVisible] = useState(false);

    // Поиск иконки для выбранной расы (по русскому или английскому названию)
    const selectedRaceIcon = DND_RACES.find(
        (r) => r.name === race || r.nameEn === race
    )?.icon;

    // Поиск иконки для выбранного класса (по русскому или английскому названию)
    const selectedClassIcon = DND_CLASSES.find(
        (c) => c.name === className || c.nameEn === className
    )?.icon;

    // === Валидация полей ===
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Функция для валидации числового поля
    const validateNumberField = (
        value: string, 
        fieldName: string, 
        min: number, 
        max: number, 
        fieldLabel: string
    ): boolean => {
        const numValue = parseInt(value);
        
        // Если поле пустое или не число
        if (value === '' || isNaN(numValue)) {
            setValidationErrors(prev => ({
                ...prev,
                [fieldName]: `Поле "${fieldLabel}" должно содержать число`
            }));
            return false;
        }
        
        // Проверка диапазона
        if (numValue < min || numValue > max) {
            setValidationErrors(prev => ({
                ...prev,
                [fieldName]: `Число в поле "${fieldLabel}" должно быть от ${min} до ${max}`
            }));
            return false;
        }
        
        // Если валидация прошла успешно, удаляем ошибку
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
        return true;
    };

    // Функция для ограничения ввода двумя цифрами
    const handleNumberInput = (
        value: string, 
        onChange: (value: string) => void,
        fieldName: string,
        min: number,
        max: number,
        fieldLabel: string
    ) => {
        // Удаляем все нецифровые символы
        const cleaned = value.replace(/[^0-9]/g, '');
        
        // Ограничиваем двумя цифрами
        const limited = cleaned.length > 2 ? cleaned.slice(0, 2) : cleaned;
        
        onChange(limited);
        
        // Валидируем только если значение не пустое
        if (limited !== '') {
            validateNumberField(limited, fieldName, min, max, fieldLabel);
            
            // Показываем Toast уведомление при ошибке
            const numValue = parseInt(limited);
            if (!isNaN(numValue) && (numValue < min || numValue > max)) {
                Toast.show({
                    type: 'error',
                    text1: 'Ошибка ввода',
                    text2: `Число в поле "${fieldLabel}" должно быть от ${min} до ${max}`,
                    position: 'top',
                    visibilityTime: 3000,
                });
            }
        } else {
            // Если поле очищено, удаляем ошибку
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    // Функция для проверки всех полей
    const validateAllFields = (): boolean => {
        const errors: Record<string, string> = {};
        let isValid = true;

        // Валидация уровня
        if (!validateNumberField(level, 'level', LEVEL_MIN_VALUE, LEVEL_MAX_VALUE, 'Уровень')) {
            isValid = false;
        }

        // Валидация характеристик
        const statsToValidate = [
            { value: strength, field: 'strength', label: 'Сила' },
            { value: dexterity, field: 'dexterity', label: 'Ловкость' },
            { value: constitution, field: 'constitution', label: 'Телосложение' },
            { value: intelligence, field: 'intelligence', label: 'Интеллект' },
            { value: wisdom, field: 'wisdom', label: 'Мудрость' },
            { value: charisma, field: 'charisma', label: 'Харизма' },
        ];

        statsToValidate.forEach(stat => {
            if (!validateNumberField(stat.value, stat.field, STAT_MIN_VALUE, STAT_MAX_VALUE, stat.label)) {
                isValid = false;
            }
        });

        return isValid;
    };

    // Эффект для проверки валидации при изменении полей
    useEffect(() => {
        if (onValidationChange) {
            const isValid = validateAllFields();
            onValidationChange(isValid);
        }
    }, [level, strength, dexterity, constitution, intelligence, wisdom, charisma]);

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

        if (!result.canceled && result.assets?.[0]?.uri) {
            const uri = result.assets[0].uri;
            
            // Если есть characterId и charactersStore, загружаем фото на сервер
            if (characterId && charactersStore?.uploadPhoto) {
                try {
                    const success = await charactersStore.uploadPhoto(characterId, uri);
                    if (success) {
                        // Обновляем фото из стора
                        const character = charactersStore.getCharacterById(characterId);
                        if (character?.photo) {
                            onPhotoChange(character.photo);
                        } else {
                            // Если фото не обновилось в сторе, используем URI временно
                            onPhotoChange(uri);
                        }
                    } else {
                        alert("Не удалось загрузить фото");
                    }
                } catch (error) {
                    console.error("Error uploading photo:", error);
                    alert("Ошибка при загрузке фото");
                }
            } else {
                // Если нет characterId (создание нового персонажа), просто сохраняем URI локально
                onPhotoChange(uri);
            }
        }
    };

    // Функция для расчета модификатора
    const calculateModifier = (value: string): number => {
        const num = parseInt(value) || 0;
        return Math.floor((num - 10) / 2);
    };

    const stats = [
        { 
            name: "Сила", 
            value: strength, 
            color: COLORS.strength, 
            onChange: (value: string) => handleNumberInput(
                value, 
                onStrengthChange, 
                'strength', 
                STAT_MIN_VALUE, 
                STAT_MAX_VALUE, 
                'Сила'
            ),
            error: validationErrors.strength 
        },
        { 
            name: "Ловкость", 
            value: dexterity, 
            color: COLORS.dexterity, 
            onChange: (value: string) => handleNumberInput(
                value, 
                onDexterityChange, 
                'dexterity', 
                STAT_MIN_VALUE, 
                STAT_MAX_VALUE, 
                'Ловкость'
            ),
            error: validationErrors.dexterity 
        },
        { 
            name: "Телослож.", 
            value: constitution, 
            color: COLORS.constitution, 
            onChange: (value: string) => handleNumberInput(
                value, 
                onConstitutionChange, 
                'constitution', 
                STAT_MIN_VALUE, 
                STAT_MAX_VALUE, 
                'Телосложение'
            ),
            error: validationErrors.constitution 
        },
        { 
            name: "Интеллект", 
            value: intelligence, 
            color: COLORS.intelligence, 
            onChange: (value: string) => handleNumberInput(
                value, 
                onIntelligenceChange, 
                'intelligence', 
                STAT_MIN_VALUE, 
                STAT_MAX_VALUE, 
                'Интеллект'
            ),
            error: validationErrors.intelligence 
        },
        { 
            name: "Мудрость", 
            value: wisdom, 
            color: COLORS.wisdom, 
            onChange: (value: string) => handleNumberInput(
                value, 
                onWisdomChange, 
                'wisdom', 
                STAT_MIN_VALUE, 
                STAT_MAX_VALUE, 
                'Мудрость'
            ),
            error: validationErrors.wisdom 
        },
        { 
            name: "Харизма", 
            value: charisma, 
            color: COLORS.charisma, 
            onChange: (value: string) => handleNumberInput(
                value, 
                onCharismaChange, 
                'charisma', 
                STAT_MIN_VALUE, 
                STAT_MAX_VALUE, 
                'Харизма'
            ),
            error: validationErrors.charisma 
        },
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
                        <View style={[styles.inputWithIcon, isMobile ? styles.inputWide : styles.inputHalf]}>
                            <TextInput
                                style={[styles.input, isMobile ? styles.inputWide : styles.inputHalf]}
                                placeholder="Имя персонажа"
                                placeholderTextColor={COLORS.textSecondary}
                                value={name}
                                onChangeText={onNameChange}
                            />
                        </View>
                    </View>

                    <View style={[styles.row, isMobile && { flexDirection: "column" }]}>
                        <View style={[styles.inputWithIcon, isMobile ? styles.inputWide : styles.inputHalf]}>
                            <TextInput
                                style={[styles.input, { flex: 1, backgroundColor: "transparent", paddingRight: 0 }]}
                                placeholder="Раса"
                                placeholderTextColor={COLORS.textSecondary}
                                value={race}
                                onChangeText={onRaceChange}
                            />
                            {selectedRaceIcon ? (
                                <TouchableOpacity
                                    onPress={() => setRaceModalVisible(true)}
                                    style={styles.iconButton}
                                >
                                    <Image source={selectedRaceIcon} style={styles.inputIcon} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => setRaceModalVisible(true)}
                                    style={styles.iconButton}
                                >
                                    <ChevronDown size={20} color={COLORS.textSecondary} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={[styles.inputWithIcon, isMobile ? styles.inputWide : styles.inputHalf]}>
                            <TextInput
                                style={[
                                    styles.input, 
                                    isMobile ? styles.inputWide : styles.inputHalf,
                                    validationErrors.level && { borderColor: COLORS.error }
                                ]}
                                placeholder="Уровень (от 1 до 20)"
                                placeholderTextColor={COLORS.textSecondary}
                                value={level}
                                onChangeText={(value) => handleNumberInput(
                                    value, 
                                    onLevelChange, 
                                    'level', 
                                    LEVEL_MIN_VALUE, 
                                    LEVEL_MAX_VALUE, 
                                    'Уровень'
                                )}
                                keyboardType="numeric"
                                maxLength={2}
                            />
                        </View>
                    </View>

                    <View style={[styles.row, isMobile && { flexDirection: "column" }]}>
                        <View style={[styles.inputWithIcon, isMobile ? styles.inputWide : styles.inputHalf]}>
                            <TextInput
                                style={[styles.input, { flex: 1, backgroundColor: "transparent", paddingRight: 0 }]}
                                placeholder="Класс"
                                placeholderTextColor={COLORS.textSecondary}
                                value={className}
                                onChangeText={onClassChange}
                            />
                            {selectedClassIcon ? (
                                <TouchableOpacity
                                    onPress={() => setClassModalVisible(true)}
                                    style={styles.iconButton}
                                >
                                    <Image source={selectedClassIcon} style={styles.inputIcon} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => setClassModalVisible(true)}
                                    style={styles.iconButton}
                                >
                                    <ChevronDown size={20} color={COLORS.textSecondary} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={[styles.inputWithIcon, isMobile ? styles.inputWide : styles.inputHalf]}>
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
                                    style={[
                                        styles.statValue, 
                                        { 
                                            color: stat.color, 
                                            textAlign: "center",
                                            borderColor: stat.error ? COLORS.error : 'transparent',
                                            borderWidth: stat.error ? 1 : 0
                                        }
                                    ]}
                                    value={stat.value}
                                    onChangeText={stat.onChange}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    placeholderTextColor={stat.color}
                                    maxLength={2}
                                />
                                <Text style={styles.statBonus}>{modifierText}</Text>
                            </View>
                            <Text style={styles.statLabel}>{stat.name}</Text>
                            {stat.error && (
                                <Text style={{
                                    color: COLORS.error,
                                    fontSize: 10,
                                    textAlign: 'center',
                                    marginTop: 2
                                }}>
                                    {stat.error}
                                </Text>
                            )}
                        </View>
                    );
                })}
            </View>

            {/* Модальные окна для выбора */}
            <SelectionModal
                visible={raceModalVisible}
                title="Выберите расу"
                items={DND_RACES}
                selectedValue={race}
                onSelect={onRaceChange}
                onClose={() => setRaceModalVisible(false)}
            />
            <SelectionModal
                visible={classModalVisible}
                title="Выберите класс"
                items={DND_CLASSES}
                selectedValue={className}
                onSelect={onClassChange}
                onClose={() => setClassModalVisible(false)}
            />
        </View>
    );
};

export default CharacterMain;