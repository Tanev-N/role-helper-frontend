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
import { spellStyles as styles } from "./styles";

type SpellComponent = {
  id: string;
  type: "Вербальный" | "Соматический" | "Материальный";
  description?: string;
};

type SpellItem = {
  id: string;
  name: string;
  school: string;
  level: string;
  castingTime: string;
  range: string;
  components: SpellComponent[];
  duration: string;
  description: string;
  higherLevels?: string;
  ritual: boolean;
  concentration: boolean;
  savingThrow?: string;
  damage?: string;
};

const SpellListScreen = observer(() => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const DESKTOP_MAX_WIDTH = 904;
  const containerWidth = Math.min(width * 0.95, DESKTOP_MAX_WIDTH);

  // ====== ТЕСТОВЫЕ ДАННЫЕ ======
  const [spellList, setSpellList] = useState<SpellItem[]>([
    {
      id: "spell-1",
      name: "Огненный шар",
      school: "воплощение",
      level: "3 уровень",
      castingTime: "1 действие",
      range: "150 футов",
      components: [
        { id: "c1", type: "Вербальный" },
        { id: "c2", type: "Соматический" },
        { id: "c3", type: "Материальный", description: "кусочек серы" },
      ],
      duration: "Мгновенное",
      description: "Яркая вспышка вырывается из вашей руки...",
      higherLevels: "При накладывании на 4 уровень и выше: +1к6 урона за каждый уровень выше 3-го.",
      ritual: false,
      concentration: false,
      savingThrow: "Ловкость",
      damage: "8к6 огненного урона",
    },
    {
      id: "spell-2",
      name: "Лечение ран",
      school: "некромантия",
      level: "1 уровень",
      castingTime: "1 действие",
      range: "Касание",
      components: [
        { id: "c4", type: "Вербальный" },
        { id: "c5", type: "Соматический" },
      ],
      duration: "Мгновенное",
      description: "Существо, которого вы касаетесь, восстанавливает хиты...",
      ritual: false,
      concentration: false,
      damage: "1к8 + модификатор мудрости",
    },
  ]);

  // ====== СОЗДАНИЕ ЗАКЛИНАНИЯ (МОДАЛКА) ======
  const [createVisible, setCreateVisible] = useState(false);

  const [formName, setFormName] = useState("");
  const [formSchool, setFormSchool] = useState("");
  const [formLevel, setFormLevel] = useState("");
  const [formCastingTime, setFormCastingTime] = useState("");
  const [formRange, setFormRange] = useState("");
  const [formComponents, setFormComponents] = useState<SpellComponent[]>([
    { id: "temp-1", type: "Вербальный" },
  ]);
  const [formDuration, setFormDuration] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formHigherLevels, setFormHigherLevels] = useState("");
  const [formRitual, setFormRitual] = useState(false);
  const [formConcentration, setFormConcentration] = useState(false);
  const [formSavingThrow, setFormSavingThrow] = useState("");
  const [formDamage, setFormDamage] = useState("");

  const resetForm = () => {
    setFormName("");
    setFormSchool("");
    setFormLevel("");
    setFormCastingTime("");
    setFormRange("");
    setFormComponents([{ id: "temp-1", type: "Вербальный" }]);
    setFormDuration("");
    setFormDescription("");
    setFormHigherLevels("");
    setFormRitual(false);
    setFormConcentration(false);
    setFormSavingThrow("");
    setFormDamage("");
  };

  const handleAddSpell = () => {
    if (!formName.trim()) return;

    const newSpell: SpellItem = {
      id: `spell-${Date.now()}`,
      name: formName.trim(),
      school: formSchool.trim() || "школа магии",
      level: formLevel.trim() || "0 уровень",
      castingTime: formCastingTime.trim() || "1 действие",
      range: formRange.trim() || "На себя",
      components: formComponents.filter(c => c.type),
      duration: formDuration.trim() || "Мгновенное",
      description: formDescription.trim(),
      higherLevels: formHigherLevels.trim() || undefined,
      ritual: formRitual,
      concentration: formConcentration,
      savingThrow: formSavingThrow.trim() || undefined,
      damage: formDamage.trim() || undefined,
    };

    setSpellList((prev) => [...prev, newSpell]);
    resetForm();
    setCreateVisible(false);
  };

  const handleAddComponent = () => {
    setFormComponents((prev) => [
      ...prev,
      { id: `comp-${Date.now()}`, type: "Вербальный" },
    ]);
  };

  const updateComponent = (
    id: string,
    field: keyof SpellComponent,
    value: string
  ) => {
    setFormComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const removeComponent = (id: string) => {
    setFormComponents((prev) => prev.filter((c) => c.id !== id));
  };

  // ====== РЕНДЕР КАРТОЧКИ ЗАКЛИНАНИЯ ======
  const renderSpellCard = (spell: SpellItem) => {
    const getComponentColor = (type: string) => {
      switch (type) {
        case "Вербальный": return "#4A90E2";
        case "Соматический": return "#7B68EE";
        case "Материальный": return "#FF6B6B";
        default: return "#666";
      }
    };

    return (
      <View key={spell.id} style={styles.card}>
        {/* Заголовок карточки */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {spell.name}{" "}
            <Text style={styles.cardTitleSchool}>/ {spell.school}</Text>
          </Text>
          <View style={styles.cardLevelBadge}>
            <Text style={styles.cardLevelText}>{spell.level}</Text>
          </View>
        </View>

        {/* Первая строка - Основная информация */}
        <View style={[styles.row, isMobile && styles.rowMobile]}>
          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Время накладывания:</Text>
            <Text style={styles.valueHighlight}>{spell.castingTime}</Text>
          </View>

          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Дистанция:</Text>
            <Text style={styles.valueBlue}>{spell.range}</Text>
          </View>

          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Длительность:</Text>
            <Text style={styles.value}>
              {spell.concentration ? "Концентрация, " : ""}{spell.duration}
            </Text>
          </View>
        </View>

        {/* Вторая строка - Компоненты */}
        <View style={[styles.row, isMobile && styles.rowMobile]}>
          <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
            <Text style={styles.label}>Компоненты:</Text>
            <View style={styles.componentsRow}>
              {spell.components.map((c) => (
                <View
                  key={c.id}
                  style={[
                    styles.componentBadge,
                    { backgroundColor: getComponentColor(c.type) },
                  ]}
                >
                  <Text style={styles.componentText}>
                    {c.type}
                    {c.description && ` (${c.description})`}
                  </Text>
                </View>
              ))}
              {spell.ritual && (
                <View style={[styles.componentBadge, { backgroundColor: "#FFA500" }]}>
                  <Text style={styles.componentText}>Ритуал</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Третья строка - Урон/Спасбросок */}
        {(spell.damage || spell.savingThrow) && (
          <View style={[styles.row, isMobile && styles.rowMobile]}>
            {spell.damage && (
              <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
                <Text style={styles.label}>Урон/Эффект:</Text>
                <Text style={styles.valueGold}>{spell.damage}</Text>
              </View>
            )}
            {spell.savingThrow && (
              <View style={[styles.infoBox, isMobile && styles.infoBoxMobile]}>
                <Text style={styles.label}>Спасбросок:</Text>
                <Text style={styles.valueRed}>{spell.savingThrow}</Text>
              </View>
            )}
          </View>
        )}

        {/* Описание заклинания */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{spell.description}</Text>
        </View>

        {/* На более высоких уровнях */}
        {spell.higherLevels && (
          <View style={styles.higherLevelsBox}>
            <Text style={styles.higherLevelsLabel}>На более высоких уровнях:</Text>
            <Text style={styles.higherLevelsText}>{spell.higherLevels}</Text>
          </View>
        )}
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
          <Text style={styles.pageTitle}>СПИСОК ЗАКЛИНАНИЙ</Text>
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
            {spellList.map(renderSpellCard)}
          </View>
        </View>
      </ScrollView>

      {/* Модалка создания заклинания */}
      <Modal
        visible={createVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { width: containerWidth }]}>
            {/* Заголовок модалки: название / школа магии */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <TextInput
                  style={styles.modalTitleInput}
                  value={formName}
                  onChangeText={setFormName}
                  placeholder="Название заклинания"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
                <Text style={styles.modalTitleSlash}>/</Text>
                <TextInput
                  style={[styles.modalTitleInput, styles.modalTitleInputType]}
                  value={formSchool}
                  onChangeText={setFormSchool}
                  placeholder="школа магии"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>
              <View style={styles.modalLevelRow}>
                <TextInput
                  style={styles.modalLevelInput}
                  value={formLevel}
                  onChangeText={setFormLevel}
                  placeholder="Уровень заклинания"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>
            </View>

            <View style={styles.modalBody}>
              {/* Время накладывания */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Время накладывания:</Text>
                <TextInput
                  style={inlineInputStyle}
                  value={formCastingTime}
                  onChangeText={setFormCastingTime}
                  placeholder="1 действие"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>

              {/* Дистанция */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Дистанция:</Text>
                <TextInput
                  style={inlineInputStyle}
                  value={formRange}
                  onChangeText={setFormRange}
                  placeholder="150 футов"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>

              {/* Длительность */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Длительность:</Text>
                <View style={{ flex: 1, flexDirection: "row", gap: 16 }}>
                  <TextInput
                    style={[styles.modalInput, { flex: 1 }]}
                    value={formDuration}
                    onChangeText={setFormDuration}
                    placeholder="Мгновенное"
                    placeholderTextColor={COLORS.textLowEmphasis}
                  />
                  <TouchableOpacity
                    style={[
                      styles.checkboxButton,
                      formConcentration && styles.checkboxButtonActive,
                    ]}
                    onPress={() => setFormConcentration(!formConcentration)}
                  >
                    <Text style={styles.checkboxText}>Концентрация</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Компоненты */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Компоненты:</Text>
                <View style={{ flex: 1 }}>
                  {formComponents.map((c) => (
                    <View key={c.id} style={styles.componentInputRow}>
                      <View style={styles.componentTypeSelector}>
                        {(["Вербальный", "Соматический", "Материальный"] as const).map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              styles.componentTypeButton,
                              c.type === type && styles.componentTypeButtonActive,
                            ]}
                            onPress={() => updateComponent(c.id, "type", type)}
                          >
                            <Text style={[
                              styles.componentTypeText,
                              c.type === type && styles.componentTypeTextActive,
                            ]}>
                              {type[0]}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      <TextInput
                        style={[styles.modalInput, { flex: 1 }]}
                        value={c.description || ""}
                        onChangeText={(val) => updateComponent(c.id, "description", val)}
                        placeholder="Описание (для материального)"
                        placeholderTextColor={COLORS.textLowEmphasis}
                      />
                      {formComponents.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removeComponent(c.id)}
                          style={styles.removeButton}
                        >
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={handleAddComponent}
                    style={styles.addComponentButton}
                  >
                    <Text style={styles.addComponentText}>
                      + Добавить компонент
                    </Text>
                  </TouchableOpacity>

                  {/* Ритуал */}
                  <TouchableOpacity
                    style={[
                      styles.ritualButton,
                      formRitual && styles.ritualButtonActive,
                    ]}
                    onPress={() => setFormRitual(!formRitual)}
                  >
                    <Text style={styles.ritualText}>
                      {formRitual ? "✓" : ""} Ритуальное заклинание
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Спасбросок */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Спасбросок:</Text>
                <TextInput
                  style={inlineInputStyle}
                  value={formSavingThrow}
                  onChangeText={setFormSavingThrow}
                  placeholder="Сила / Ловкость / и т.д."
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>

              {/* Урон/Эффект */}
              <View style={styles.modalRow}>
                <Text style={inlineLabelStyle}>Урон/Эффект:</Text>
                <TextInput
                  style={inlineInputStyle}
                  value={formDamage}
                  onChangeText={setFormDamage}
                  placeholder="8к6 огненного урона"
                  placeholderTextColor={COLORS.textLowEmphasis}
                />
              </View>

              {/* Описание */}
              <View style={styles.modalRow}>
                <Text style={[styles.modalLabel, { marginBottom: 8 }]}>Описание:</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextArea]}
                  value={formDescription}
                  onChangeText={setFormDescription}
                  placeholder="Подробное описание эффекта заклинания..."
                  placeholderTextColor={COLORS.textLowEmphasis}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* На более высоких уровнях */}
              <View style={styles.modalRow}>
                <Text style={[styles.modalLabel, { marginBottom: 8 }]}>На более высоких уровнях:</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextArea]}
                  value={formHigherLevels}
                  onChangeText={setFormHigherLevels}
                  placeholder="Эффект при накладывании на более высоком уровне..."
                  placeholderTextColor={COLORS.textLowEmphasis}
                  multiline
                  numberOfLines={3}
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
                onPress={handleAddSpell}
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

export default SpellListScreen;