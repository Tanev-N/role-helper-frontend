import CharacterMain from "@/components/Character/CharacterMain";
import CharacterSecondary from "@/components/Character/CharacterSecondary";
import { characterStyles as styles } from "@/components/Character/styles";
import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { CharacterSkill } from "@/stores/Characters/api";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { ChevronRight } from "lucide-react-native";

const CharactersScreen = () => {
  const router = useRouter();
  const { charactersStore } = useStore();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // ширина контейнера для расчёта количества слотов
  const DESKTOP_MAX_WIDTH = 904;
  const containerWidth = Math.min(width * 0.95, DESKTOP_MAX_WIDTH);

  // размеры слотов
  const slotSize = isMobile ? 70 : 91;
  const slotGap = 12;
  // внутренняя ширина (equipmentCard имеет paddingHorizontal: 24)
  const innerWidth = containerWidth - 48;
  // максимальное число слотов (включая "+"), которое помещается в одну строку
  const maxSlotsInRow = Math.max(
    1,
    Math.floor((innerWidth + slotGap) / (slotSize + slotGap))
  );

  // Основная информация
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [level, setLevel] = useState("");
  const [className, setClassName] = useState("");
  const [alignment, setAlignment] = useState("");
  const [strength, setStrength] = useState("1");
  const [dexterity, setDexterity] = useState("1");
  const [constitution, setConstitution] = useState("1");
  const [intelligence, setIntelligence] = useState("1");
  const [wisdom, setWisdom] = useState("1");
  const [charisma, setCharisma] = useState("1");
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
  const [skills, setSkills] = useState<CharacterSkill[]>([]);

  const dexterityMod = Math.floor(((parseInt(dexterity) || 0) - 10) / 2);

  const handleCreateCharacter = async () => {
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

    const stats = {
      strength: parseInt(strength) || 1,
      dexterity: parseInt(dexterity) || 1,
      constitution: parseInt(constitution) || 1,
      intelligence: parseInt(intelligence) || 1,
      wisdom: parseInt(wisdom) || 1,
      charisma: parseInt(charisma) || 1,
    };

    if (Object.values(stats).some((stat) => stat < 1 || stat > 30)) {
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
        skills: skills.length > 0 ? skills : undefined,
      });
      
      // Автоматический переход на предыдущую страницу после успешного создания      router.back();

    } catch (error) {
      Alert.alert("Ошибка", "Не удалось создать персонажа");
      console.error("Create character error:", error);
    }
  };

  // временные цвета слотов
  const armorColors = [
    "#8B4513",
    "#B87333",
    "#1E90FF",
    "#228B22",
    "#8B008B",
    "#DAA520",
  ];
  const weaponColors = [
    "#006400",
    "#000000",
    "#1E90FF",
    "#228B22",
    "#8B008B",
    "#DAA520",
  ];
  const spellColors = [
    "#4169E1",
    "#FF8C00",
    "#1E90FF",
    "#228B22",
    "#8B008B",
    "#DAA520",
  ];

     const renderEquipmentCard = (
    title: string,
    colors: string[],
    onArrowPress?: () => void
  ) => {
   

    const slotSize = isMobile ? 70 : 91;
    const slotGap = 12;
    const containerWidth = 904; 
    const innerWidth = containerWidth - 48;
    const maxSlotsInRow = Math.max(
      1,
      Math.floor((innerWidth + slotGap) / (slotSize + slotGap))
    );
    const visibleColorCount = Math.max(0, maxSlotsInRow - 1);
    const visibleColors = colors.slice(0, visibleColorCount);

    return (
      <View style={styles.equipmentCard}>
        <View style={styles.equipmentHeader}>
          <Text style={styles.equipmentTitle}>{title}</Text>
          <TouchableOpacity
            style={styles.equipmentArrowButton}
            onPress={onArrowPress}
          >
            <ChevronRight size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.equipmentRow}>
          {/* первый слот — "+" */}
          <TouchableOpacity
            style={[
              styles.equipmentAddSlot,
              { width: slotSize, height: slotSize },
            ]}
            onPress={() => {
              // позже создания предмета
            }}
          >
            <Text style={styles.equipmentAddText}>+</Text>
          </TouchableOpacity>

          {/* цветные слоты */}
          {visibleColors.map((c, idx) => (
            <View
              key={`${title}-${idx}`}
              style={[
                styles.equipmentSlot,
                { width: slotSize, height: slotSize, backgroundColor: c },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };



  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.backgroundPrimary }}
      contentContainerStyle={{
        alignItems: "center",
        paddingTop: 80,
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
          strength={strength}
          dexterity={dexterity}
          intelligence={intelligence}
          wisdom={wisdom}
          charisma={charisma}
          level={level}
          skills={skills}
          onInitiativeChange={setInitiative}
          onArmorClassChange={setArmorClass}
          onSpeedChange={setSpeed}
          onHitPointsChange={setHitPoints}
          onTempHitPointsChange={setTempHitPoints}
          onHitDiceChange={setHitDice}
          onBackgroundChange={setBackground}
          onFeaturesChange={setFeatures}
          onSkillsChange={setSkills}
          dexterityMod={dexterityMod}
        />
      </View>

      {/* === БРОНЯ / ОРУЖИЕ / ЗАКЛИНАНИЯ === */}
      <View
        style={{
          width: "100%",
          maxWidth: 904,
          paddingHorizontal: 20,
          marginTop: 24,
        }}
      >
        {renderEquipmentCard("Ваша броня", armorColors, () =>
          router.push("/(app)/cabinet/armor")
        )}
        {renderEquipmentCard("Ваше оружие", weaponColors)}
        {renderEquipmentCard("Ваши заклинания", spellColors)}
      </View>



      {/* === КНОПКА СОЗДАНИЯ === */}
      <View
        style={{
          width: "100%",
          maxWidth: 904,
          paddingHorizontal: 20,
          marginTop: 24,
        }}
      >
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
          <Text
            style={{
              color: COLORS.textPrimary,
              fontSize: 24,
              fontWeight: "600",
              fontFamily: "Roboto",
            }}
          >
            {charactersStore.IsLoading ? "Создание..." : "Создать персонажа"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default observer(CharactersScreen);
