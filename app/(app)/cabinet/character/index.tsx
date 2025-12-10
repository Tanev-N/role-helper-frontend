import { createEndpointImage } from "@/api/api";
import CharacterMain from "@/components/Character/CharacterMain";
import CharacterSecondary from "@/components/Character/CharacterSecondary";
import { characterStyles as styles } from "@/components/Character/styles";
import { COLORS } from "@/constant/colors";
import { imagesUrlDefault } from "@/constant/default_images";
import useStore from "@/hooks/store";
import { CharacterSkill } from "@/stores/Characters/api";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Toast from "react-native-toast-message";

const CharactersScreen = () => {
  const router = useRouter();
  const { charactersStore, imageStore } = useStore();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Состояние валидации формы
  const [isFormValid, setIsFormValid] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);


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
  // const spellColors = [
  //   "#4169E1",
  //   "#FF8C00",
  //   "#1E90FF",
  //   "#228B22",
  //   "#8B008B",
  //   "#DAA520",
  // ];

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

  // Функция для проверки всех обязательных полей
  const validateAllFields = (): boolean => {
    // Проверка обязательных текстовых полей
    if (!name.trim()) {
      return false;
    }
    if (!race.trim()) {
      return false;
    }
    if (!className.trim()) {
      return false;
    }

    // Проверка уровня
    const levelNum = parseInt(level);
    if (!levelNum || levelNum < 1 || levelNum > 20) {
      return false;
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
      return false;
    }

    return true;
  };

  // Эффект для проверки валидности формы при изменении полей
  useEffect(() => {
    const isValid = validateAllFields();
    setIsFormValid(isValid);
  }, [name, race, className, level, strength, dexterity, constitution, intelligence, wisdom, charisma]);

  const handleCreateCharacter = async () => {
    // Дополнительная проверка перед отправкой
    if (!isFormValid) {
      // Находим конкретную ошибку для показа пользователю
      if (!name.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2: 'Введите имя персонажа',
          position: 'top',
          visibilityTime: 3000,
        });
        return;
      }
      if (!race.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2: 'Введите расу персонажа',
          position: 'top',
          visibilityTime: 3000,
        });
        return;
      }
      if (!className.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2: 'Введите класс персонажа',
          position: 'top',
          visibilityTime: 3000,
        });
        return;
      }

      const levelNum = parseInt(level);
      if (!levelNum || levelNum < 1 || levelNum > 20) {
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2: 'Введите корректный уровень (1-20)',
          position: 'top',
          visibilityTime: 3000,
        });
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

      const invalidStat = Object.entries(stats).find(([key, value]) => value < 1 || value > 30);
      if (invalidStat) {
        const statLabels: Record<string, string> = {
          strength: 'Сила',
          dexterity: 'Ловкость',
          constitution: 'Телосложение',
          intelligence: 'Интеллект',
          wisdom: 'Мудрость',
          charisma: 'Харизма'
        };
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2: `Характеристика "${statLabels[invalidStat[0]]}" должна быть в диапазоне 1-30`,
          position: 'top',
          visibilityTime: 3000,
        });
        return;
      }
    }

    try {
      let photo = "";

      // Показываем заставку генерации изображения
      setIsGeneratingImage(true);

      // Запускаем анимацию пульсации
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animationRef.current.start();

      const imageUrlRaw = await imageStore.generateCharacterImage(race, className, name, background, features);

      // Скрываем заставку после генерации
      setIsGeneratingImage(false);
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      pulseAnim.setValue(1);

      if (imageUrlRaw) {
        photo = createEndpointImage(imageUrlRaw);
      }
      else {
        photo = imagesUrlDefault.charactersUrl;
      }

      await charactersStore.createCharacter({
        name: name.trim(),
        race: race.trim(),
        class: className.trim(),
        level: parseInt(level),
        alignment: alignment.trim() || undefined,
        background: background.trim() || undefined,
        strength: parseInt(strength),
        dexterity: parseInt(dexterity),
        constitution: parseInt(constitution),
        intelligence: parseInt(intelligence),
        wisdom: parseInt(wisdom),
        charisma: parseInt(charisma),
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

      // Автоматический переход на предыдущую страницу после успешного создания
      router.back();

    } catch (error) {
      setIsGeneratingImage(false);
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      pulseAnim.setValue(1);
      Alert.alert("Ошибка", "Не удалось создать персонажа");
      console.error("Create character error:", error);
    }
  };

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
    <>
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
            onValidationChange={setIsFormValid}
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
            router.push("/(app)/cabinet/armor" as any)
          )}

          {renderEquipmentCard("Ваше оружие", weaponColors, () =>
            router.push("/(app)/cabinet/weapon" as any)
          )}

          {/* {renderEquipmentCard("Ваши заклинания", spellColors, () =>
          router.push("/(app)/cabinet/spells")
        )} */}
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
            disabled={charactersStore.IsLoading || !isFormValid}
            style={{
              backgroundColor: isFormValid ? COLORS.primary : COLORS.disabled,
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
                color: isFormValid ? COLORS.textPrimary : COLORS.textSecondary,
                fontSize: 24,
                fontWeight: "600",
                fontFamily: "Roboto",
              }}
            >
              {charactersStore.IsLoading ? "Создание..." : "Создать персонажа"}
            </Text>
          </TouchableOpacity>

          {!isFormValid && !charactersStore.IsLoading && (
            <Text style={{
              color: COLORS.error,
              fontSize: 14,
              textAlign: 'center',
              marginTop: 8,
            }}>
              Заполните все обязательные поля корректно
            </Text>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isGeneratingImage}
        transparent={true}
        animationType="fade"
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <View style={{
            backgroundColor: COLORS.backgroundSecondary,
            borderRadius: 24,
            padding: 40,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <Animated.View style={{
              transform: [{ scale: pulseAnim }],
              marginBottom: 24,
            }}>
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{ marginBottom: 8 }}
              />
            </Animated.View>

            <Text style={{
              fontFamily: "Roboto",
              fontWeight: "600",
              fontSize: 20,
              color: COLORS.textPrimary,
              marginBottom: 8,
              textAlign: "center",
            }}>
              Генерация с помощью AI
            </Text>

            <Text style={{
              fontFamily: "Roboto",
              fontWeight: "400",
              fontSize: 14,
              color: COLORS.textSecondary,
              textAlign: "center",
              marginTop: 8,
            }}>
              Создаём изображение персонажа...
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default observer(CharactersScreen);