import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  Modal,
} from "react-native";
import { observer } from "mobx-react-lite";
import { COLORS } from "@/constant/colors";
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
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const DESKTOP_MAX_WIDTH = 904;
  const containerWidth = Math.min(width * 0.95, DESKTOP_MAX_WIDTH);

  // ====== ТЕСТОВЫЕ ДАННЫЕ ======
  const [armorList, setArmorList] = useState<ArmorItem[]>([
    {
      id: "armor-1",
      name: "Кожаный доспех",
      type: "лёгкий доспех",
      ac: "11 + показатель ловкости",
      cost: "30 золотых",
      rarity: "Обычная",
      stealthDisadvantage: "Нет",
      strengthRequirement: "Нет",
      weight: "5",
      uniqueStats: "Нет",
      charges: "Нет",
      modifiers: [],
    },
    {
      id: "armor-2",
      name: "Хороший кожаный доспех",
      type: "лёгкий доспех",
      ac: "11 + показатель ловкости",
      cost: "60 золотых",
      rarity: "Редкое",
      stealthDisadvantage: "Нет",
      strengthRequirement: "12",
      weight: "5",
      uniqueStats: "Нет",
      charges: "55 / 60",
      modifiers: [
        { id: "m1", value: "+1", stat: "Сила" },
        { id: "m2", value: "+4", stat: "Ловкость" },
      ],
    },
  ]);

  // ====== СОЗДАНИЕ БРОНИ (МОДАЛКА) ======
  const [createVisible, setCreateVisible] = useState(false);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("");
  const [formAC, setFormAC] = useState("");
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
    setFormCost("");
    setFormRarity("");
    setFormStealth("Нет");
    setFormStrengthReq("Нет");
    setFormWeight("");
    setFormUnique("Нет");
    setFormCharges("Нет");
    setFormModifiers([]);
  };

  const handleAddArmor = () => {
    if (!formName.trim()) return;

    const newArmor: ArmorItem = {
      id: `armor-${Date.now()}`,
      name: formName.trim(),
      type: formType.trim() || "тип предмета",
      ac: formAC.trim() || "—",
      cost: formCost.trim() || "—",
      rarity: formRarity.trim() || "Обычная",
      stealthDisadvantage: formStealth.trim() || "Нет",
      strengthRequirement: formStrengthReq.trim() || "Нет",
      weight: formWeight.trim() || "—",
      uniqueStats: formUnique.trim() || "Нет",
      charges: formCharges.trim() || "Нет",
      modifiers: formModifiers,
    };

    setArmorList((prev) => [...prev, newArmor]);
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

  // ====== РЕНДЕР КАРТОЧКИ БРОНИ ======
  const renderArmorCard = (armor: ArmorItem) => {
    return (
      <View key={armor.id} style={styles.card}>
        {/* Заголовок карточки */}
        <Text style={styles.cardTitle}>
          {armor.name} <Text style={styles.cardTitleType}>/ {armor.type}</Text>
        </Text>

        {/* Первая строка */}
        <View
          style={[
            styles.row,
            isMobile && styles.rowMobile,
          ]}
        >
          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Класс доспеха:</Text>
            <Text style={styles.valueHighlight}>{armor.ac}</Text>
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
        <View
          style={[
            styles.row,
            isMobile && styles.rowMobile,
          ]}
        >
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
        <View
          style={[
            styles.row,
            isMobile && styles.rowMobile,
          ]}
        >
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
          <View style={styles.listWrapper}>
            {armorList.map(renderArmorCard)}
          </View>
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
                <View style={styles.modalFieldGroup}>
                  <Text style={styles.modalLabel}>Класс доспеха:</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={formAC}
                    onChangeText={setFormAC}
                    placeholder="11"
                    placeholderTextColor={COLORS.textLowEmphasis}
                  />
                </View>
                <View style={styles.modalFieldGroup}>
                  <Text style={styles.modalLabel}>Модификатор:</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={formType}
                    onChangeText={setFormType}
                    placeholder="Ловк."
                    placeholderTextColor={COLORS.textLowEmphasis}
                  />
                </View>
              </View>

              <View style={styles.modalRowSingle}>
                <Text style={styles.modalLabel}>Стоимость:</Text>
                <TextInput
                  style={styles.modalInput}
                  value={formCost}
                  onChangeText={setFormCost}
                  placeholder="30 золотых"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>

              <View style={styles.modalRowSingle}>
                <Text style={styles.modalLabel}>Редкость:</Text>
                <TextInput
                  style={styles.modalInput}
                  value={formRarity}
                  onChangeText={setFormRarity}
                  placeholder="Обычная"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>

              <View style={styles.modalRow}>
                <View style={styles.modalFieldGroup}>
                  <Text style={styles.modalLabel}>Помеха для скрытности:</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={formStealth}
                    onChangeText={setFormStealth}
                    placeholder="Нет"
                    placeholderTextColor={COLORS.textLowEmphasis}
                  />
                </View>
                <View style={styles.modalFieldGroup}>
                  <Text style={styles.modalLabel}>Требование к силе:</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={formStrengthReq}
                    onChangeText={setFormStrengthReq}
                    placeholder="Нет"
                    placeholderTextColor={COLORS.textLowEmphasis}
                  />
                </View>
              </View>

              <View style={styles.modalRowSingle}>
                <Text style={styles.modalLabel}>Вес (в кг):</Text>
                <TextInput
                  style={styles.modalInput}
                  value={formWeight}
                  onChangeText={setFormWeight}
                  placeholder="3"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>

              <View style={styles.modalUniqueBlock}>
                <Text style={styles.modalLabel}>Уникальные показатели:</Text>
                <TextInput
                  style={styles.modalInputWide}
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

              <View style={styles.modalRowSingle}>
                <Text style={styles.modalLabel}>Заряд:</Text>
                <TextInput
                  style={styles.modalInput}
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
