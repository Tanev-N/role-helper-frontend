import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { Armor } from "@/stores/Item/api";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { armorStyles as styles } from "./styles";

type ArmorModifier = {
  id: string;
  value: string;
  stat: string;
};

type ArmorItem = {
  id: string;
  name: string;
  type: string;
  ac: string;
  cost: string;
  rarity: string;
  stealthDisadvantage: string;
  strengthRequirement: string;
  weight: string;
  uniqueStats: string;
  charges: string;
  modifiers: ArmorModifier[];
};

const ArmorListScreen = observer(() => {
  const { itemStore } = useStore();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const DESKTOP_MAX_WIDTH = 904;
  const containerWidth = Math.min(width * 0.95, DESKTOP_MAX_WIDTH);

  useEffect(() => {
    itemStore.fetchArmors();
  }, [itemStore]);

  // ====== СОЗДАНИЕ БРОНИ (МОДАЛКА) ======
  const [createVisible, setCreateVisible] = useState(false);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("");         // тип предмета (заголовок)
  const [formAC, setFormAC] = useState("");
  const [formModifier, setFormModifier] = useState(""); // <-- отдельный стейт модификатора
  const [formCost, setFormCost] = useState("");
  const [formRarity, setFormRarity] = useState("");
  const [formStealth, setFormStealth] = useState("Нет");
  const [formStrengthReq, setFormStrengthReq] = useState("Нет");
  const [formWeight, setFormWeight] = useState("");
  const [formUnique, setFormUnique] = useState("Нет");
  const [formCharges, setFormCharges] = useState("Нет");
  const [formModifiers, setFormModifiers] = useState<ArmorModifier[]>([]);

  const resetForm = () => {
    setFormName("");
    setFormType("");
    setFormAC("");
    setFormModifier("");            // сбрасываем модификатор отдельно
    setFormCost("");
    setFormRarity("");
    setFormStealth("Нет");
    setFormStrengthReq("Нет");
    setFormWeight("");
    setFormUnique("Нет");
    setFormCharges("Нет");
    setFormModifiers([]);
  };

  const handleAddArmor = async () => {
    if (!formName.trim()) return;

    const payload = {
      name: formName.trim(),
      type: formType.trim() || undefined,
      armor_class: formAC ? parseInt(formAC) : undefined,
      modifier: formModifier.trim() || undefined,
      cost: formCost.trim() || undefined,
      rarity: formRarity.trim() || undefined,
      stealth_disadvantage: formStealth.trim() || undefined,
      strength_requirement: formStrengthReq.trim() || undefined,
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
    };

    await itemStore.createArmor(payload);
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

  const mapArmorToCard = (armor: Armor): ArmorItem => {
    const modifiersArr =
      armor.modifiers
        ?.split(",")
        .map((m) => m.trim())
        .filter(Boolean)
        .map((m, idx) => ({ id: `mod-${armor.id}-${idx}`, value: m, stat: "" })) ??
      [];
    const acText =
      armor.armor_class !== undefined
        ? armor.modifier
          ? `${armor.armor_class} + ${armor.modifier}`
          : String(armor.armor_class)
        : "—";

    return {
      id: String(armor.id),
      name: armor.name,
      type: armor.type ?? "тип предмета",
      ac: acText,
      cost: armor.cost ?? "—",
      rarity: armor.rarity ?? "Обычная",
      stealthDisadvantage: armor.stealth_disadvantage ?? "Нет",
      strengthRequirement: armor.strength_requirement ?? "Нет",
      weight: armor.weight ?? "—",
      uniqueStats: armor.unique_stats ?? "Нет",
      charges: armor.charges ?? "Нет",
      modifiers: modifiersArr,
    };
  };

  const armorList: ArmorItem[] = useMemo(
    () => itemStore.getArmors.map(mapArmorToCard),
    [itemStore.getArmors]
  );

  // ====== РЕНДЕР КАРТОЧКИ БРОНИ ======
  const renderArmorCard = (armor: ArmorItem) => {
    return (
      <View key={armor.id} style={styles.card}>
        <Text style={styles.cardTitle}>
          {armor.name} <Text style={styles.cardTitleType}>/ {armor.type}</Text>
        </Text>

        {/* Первая строка */}
        <View style={[styles.row, isMobile && styles.rowMobile]}>
          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <View style={styles.inlineStatRow}>
              <Text style={styles.inlineStatLabel}>Класс доспеха:</Text>
              <Text style={styles.inlineStatValue}>{armor.ac}</Text>
            </View>
          </View>

          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Стоимость:</Text>
            <Text style={styles.valueGold}>{armor.cost}</Text>
          </View>
          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Редкость</Text>
            <Text style={styles.valueBlue}>{armor.rarity}</Text>
          </View>
        </View>

        {/* Вторая строка */}
        <View style={[styles.row, isMobile && styles.rowMobile]}>
          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Помеха при скрытности:</Text>
            <Text style={styles.value}>{armor.stealthDisadvantage}</Text>
          </View>
          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Требование к силе:</Text>
            <Text style={styles.value}>{armor.strengthRequirement}</Text>
          </View>
          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Вес (в кг):</Text>
            <Text style={styles.value}>{armor.weight}</Text>
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
            <Text style={styles.value}>{armor.uniqueStats}</Text>

            {armor.modifiers.length > 0 && (
              <View style={styles.modifiersRow}>
                {armor.modifiers.map((m) => (
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
            <Text style={styles.value}>{armor.charges}</Text>
          </View>
        </View>
      </View>
    );
  };

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
          <Text style={styles.pageTitle}>СПИСОК БРОНИ</Text>
          <View style={styles.pageDivider} />

          <View style={styles.createButtonWrapper}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setCreateVisible(true)}
            >
              <Text style={styles.createButtonText}>Создать</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listWrapper}>{armorList.map(renderArmorCard)}</View>
        </View>
      </ScrollView>

      {/* Модалка создания */}
      <Modal
        visible={createVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { width: containerWidth }]}>
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
              <View style={styles.modalRow}>
                <View style={styles.inlineStatRow}>
                  <Text style={styles.inlineStatLabel}>Класс доспеха:</Text>
                  <TextInput
                    style={[styles.modalInput, { flex: 1 }]}
                    value={formAC}
                    onChangeText={setFormAC}
                    placeholder="11"
                    placeholderTextColor={COLORS.textLowEmphasis}
                  />
                </View>
                <View style={styles.inlineStatRow}>
                  <Text style={styles.inlineStatLabel}>Модификатор:</Text>
                  <TextInput
                    style={[styles.modalInput, { flex: 1 }]}
                    value={formModifier}
                    onChangeText={setFormModifier}
                    placeholder="Ловк."
                    placeholderTextColor={COLORS.textLowEmphasis}
                  />
                </View>
              </View>

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

              {/* Помеха для скрытности */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Помеха для скрытности:</Text>
                <TextInput
                  style={inlineInputStyle}
                  value={formStealth}
                  onChangeText={setFormStealth}
                  placeholder="Нет"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>

              {/* Требование к силе */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Требование к силе:</Text>
                <TextInput
                  style={inlineInputStyle}
                  value={formStrengthReq}
                  onChangeText={setFormStrengthReq}
                  placeholder="Нет"
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
                  placeholder="3"
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
                onPress={handleAddArmor}
              >
                <Text style={styles.footerButtonPrimaryText}>Добавить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
});

export default ArmorListScreen;
