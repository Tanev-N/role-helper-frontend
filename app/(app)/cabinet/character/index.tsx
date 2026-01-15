import { createEndpointImage } from "@/api/api";
import CharacterMain from "@/components/Character/CharacterMain";
import CharacterSecondary from "@/components/Character/CharacterSecondary";
import { characterStyles as styles } from "@/components/Character/styles";
import { COLORS } from "@/constant/colors";
import { imagesUrlDefault } from "@/constant/default_images";
import useStore from "@/hooks/store";
import { CharacterSkill } from "@/stores/Characters/api";
import { CharacterFormDraft } from "@/stores/Characters/CharactersStore";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  ImageBackground,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Toast from "react-native-toast-message";

type CharactersScreenProps = {
  characterId?: string;
  mode?: "create" | "edit";
  onUpdated?: () => void;
};

const CharactersScreen = ({
  characterId,
  mode = "create",
  onUpdated,
}: CharactersScreenProps) => {
  const router = useRouter();
  const { charactersStore, imageStore, itemStore } = useStore();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isEditMode = mode === "edit";

  // Состояние валидации формы
  const [isFormValid, setIsFormValid] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);



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
  const photoRef = useRef(photo);
  
  // Обновляем ref при изменении photo
  useEffect(() => {
    photoRef.current = photo;
  }, [photo]);

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
  const [selectedArmorId, setSelectedArmorId] = useState<string | null>(null);
  const [selectedWeaponId, setSelectedWeaponId] = useState<string | null>(null);

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

  // Применяем данные персонажа в форму
  const applyCharacterToForm = (c: any) => {
    setName(c?.name ?? "");
    setRace(c?.race ?? "");
    setLevel(String(c?.level ?? ""));
    setClassName(c?.class ?? "");
    setAlignment(c?.alignment ?? "");
    setStrength(String(c?.strength ?? 1));
    setDexterity(String(c?.dexterity ?? 1));
    setConstitution(String(c?.constitution ?? 1));
    setIntelligence(String(c?.intelligence ?? 1));
    setWisdom(String(c?.wisdom ?? 1));
    setCharisma(String(c?.charisma ?? 1));
    setPhoto(c?.photo ?? "");
    setInitiative(c?.initiative ? String(c.initiative) : "");
    setArmorClass(c?.armor_class ? String(c.armor_class) : "");
    setSpeed(c?.speed ? String(c.speed) : "");
    setHitPoints(c?.hit_points ? String(c.hit_points) : "");
    setTempHitPoints(c?.temp_hit_points ? String(c.temp_hit_points) : "");
    setHitDice(c?.hit_dice ?? "");
    setBackground(c?.background ?? "");
    setFeatures(c?.features ?? "");
    setSkills(c?.skills ?? []);
    setSelectedArmorId(
      c?.armor_id !== undefined && c?.armor_id !== null
        ? String(c.armor_id)
        : null
    );
    setSelectedWeaponId(
      c?.weapon_id !== undefined && c?.weapon_id !== null
        ? String(c.weapon_id)
        : null
    );
  };

  const applyDraftToForm = (draft: CharacterFormDraft) => {
    setName(draft.name ?? "");
    setRace(draft.race ?? "");
    setLevel(draft.level ?? "");
    setClassName(draft.className ?? "");
    setAlignment(draft.alignment ?? "");
    setStrength(draft.strength ?? "1");
    setDexterity(draft.dexterity ?? "1");
    setConstitution(draft.constitution ?? "1");
    setIntelligence(draft.intelligence ?? "1");
    setWisdom(draft.wisdom ?? "1");
    setCharisma(draft.charisma ?? "1");
    setPhoto(draft.photo ?? "");
    setInitiative(draft.initiative ?? "");
    setArmorClass(draft.armorClass ?? "");
    setSpeed(draft.speed ?? "");
    setHitPoints(draft.hitPoints ?? "");
    setTempHitPoints(draft.tempHitPoints ?? "");
    setHitDice(draft.hitDice ?? "");
    setBackground(draft.background ?? "");
    setFeatures(draft.features ?? "");
    setSkills(draft.skills ?? []);
    setSelectedArmorId(draft.selectedArmorId ?? null);
    setSelectedWeaponId(draft.selectedWeaponId ?? null);
  };

  const buildDraft = (): CharacterFormDraft => ({
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
    initiative,
    armorClass,
    speed,
    hitPoints,
    tempHitPoints,
    hitDice,
    background,
    features,
    skills,
    selectedArmorId,
    selectedWeaponId,
  });

  // Загружаем персонажа для редактирования
  useEffect(() => {
    if (!isEditMode || !characterId) return;
    const existing = charactersStore.getCharacterById(characterId);
    if (existing) {
      applyCharacterToForm(existing);
      setIsFormValid(true);
      return;
    }
    (async () => {
      const loaded = await charactersStore.fetchCharacterById(characterId, true);
      if (loaded) {
        applyCharacterToForm(loaded);
        setIsFormValid(true);
      }
    })();
  }, [isEditMode, characterId, charactersStore]);

  // Поднимаем черновик из стора при повторном заходе на страницу создания
  useEffect(() => {
    if (isEditMode) return;
    const draft = charactersStore.getCharacterDraft;
    if (draft) {
      applyDraftToForm(draft);
    }
  }, [charactersStore, isEditMode]);

  // Сохраняем черновик в стор при каждом изменении полей, чтобы не потерять данные после навигации
  useEffect(() => {
    if (isEditMode) return;
    charactersStore.saveCharacterDraft(buildDraft());
  }, [
    isEditMode,
    charactersStore,
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
    initiative,
    armorClass,
    speed,
    hitPoints,
    tempHitPoints,
    hitDice,
    background,
    features,
    skills,
    selectedArmorId,
    selectedWeaponId,
  ]);

  // Загружаем списки брони/оружия для выбора
  useEffect(() => {
    itemStore.fetchArmors();
    itemStore.fetchWeapons();
  }, [itemStore]);

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
      let nextPhoto = photo;
      let shouldUploadPhotoAfterCreate = false;
      let photoUriToUpload = "";

      // Проверяем, выбрал ли пользователь фото (blob/file/content URI означает выбор из галереи)
      const isPhotoSelected = photo && (
        photo.startsWith('blob:') || 
        photo.startsWith('file://') || 
        photo.startsWith('content://') ||
        photo.startsWith('ph://')
      );
      // Проверяем, загружено ли фото на сервер (URL начинается с https://)
      const isPhotoUploaded = photo && photo.startsWith('https://') && photo.trim() !== '';
      
      if (!isEditMode) {
        if (isPhotoSelected) {
          // Если пользователь выбрал фото при создании, не используем LLM
          // Сохраним URI для загрузки после создания персонажа
          shouldUploadPhotoAfterCreate = true;
          photoUriToUpload = photo;
          // Не устанавливаем дефолтное фото - оставляем undefined, чтобы сервер не перезаписал выбранное фото
          nextPhoto = undefined;
        } else if (!isPhotoUploaded) {
          // Показываем заставку генерации изображения только если фото не выбрано и не загружено
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
            nextPhoto = createEndpointImage(imageUrlRaw);
          } else {
            nextPhoto = imagesUrlDefault.charactersUrl;
          }
        } else {
          // Если фото уже загружено на сервер, используем его
          nextPhoto = photo;
        }
      } else {
        // При редактировании используем текущее фото из состояния
        // ВАЖНО: Используем photoRef.current для получения актуального значения,
        // так как состояние может не обновиться синхронно
        const characterFromStore = characterId ? charactersStore.getCharacterById(characterId) : null;
        
        // Используем актуальное значение из ref (которое обновляется через useEffect)
        const currentPhotoFromState = photoRef.current || photo;
        
        // Приоритет: photo из состояния (ref) > photo из стора
        let currentPhoto = currentPhotoFromState;
        if (!currentPhoto || currentPhoto.trim() === "") {
          currentPhoto = characterFromStore?.photo || "";
        }
        
        console.log("Edit mode - photo from state (photo):", photo);
        console.log("Edit mode - photo from ref (photoRef.current):", photoRef.current);
        console.log("Edit mode - photo from store:", characterFromStore?.photo);
        console.log("Edit mode - currentPhoto (final):", currentPhoto);
        
        if (currentPhoto && currentPhoto.trim() !== "") {
          // Если фото есть, используем его
          nextPhoto = currentPhoto;
        } else {
          // Если фото пустое, не отправляем его (сервер оставит текущее или установит дефолтное)
          nextPhoto = undefined;
        }
      }

      const payload = {
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
        photo: nextPhoto ? nextPhoto.trim() || undefined : undefined,
        skills: skills.length > 0 ? skills : undefined,
        armor_id: selectedArmorId ? parseInt(selectedArmorId) : undefined,
        weapon_id: selectedWeaponId ? parseInt(selectedWeaponId) : undefined,
      };

      if (isEditMode && characterId) {
        // Логируем для отладки
        console.log("=== SAVING CHARACTER ===");
        console.log("Photo from state:", photo);
        console.log("Photo from store:", charactersStore.getCharacterById(characterId)?.photo);
        console.log("nextPhoto (will be sent):", nextPhoto);
        console.log("payload.photo:", payload.photo);
        console.log("========================");
        
        await charactersStore.updateCharacter(characterId, payload);
        Toast.show({
          type: "success",
          text1: "Сохранено",
          text2: "Персонаж обновлен",
          position: "top",
          visibilityTime: 2000,
        });
        onUpdated?.();
      } else {
        const createdCharacter = await charactersStore.createCharacter(payload as any);
        
        // Если нужно загрузить фото после создания, загружаем его
        if (shouldUploadPhotoAfterCreate && photoUriToUpload && createdCharacter?.id) {
          await charactersStore.uploadPhoto(createdCharacter.id, photoUriToUpload);
        }
        
        charactersStore.clearCharacterDraft();
        // Автоматический переход на предыдущую страницу после успешного создания
        router.back();
      }
    } catch (error) {
      setIsGeneratingImage(false);
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      pulseAnim.setValue(1);
      Alert.alert("Ошибка", isEditMode ? "Не удалось обновить персонажа" : "Не удалось создать персонажа");
      console.error("Character submit error:", error);
    }
  };

  const renderEquipmentCard = (
    title: string,
    items: { id: number; name: string; photo?: string }[],
    onAddPress: () => void,
    selectedId: string | null,
    onSelect: (id: string) => void
  ) => {
    const slotSize = isMobile ? 70 : 91;
    const slotGap = 12;
    const containerWidth = 904;
    const innerWidth = containerWidth - 48;
    const maxSlotsInRow = Math.max(
      1,
      Math.floor((innerWidth + slotGap) / (slotSize + slotGap))
    );
    const visibleItems = items.slice(0, Math.max(0, maxSlotsInRow - 1));

    return (
      <View style={styles.equipmentCard}>
        <View style={styles.equipmentHeader}>
          <Text style={styles.equipmentTitle}>{title}</Text>
          <TouchableOpacity
            style={styles.equipmentArrowButton}
            onPress={onAddPress}
          >
            <ChevronRight size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.equipmentRow}>
          <TouchableOpacity
            style={[
              styles.equipmentAddSlot,
              { width: slotSize, height: slotSize },
            ]}
            onPress={onAddPress}
          >
            <Text style={styles.equipmentAddText}>+</Text>
          </TouchableOpacity>

          {visibleItems.map((item) => (
            <TouchableOpacity
              key={`${title}-${item.id}`}
              style={[
                styles.equipmentSlot,
                {
                  width: slotSize,
                  height: slotSize,
                  borderColor:
                    selectedId === String(item.id)
                      ? COLORS.primary
                      : "rgba(255,255,255,0.1)",
                  borderWidth: selectedId === String(item.id) ? 2 : 1,
                  backgroundColor: "#18191A",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 6,
                },
              ]}
              onPress={() => onSelect(String(item.id))}
            >
              <ImageBackground
                source={item.photo ? { uri: item.photo } : { uri: imagesUrlDefault.itemsUrl }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 8,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
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
          <Text
            style={[
              styles.sectionTitle,
              isMobile && { fontSize: 24 },
            ]}
          >
            {isEditMode
              ? isMobile
                ? "РЕДАКТИРОВАНИЕ\nПЕРСОНАЖА"
                : "РЕДАКТИРОВАНИЕ ПЕРСОНАЖА"
              : "ОСНОВНАЯ ИНФОРМАЦИЯ"}
          </Text>
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
            characterId={characterId}
            charactersStore={charactersStore}
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
          <Text
            style={[
              styles.sectionTitle,
              isMobile && { fontSize: 24 },
            ]}
          >
            {isMobile
              ? "ДОПОЛНИТЕЛЬНАЯ\nИНФОРМАЦИЯ"
              : "ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ"}
          </Text>
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
          {renderEquipmentCard(
            "Ваша броня",
            itemStore.getArmors,
            () => router.push("/(app)/cabinet/armor" as any),
            selectedArmorId,
            (id) => setSelectedArmorId(id)
          )}

          {renderEquipmentCard(
            "Ваше оружие",
            itemStore.getWeapons,
            () => router.push("/(app)/cabinet/weapon" as any),
            selectedWeaponId,
            (id) => setSelectedWeaponId(id)
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
              {charactersStore.IsLoading
                ? isEditMode ? "Сохранение..." : "Создание..."
                : isEditMode ? "Сохранить" : "Создать персонажа"}
            </Text>
          </TouchableOpacity>

          {!isFormValid && !charactersStore.IsLoading && (
            <Text style={{
              color: COLORS.error,
              fontSize: 14,
              textAlign: 'center',
              marginTop: 8,
            }}>
              {isEditMode
                ? "Проверьте корректность обязательных полей"
                : "Заполните все обязательные поля корректно"}
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