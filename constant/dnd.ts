// Константы для D&D рас и классов с их иконками
// Если иконки нет, она будет null/undefined, и компоненты не будут её отображать

export const DND_RACES = [
    // Стандартные расы из Player's Handbook (без иконок)
    { name: "Человек", nameEn: "Human", icon: null },
    { name: "Эльф", nameEn: "Elf", icon: null },
    { name: "Дварф", nameEn: "Dwarf", icon: null },
    { name: "Полурослик", nameEn: "Halfling", icon: null },
    { name: "Гном", nameEn: "Gnome", icon: null },
    { name: "Полуэльф", nameEn: "Half-Elf", icon: null },
    { name: "Полуорк", nameEn: "Half-Orc", icon: null },
    { name: "Драконорожденный", nameEn: "Dragonborn", icon: null },
    { name: "Тифлинг", nameEn: "Tiefling", icon: require("../assets/icons/dnd/Race Icon - Tiefling.svg") },
    
    // Дополнительные расы (с иконками)
    { name: "Воздушный Генаси", nameEn: "Air Genasi", icon: require("../assets/icons/dnd/Race Icon - Air Genasi.svg") },
    { name: "Дроу", nameEn: "Drow", icon: require("../assets/icons/dnd/Race Icon - Drow.svg") },
    { name: "Земной Генаси", nameEn: "Earth Genasi", icon: require("../assets/icons/dnd/Race Icon - Earth Genasi.svg") },
    { name: "Фирболг", nameEn: "Firbolg", icon: require("../assets/icons/dnd/Race Icon - Firbolg.svg") },
    { name: "Огненный Генаси", nameEn: "Fire Genasi", icon: require("../assets/icons/dnd/Race Icon - Fire Genasi.svg") },
    { name: "Лесной Гном", nameEn: "Forest Gnome", icon: require("../assets/icons/dnd/Race Icon - Forest Gnome.svg") },
    { name: "Высший Эльф", nameEn: "High Elf", icon: require("../assets/icons/dnd/Race Icon - High Elf.svg") },
    { name: "Водный Генаси", nameEn: "Water Genasi", icon: require("../assets/icons/dnd/Race Icon - Water Genasi.svg") },
    { name: "Юань-Ти", nameEn: "Yuan-Ti", icon: require("../assets/icons/dnd/Race Icon - Yuan-Ti.svg") },
];

export const DND_CLASSES = [
    { name: "Изобретатель", nameEn: "Artificer", icon: require("../assets/icons/dnd/Class Icon - Artificer.svg") },
    { name: "Варвар", nameEn: "Barbarian", icon: require("../assets/icons/dnd/Class Icon - Barbarian.svg") },
    { name: "Бард", nameEn: "Bard", icon: require("../assets/icons/dnd/Class Icon - Bard.svg") },
    { name: "Жрец", nameEn: "Cleric", icon: require("../assets/icons/dnd/Class Icon - Cleric.svg") },
    { name: "Друид", nameEn: "Druid", icon: require("../assets/icons/dnd/Class Icon - Druid.svg") },
    { name: "Воин", nameEn: "Fighter", icon: require("../assets/icons/dnd/Class Icon - Fighter.svg") },
    { name: "Монах", nameEn: "Monk", icon: require("../assets/icons/dnd/Class Icon - Monk.svg") },
    { name: "Паладин", nameEn: "Paladin", icon: require("../assets/icons/dnd/Class Icon - Paladin.svg") },
    { name: "Следопыт", nameEn: "Ranger", icon: require("../assets/icons/dnd/Class Icon - Ranger.svg") },
    { name: "Плут", nameEn: "Rogue", icon: require("../assets/icons/dnd/Class Icon - Rogue.svg") },
    { name: "Чародей", nameEn: "Sorcerer", icon: require("../assets/icons/dnd/Class Icon - Sorcerer.svg") },
    { name: "Колдун", nameEn: "Warlock", icon: require("../assets/icons/dnd/Class Icon - Warlock.svg") },
    { name: "Волшебник", nameEn: "Wizard", icon: require("../assets/icons/dnd/Class Icon - Wizard.svg") },
];

