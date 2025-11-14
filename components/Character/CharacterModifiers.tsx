import React, { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constant/colors";
import { CharacterSkill } from "../../stores/Characters/api";

interface CharacterModifiersProps {
    strength: string;
    dexterity: string;
    intelligence: string;
    wisdom: string;
    charisma: string;
    level: string;
    skills: CharacterSkill[];
    onSkillsChange: (skills: CharacterSkill[]) => void;
}

// Маппинг навыков к характеристикам
const SKILL_ABILITY_MAP: Record<string, "strength" | "dexterity" | "intelligence" | "wisdom" | "charisma"> = {
    "Атлетика": "strength",
    "Акробатика": "dexterity",
    "Ловкость рук": "dexterity",
    "Скрытность": "dexterity",
    "Анализ": "intelligence",
    "История": "intelligence",
    "Магия": "intelligence",
    "Природа": "intelligence",
    "Религия": "intelligence",
    "Внимательность": "wisdom",
    "Выживание": "wisdom",
    "Медицина": "wisdom",
    "Проницательность": "wisdom",
    "Уход за животными": "wisdom",
    "Выступление": "charisma",
    "Запугивание": "charisma",
    "Обман": "charisma",
    "Убеждение": "charisma",
};

// Маппинг характеристик к русским названиям
const ABILITY_NAMES: Record<string, { short: string; color: string }> = {
    strength: { short: "сил", color: COLORS.strength },
    dexterity: { short: "лов", color: COLORS.dexterity },
    intelligence: { short: "инт", color: COLORS.intelligence },
    wisdom: { short: "мдр", color: COLORS.wisdom },
    charisma: { short: "хар", color: COLORS.charisma },
};

const ALL_SKILLS = [
    "Атлетика",
    "Акробатика",
    "Ловкость рук",
    "Скрытность",
    "Анализ",
    "История",
    "Магия",
    "Природа",
    "Религия",
    "Внимательность",
    "Выживание",
    "Медицина",
    "Проницательность",
    "Уход за животными",
    "Выступление",
    "Запугивание",
    "Обман",
    "Убеждение",
];

// Расчет бонуса мастерства по уровню
const calculateProficiencyBonus = (level: number): number => {
    return Math.floor((level - 1) / 4) + 2;
};

// Расчет модификатора характеристики
const calculateAbilityModifier = (abilityValue: string): number => {
    const num = parseInt(abilityValue) || 0;
    return Math.floor((num - 10) / 2);
};

const CharacterModifiers = ({
    strength,
    dexterity,
    intelligence,
    wisdom,
    charisma,
    level,
    skills,
    onSkillsChange,
}: CharacterModifiersProps) => {
    const levelNum = parseInt(level) || 1;
    const proficiencyBonus = calculateProficiencyBonus(levelNum);
    const customSkillsRef = useRef<Set<string>>(new Set());

    // Автоматически обновляем базовые значения навыков при изменении характеристик/уровня
    useEffect(() => {
        // Инициализируем все навыки, если их еще нет
        const allSkillsInitialized = ALL_SKILLS.every((skillName) =>
            skills.some((s) => s.name === skillName)
        );

        let updatedSkills: CharacterSkill[];
        if (!allSkillsInitialized) {
            // Создаем все навыки с базовыми значениями
            updatedSkills = ALL_SKILLS.map((skillName) => {
                const existing = skills.find((s) => s.name === skillName);
                if (existing) {
                    // Если навык был отредактирован вручную, не трогаем его
                    if (customSkillsRef.current.has(skillName)) {
                        return existing;
                    }
                    // Иначе пересчитываем базовое значение
                    const baseModifier = calculateBaseModifier(skillName, existing.proficient);
                    return { ...existing, modifier: baseModifier };
                }
                // Создаем новый навык
                const baseModifier = calculateBaseModifier(skillName, false);
                const ability = SKILL_ABILITY_MAP[skillName];
                return {
                    name: skillName,
                    modifier: baseModifier,
                    proficient: false,
                    ability: ability === "strength" ? "Сила" : ability === "dexterity" ? "Ловкость" : ability === "intelligence" ? "Интеллект" : ability === "wisdom" ? "Мудрость" : "Харизма",
                };
            });
        } else {
            // Обновляем существующие навыки
            updatedSkills = skills.map((skill) => {
                // Если навык был отредактирован вручную, не трогаем его
                if (customSkillsRef.current.has(skill.name)) {
                    return skill;
                }
                // Иначе пересчитываем базовое значение
                const baseModifier = calculateBaseModifier(skill.name, skill.proficient);
                return { ...skill, modifier: baseModifier };
            });
        }

        // Обновляем только если что-то изменилось
        const hasChanges = updatedSkills.length !== skills.length ||
            updatedSkills.some((updated, index) =>
                updated.modifier !== skills[index]?.modifier ||
                updated.proficient !== skills[index]?.proficient
            );
        if (hasChanges) {
            onSkillsChange(updatedSkills);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [strength, dexterity, intelligence, wisdom, charisma, level]);

    // Получаем или создаем навык
    const getSkill = (skillName: string): CharacterSkill => {
        const existing = skills.find((s) => s.name === skillName);
        if (existing) return existing;

        const ability = SKILL_ABILITY_MAP[skillName];
        const abilityValue = {
            strength,
            dexterity,
            intelligence,
            wisdom,
            charisma,
        }[ability];
        const abilityMod = calculateAbilityModifier(abilityValue);
        const baseModifier = abilityMod;

        return {
            name: skillName,
            modifier: baseModifier,
            proficient: false,
            ability: ability === "strength" ? "Сила" : ability === "dexterity" ? "Ловкость" : ability === "intelligence" ? "Интеллект" : ability === "wisdom" ? "Мудрость" : "Харизма",
        };
    };

    // Обновляем навык
    const updateSkill = (skillName: string, updates: Partial<CharacterSkill>) => {
        const currentSkill = getSkill(skillName);
        const updatedSkill = { ...currentSkill, ...updates };
        const otherSkills = skills.filter((s) => s.name !== skillName);
        onSkillsChange([...otherSkills, updatedSkill]);
    };

    // Рассчитываем базовое значение навыка (модификатор характеристики + бонус мастерства если proficient)
    const calculateBaseModifier = (skillName: string, proficient: boolean = false): number => {
        const ability = SKILL_ABILITY_MAP[skillName];
        const abilityValue = {
            strength,
            dexterity,
            intelligence,
            wisdom,
            charisma,
        }[ability];
        const abilityMod = calculateAbilityModifier(abilityValue);
        return abilityMod + (proficient ? proficiencyBonus : 0);
    };

    // Обработка изменения значения навыка
    const handleModifierChange = (skillName: string, value: string) => {
        const numValue = parseInt(value) || 0;
        // Помечаем навык как отредактированный вручную
        customSkillsRef.current.add(skillName);
        updateSkill(skillName, { modifier: numValue });
    };

    // Обработка изменения proficiency
    const handleProficientToggle = (skillName: string) => {
        const skill = getSkill(skillName);
        const newProficient = !skill.proficient;
        // Пересчитываем базовое значение с новым proficiency
        const newBaseModifier = calculateBaseModifier(skillName, newProficient);
        // Сохраняем новое базовое значение
        updateSkill(skillName, { proficient: newProficient, modifier: newBaseModifier });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Модификаторы</Text>

            <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={true}>
                {ALL_SKILLS.map((skillName) => {
                    const ability = SKILL_ABILITY_MAP[skillName];
                    const abilityInfo = ABILITY_NAMES[ability];
                    const skill = getSkill(skillName);
                    // Используем сохраненное значение
                    const displayModifier = skill.modifier;
                    const modifierText = displayModifier >= 0 ? `+${displayModifier}` : `${displayModifier}`;

                    return (
                        <View key={skillName} style={styles.row}>
                            <TouchableOpacity
                                onPress={() => handleProficientToggle(skillName)}
                                style={[
                                    styles.proficiencyDot,
                                    skill.proficient && { backgroundColor: abilityInfo.color },
                                ]}
                            />
                            <TextInput
                                style={[styles.valueInput, { color: abilityInfo.color }]}
                                value={modifierText}
                                onChangeText={(text) => {
                                    // Убираем + и парсим, оставляем знак минуса
                                    const cleanText = text.replace(/\+/g, "");
                                    handleModifierChange(skillName, cleanText);
                                }}
                                keyboardType="numeric"
                                selectTextOnFocus
                            />
                            <Text style={styles.name}>
                                {skillName} (<Text style={{ color: abilityInfo.color }}>{abilityInfo.short}</Text>)
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default CharacterModifiers;

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexGrow: 1,
        flexShrink: 1,
        maxWidth: "100%",
        height: 820,
        overflow: "hidden",
    },

    scrollArea: {
        flex: 1,
    },

    title: {
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 24,
        lineHeight: 24,
        letterSpacing: 0,
        textAlign: "center",
        marginBottom: 12,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.textPrimary,
    },

    proficiencyDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.textPrimary,
        backgroundColor: "transparent",
    },

    valueInput: {
        fontSize: 24,
        fontWeight: "500",
        minWidth: 50,
        textAlign: "center",
    },

    name: {
        fontSize: 24,
        color: COLORS.textSecondary,
        flexShrink: 1,
    },
});