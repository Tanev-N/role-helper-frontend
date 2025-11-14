import CharacterMain from "@/components/Character/CharacterMain";
import CharacterSecondary from "@/components/Character/CharacterSecondary";
import { characterStyles as styles } from "@/components/Character/styles";
import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

const CharactersScreen = () => {
    const router = useRouter();
    const { charactersStore } = useStore();

    // Основная информация
    const [name, setName] = useState("");
    const [race, setRace] = useState("");
    const [level, setLevel] = useState("");
    const [className, setClassName] = useState("");
    const [alignment, setAlignment] = useState("");
    const [strength, setStrength] = useState("");
    const [dexterity, setDexterity] = useState("");
    const [constitution, setConstitution] = useState("");
    const [intelligence, setIntelligence] = useState("");
    const [wisdom, setWisdom] = useState("");
    const [charisma, setCharisma] = useState("");
    const [photo, setPhoto] = useState("");

    // Дополнительная информация
    const [initiative, setInitiative] = useState("");
    const [armorClass, setArmorClass] = useState("");
    const [speed, setSpeed] = useState("");
    const [hitPoints, setHitPoints] = useState("");
    const [tempHitPoints, setTempHitPoints] = useState("");
    const [hitDice, setHitDice] = useState("");
    const [background, setBackground] = useState("");
    const [features, setFeatures] = useState("");

    // Расчет модификатора ловкости для инициативы
    const dexterityMod = Math.floor(((parseInt(dexterity) || 0) - 10) / 2);

    const handleCreateCharacter = async () => {
        // Валидация обязательных полей
        if (!name.trim()) {
            Alert.alert("Ошибка", "Введите имя персонажа");
            return;
        }
        if (!race.trim()) {
            Alert.alert("Ошибка", "Введите расу персонажа");
            return;
        }
        if (!className.trim()) {
            Alert.alert("Ошибка", "Введите класс персонажа");
            return;
        }
        const levelNum = parseInt(level);
        if (!levelNum || levelNum < 1 || levelNum > 20) {
            Alert.alert("Ошибка", "Введите корректный уровень (1-20)");
            return;
        }

        // Валидация характеристик
        const stats = {
            strength: parseInt(strength) || 1,
            dexterity: parseInt(dexterity) || 1,
            constitution: parseInt(constitution) || 1,
            intelligence: parseInt(intelligence) || 1,
            wisdom: parseInt(wisdom) || 1,
            charisma: parseInt(charisma) || 1,
        };

        if (Object.values(stats).some(stat => stat < 1 || stat > 30)) {
            Alert.alert("Ошибка", "Характеристики должны быть в диапазоне 1-30");
            return;
        }

        try {
            await charactersStore.createCharacter({
                name: name.trim(),
                race: race.trim(),
                class: className.trim(),
                level: levelNum,
                alignment: alignment.trim() || undefined,
                background: background.trim() || undefined,
                strength: stats.strength,
                dexterity: stats.dexterity,
                constitution: stats.constitution,
                intelligence: stats.intelligence,
                wisdom: stats.wisdom,
                charisma: stats.charisma,
                proficiency_bonus: 0, // Автоматический расчет
                initiative: initiative ? parseInt(initiative) : 0, // 0 для авторасчета
                armor_class: armorClass ? parseInt(armorClass) : undefined,
                speed: speed ? parseInt(speed) : undefined,
                hit_points: hitPoints ? parseInt(hitPoints) : undefined,
                max_hit_points: 0, // Автоматический расчет
                temp_hit_points: tempHitPoints ? parseInt(tempHitPoints) : undefined,
                hit_dice: hitDice.trim() || undefined,
                features: features.trim() || undefined,
                photo: photo.trim() || undefined,
            });

            // Автоматический переход на предыдущую страницу после успешного создания
            router.back();
        } catch (error) {
            Alert.alert("Ошибка", "Не удалось создать персонажа");
            console.error("Create character error:", error);
        }
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: COLORS.backgroundPrimary }}
            contentContainerStyle={{
                alignItems: "center",
                paddingTop: 40,
                paddingBottom: 60,
            }}
        >
            {/* === ОСНОВНАЯ ИНФОРМАЦИЯ === */}
            <View style={styles.block}>
                <Text style={styles.sectionTitle}>ОСНОВНАЯ ИНФОРМАЦИЯ</Text>
                <CharacterMain
                    name={name}
                    race={race}
                    level={level}
                    className={className}
                    alignment={alignment}
                    strength={strength}
                    dexterity={dexterity}
                    constitution={constitution}
                    intelligence={intelligence}
                    wisdom={wisdom}
                    charisma={charisma}
                    photo={photo}
                    onNameChange={setName}
                    onRaceChange={setRace}
                    onLevelChange={setLevel}
                    onClassChange={setClassName}
                    onAlignmentChange={setAlignment}
                    onStrengthChange={setStrength}
                    onDexterityChange={setDexterity}
                    onConstitutionChange={setConstitution}
                    onIntelligenceChange={setIntelligence}
                    onWisdomChange={setWisdom}
                    onCharismaChange={setCharisma}
                    onPhotoChange={setPhoto}
                />
            </View>

            {/* === ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ === */}
            <View style={styles.block}>
                <Text style={styles.sectionTitle}>ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ</Text>
                <CharacterSecondary
                    initiative={initiative}
                    armorClass={armorClass}
                    speed={speed}
                    hitPoints={hitPoints}
                    tempHitPoints={tempHitPoints}
                    hitDice={hitDice}
                    background={background}
                    features={features}
                    onInitiativeChange={setInitiative}
                    onArmorClassChange={setArmorClass}
                    onSpeedChange={setSpeed}
                    onHitPointsChange={setHitPoints}
                    onTempHitPointsChange={setTempHitPoints}
                    onHitDiceChange={setHitDice}
                    onBackgroundChange={setBackground}
                    onFeaturesChange={setFeatures}
                    dexterityMod={dexterityMod}
                />
            </View>

            {/* === КНОПКА СОЗДАНИЯ === */}
            <View style={{ width: "100%", maxWidth: 904, paddingHorizontal: 20, marginTop: 24 }}>
                <TouchableOpacity
                    onPress={handleCreateCharacter}
                    disabled={charactersStore.IsLoading}
                    style={{
                        backgroundColor: COLORS.primary,
                        borderRadius: 16,
                        paddingVertical: 16,
                        paddingHorizontal: 32,
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: charactersStore.IsLoading ? 0.5 : 1,
                    }}
                >
                    <Text style={{
                        color: COLORS.textPrimary,
                        fontSize: 24,
                        fontWeight: "600",
                        fontFamily: "Roboto",
                    }}>
                        {charactersStore.IsLoading ? "Создание..." : "Создать персонажа"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default observer(CharactersScreen);