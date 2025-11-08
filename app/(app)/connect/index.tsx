import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    useWindowDimensions,
} from "react-native";
import { observer } from "mobx-react-lite";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { COLORS } from "@/constant/colors";
import { connectStyles as styles } from "@/components/Session/ConnectSession";

const ConnectScreen = () => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width < 1300;
    const isSmallScreen = width < 425;
    const containerWidth = isMobile ? "90%" : 723;

    const [sessionCode, setSessionCode] = useState("");
    const [characterName, setCharacterName] = useState("");
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const colors = [
        COLORS.intelligence,
        COLORS.dexterity,
        COLORS.primary,
        COLORS.wisdom,
        COLORS.charisma,
    ];

    const isButtonDisabled =
        !sessionCode.trim() || !characterName.trim() || !selectedColor;

    const handleConnect = () => {
        if (isButtonDisabled) return;
        router.push("/session/1");
    };

    return (
        <View style={[styles.container, isSmallScreen && { paddingTop: 120 }]}>
            {/* === ЛОГОТИП === */}
            <Text style={styles.logo}>Critica lRoll</Text>

            {/* === БЛОК 1: Код сессии === */}
            <View style={[styles.block, { width: containerWidth }]}>
                <TextInput
                    style={styles.inputCentered}
                    placeholder="Вставьте код для встречи"
                    placeholderTextColor={COLORS.textSecondary}
                    value={sessionCode}
                    onChangeText={setSessionCode}
                    textAlign="left"
                />
            </View>

            {/* === БЛОК 2: Имя персонажа + цвет === */}
            <View style={[styles.block, { width: containerWidth }]}>
                <TextInput
                    style={styles.input}
                    placeholder="Введите имя персонажа"
                    placeholderTextColor={COLORS.textSecondary}
                    value={characterName}
                    onChangeText={setCharacterName}
                />

                <View style={styles.colorRow}>
                    {colors.map((color) => (
                    <TouchableOpacity
                        key={color}
                        onPress={() => setSelectedColor(color)}
                        style={[
                        styles.colorRect,
                        { backgroundColor: color },
                        selectedColor === color && styles.colorSelected,
                        ]}
                    />
                    ))}
                    <TouchableOpacity style={styles.addRect}>
                    <Plus size={36} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

        {/* === КНОПКА ПОДКЛЮЧЕНИЯ === */}
        <TouchableOpacity
            onPress={handleConnect}
            style={[
                styles.buttonConnect,
                isButtonDisabled && { opacity: 0.5 },
            ]}
            disabled={isButtonDisabled}
        >
            <Text style={styles.buttonText}>Подключиться</Text>
        </TouchableOpacity>
    </View>
    );
};

export default observer(ConnectScreen);
