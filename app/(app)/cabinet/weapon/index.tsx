import { createEndpointImage } from "@/api/api";
import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { Weapon } from "@/stores/Item/api";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { weaponStyles as styles } from "./styles";

type WeaponModifier = {
  id: string;
  value: string;
  stat: string;
};

type WeaponItem = {
  id: string;
  name: string;
  type: string;
  damage: string;
  damageModifier: string;
  cost: string;
  rarity: string;
  grip: string;
  range: string;
  weight: string;
  uniqueStats: string;
  charges: string;
  modifiers: WeaponModifier[];
  photo?: string;
};

const WeaponListScreen = observer(() => {
  const { itemStore, imageStore } = useStore();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const DESKTOP_MAX_WIDTH = 904;
  const containerWidth = Math.min(width * 0.95, DESKTOP_MAX_WIDTH);

  useEffect(() => {
    itemStore.fetchWeapons();
  }, [itemStore]);

  // ====== СОЗДАНИЕ ОРУЖИЯ (МОДАЛКА) ======
  const [createVisible, setCreateVisible] = useState(false);

  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("");
  const [formDamage, setFormDamage] = useState("");
  const [formDamageMod, setFormDamageMod] = useState("");
  const [formCost, setFormCost] = useState("");
  const [formRarity, setFormRarity] = useState("");
  const [formGrip, setFormGrip] = useState("");
  const [formRange, setFormRange] = useState("");
  const [formWeight, setFormWeight] = useState("");
  const [formUnique, setFormUnique] = useState("Нет");
  const [formCharges, setFormCharges] = useState("Нет");
  const [formModifiers, setFormModifiers] = useState<WeaponModifier[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const resetForm = () => {
    setFormName("");
    setFormType("");
    setFormDamage("");
    setFormDamageMod("");
    setFormCost("");
    setFormRarity("");
    setFormGrip("");
    setFormRange("");
    setFormWeight("");
    setFormUnique("Нет");
    setFormCharges("Нет");
    setFormModifiers([]);
  };

  const handleAddWeapon = async () => {
    if (!formName.trim()) return;

    let photo: string | undefined;

    try {
      setIsGeneratingImage(true);
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

      const imagePath = await imageStore.generateItemImage(
        formName.trim(),
        "Оружие"
      );
      if (imagePath) {
        photo = createEndpointImage(imagePath);
      }
    } catch (e) {
      console.warn("weapon image generation failed", e);
    } finally {
      setIsGeneratingImage(false);
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      pulseAnim.setValue(1);
    }

    const payload = {
      name: formName.trim(),
      type: formType.trim() || undefined,
      damage: formDamage.trim() || undefined,
      modifier: formDamageMod.trim() || undefined,
      cost: formCost.trim() || undefined,
      rarity: formRarity.trim() || undefined,
      grip: formGrip.trim() || undefined,
      range_meters: formRange.trim() || undefined,
      weight: formWeight.trim() || undefined,
      unique_stats: formUnique.trim() || undefined,
      charges: formCharges.trim() || undefined,
      modifiers:
        formModifiers.length > 0
          ? formModifiers
            .map((m) => `${m.value?.trim()} ${m.stat?.trim()}`.trim())
            .filter(Boolean)
            .join(", ")
          : undefined,
      photo,
    };

    await itemStore.createWeapon(payload);
    resetForm();
    setCreateVisible(false);
  };

  const handleAddModifier = () => {
    setFormModifiers((prev) => [
      ...prev,
      { id: `mod-${Date.now()}`, value: "", stat: "" },
    ]);
  };

  const updateModifier = (
    id: string,
    field: "value" | "stat",
    value: string
  ) => {
    setFormModifiers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const mapWeaponToCard = (weapon: Weapon): WeaponItem => {
    const modifiersArr =
      weapon.modifiers
        ?.split(",")
        .map((m) => m.trim())
        .filter(Boolean)
        .map((m, idx) => ({ id: `mod-${weapon.id}-${idx}`, value: m, stat: "" })) ??
      [];
    return {
      id: String(weapon.id),
      name: weapon.name,
      type: weapon.type ?? "тип предмета",
      damage: weapon.damage ?? "—",
      damageModifier: weapon.modifier ?? "",
      cost: weapon.cost ?? "—",
      rarity: weapon.rarity ?? "Обычная",
      grip: weapon.grip ?? "—",
      range: weapon.range_meters ?? "—",
      weight: weapon.weight ?? "—",
      uniqueStats: weapon.unique_stats ?? "Нет",
      charges: weapon.charges ?? "Нет",
      modifiers: modifiersArr,
      photo: weapon.photo,
    };
  };

  const weaponList: WeaponItem[] = useMemo(
    () => itemStore.getWeapons.map(mapWeaponToCard),
    [itemStore.getWeapons]
  );

  // ====== РЕНДЕР КАРТОЧКИ ОРУЖИЯ ======
  const renderWeaponCard = (weapon: WeaponItem) => {
    const damageText = weapon.damageModifier
      ? `${weapon.damage} + ${weapon.damageModifier}`
      : weapon.damage;

    return (
      <View key={weapon.id} style={styles.card}>
        {/* Превью изображения, если есть */}
        {weapon.photo && (
          <View style={{ marginBottom: 12, alignItems: "center" }}>
            <Text style={styles.label}>Изображение:</Text>
            <View
              style={{
                width: "100%",
                borderRadius: 12,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <Text
                style={{
                  color: COLORS.textLowEmphasis,
                  textAlign: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 4,
                }}
              >
                {/* В RN web/Expo не гарантировано Image, оставляем URL для быстрого просмотра */}
                {weapon.photo}
              </Text>
            </View>
          </View>
        )}
        {/* Заголовок карточки */}
        <Text style={styles.cardTitle}>
          {weapon.name}{" "}
          <Text style={styles.cardTitleType}>/ {weapon.type}</Text>
        </Text>

        {/* Первая строка */}
        <View style={[styles.row, isMobile && styles.rowMobile]}>
          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Урон:</Text>
            <Text
              style={[
                styles.valueHighlight,
                { color: "#3FD452" }, // зелёный, как на макете
              ]}
            >
              {damageText}
            </Text>
          </View>

          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Стоимость:</Text>
            <Text style={styles.valueGold}>{weapon.cost}</Text>
          </View>

          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Редкость:</Text>
            <Text style={styles.valueBlue}>{weapon.rarity}</Text>
          </View>
        </View>

        {/* Вторая строка */}
        <View style={[styles.row, isMobile && styles.rowMobile]}>
          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Хват:</Text>
            <Text style={styles.value}>{weapon.grip}</Text>
          </View>

          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Дальность (в метрах):</Text>
            <Text style={styles.value}>{weapon.range}</Text>
          </View>

          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Вес (в кг):</Text>
            <Text style={styles.value}>{weapon.weight}</Text>
          </View>
        </View>

        {/* Третья строка */}
        <View style={[styles.row, isMobile && styles.rowMobile]}>
          <View
            style={[
              styles.infoBox,
              styles.infoBoxWide,
              isMobile && styles.infoBoxMobile,
            ]}
          >
            <Text style={styles.label}>Уникальные показатели:</Text>
            <Text style={styles.value}>{weapon.uniqueStats}</Text>

            {weapon.modifiers.length > 0 && (
              <View style={styles.modifiersRow}>
                {weapon.modifiers.map((m) => (
                  <View key={m.id} style={styles.modifierBadge}>
                    <Text style={styles.modifierText}>
                      {m.value} {m.stat}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View
            style={[
              styles.infoBox,
              styles.infoBoxNarrow,
              isMobile && styles.infoBoxMobile,
            ]}
          >
            <Text style={styles.label}>Заряды:</Text>
            <Text style={styles.value}>{weapon.charges}</Text>
          </View>
        </View>
      </View>
    );
  };

  // общий стиль для "лейбл + инпут в одну строку"
  const inlineLabelStyle = [
    styles.modalLabel,
    { marginBottom: 0, flexShrink: 0, width: 170 },
  ];
  const inlineInputStyle = [styles.modalInput, { flex: 1 }];

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.backgroundPrimary }}
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: isMobile ? 80 : 64,
          paddingBottom: 40,
        }}
      >
        <View style={{ width: containerWidth }}>
          <Text style={styles.pageTitle}>СПИСОК ОРУЖИЯ</Text>
          <View style={styles.pageDivider} />

          {/* Кнопка "Создать" */}
          <View style={styles.createButtonWrapper}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setCreateVisible(true)}
            >
              <Text style={styles.createButtonText}>Создать</Text>
            </TouchableOpacity>
          </View>

          {/* Список карточек */}
          <View style={styles.listWrapper}>{weaponList.map(renderWeaponCard)}</View>
        </View>
      </ScrollView>

      {/* Модалка создания оружия */}
      <Modal
        visible={createVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { width: containerWidth }]}>
            {/* Заголовок модалки: название / тип предмета */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <TextInput
                  style={styles.modalTitleInput}
                  value={formName}
                  onChangeText={setFormName}
                  placeholder="Название предмета"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
                <Text style={styles.modalTitleSlash}>/</Text>
                <TextInput
                  style={[styles.modalTitleInput, styles.modalTitleInputType]}
                  value={formType}
                  onChangeText={setFormType}
                  placeholder="тип предмета"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>
            </View>

            <View style={styles.modalBody}>
              {/* Урон + Модификатор */}
              <View style={styles.modalRow}>
                <View style={styles.inlineStatRow}>
                  <Text style={styles.inlineStatLabel}>Урон:</Text>
                  <TextInput
                    style={[styles.modalInput, { flex: 1 }]}
                    value={formDamage}
                    onChangeText={setFormDamage}
                    placeholder="1к8"
                    placeholderTextColor={COLORS.textLowEmphasis}
                  />
                </View>

                <View style={styles.inlineStatRow}>
                  <Text style={styles.inlineStatLabel}>Модификатор:</Text>
                  <TextInput
                    style={[styles.modalInput, { flex: 1 }]}
                    value={formDamageMod}
                    onChangeText={setFormDamageMod}
                    placeholder="Сила / Ловк."
                    placeholderTextColor={COLORS.textLowEmphasis}
                  />
                </View>
              </View>

              {/* Стоимость */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Стоимость:</Text>
                <TextInput
                  style={inlineInputStyle}
                  value={formCost}
                  onChangeText={setFormCost}
                  placeholder="30 золотых"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>

              {/* Редкость */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Редкость:</Text>
                <TextInput
                  style={inlineInputStyle}
                  value={formRarity}
                  onChangeText={setFormRarity}
                  placeholder="Обычная"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>

              {/* Хват */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Хват:</Text>
                <TextInput
                  style={inlineInputStyle}
                  value={formGrip}
                  onChangeText={setFormGrip}
                  placeholder="Одноручное / Двуручное"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>

              {/* Дальность */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Дальность (в метрах):</Text>
                <TextInput
                  style={inlineInputStyle}
                  value={formRange}
                  onChangeText={setFormRange}
                  placeholder="2.5"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>

              {/* Вес */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Вес (в кг):</Text>
                <TextInput
                  style={inlineInputStyle}
                  value={formWeight}
                  onChangeText={setFormWeight}
                  placeholder="5"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>

              {/* Уникальные показатели + модификаторы */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Уникальные показатели:</Text>
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={styles.modalInput}
                    value={formUnique}
                    onChangeText={setFormUnique}
                    placeholder="Введите текст"
                    placeholderTextColor={COLORS.textLowEmphasis}
                  />

                  {formModifiers.length > 0 && (
                    <View style={styles.modalModsGrid}>
                      {formModifiers.map((m) => (
                        <View key={m.id} style={styles.modalModRow}>
                          <TextInput
                            style={[styles.modalInput, styles.modalInputSmall]}
                            value={m.value}
                            onChangeText={(val) =>
                              updateModifier(m.id, "value", val)
                            }
                            placeholder="+2"
                            placeholderTextColor={COLORS.textLowEmphasis}
                          />
                          <TextInput
                            style={[styles.modalInput, styles.modalInputSmall]}
                            value={m.stat}
                            onChangeText={(val) =>
                              updateModifier(m.id, "stat", val)
                            }
                            placeholder="Сила"
                            placeholderTextColor={COLORS.textLowEmphasis}
                          />
                        </View>
                      ))}
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={handleAddModifier}
                    style={styles.addModifierButton}
                  >
                    <Text style={styles.addModifierText}>
                      + Добавить модификатор
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Заряд */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Заряд:</Text>
                <TextInput
                  style={inlineInputStyle}
                  value={formCharges}
                  onChangeText={setFormCharges}
                  placeholder="Нет"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>
            </View>

            {/* Футер модалки */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.footerButton, styles.footerButtonSecondary]}
                onPress={() => {
                  resetForm();
                  setCreateVisible(false);
                }}
              >
                <Text style={styles.footerButtonSecondaryText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButton, styles.footerButtonPrimary]}
                onPress={handleAddWeapon}
              >
                <Text style={styles.footerButtonPrimaryText}>Добавить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модалка генерации изображения */}
      <Modal visible={isGeneratingImage} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
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
            }}
          >
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
                marginBottom: 24,
              }}
            >
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{ marginBottom: 8 }}
              />
            </Animated.View>

            <Text
              style={{
                fontFamily: "Roboto",
                fontWeight: "600",
                fontSize: 20,
                color: COLORS.textPrimary,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Генерация с помощью AI
            </Text>

            <Text
              style={{
                fontFamily: "Roboto",
                fontWeight: "400",
                fontSize: 14,
                color: COLORS.textSecondary,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Создаём изображение предмета...
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
});

export default WeaponListScreen;
