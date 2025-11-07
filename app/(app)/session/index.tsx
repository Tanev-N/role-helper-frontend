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
import { styles } from "@/components/Session/CreateSession";

const CreateSessionScreen = () => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const isSmallScreen = width < 425; 
    const containerWidth = isMobile ? "90%" : 723;

    const [worldName, setWorldName] = useState("");
    const [sessionCode, setSessionCode] = useState("");
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const colors = [COLORS.primary, COLORS.intelligence];

    const isButtonDisabled =
        !worldName.trim() || !sessionCode.trim() || !selectedColor;

    const handleCreateSession = () => {
        if (isButtonDisabled) return;
        router.push("/session/1");
    };

    return (
        <View style={[styles.container, isSmallScreen && { paddingTop: 120 }]}>
            {/* === ЛОГОТИП === */}
            <Text style={styles.logo}>CriticalRoll</Text>

            {/* === БЛОК 1: Создание мира === */}
            <View style={[styles.block, { width: containerWidth }]}>
                <TextInput
                    style={styles.input}
                    placeholder="Введите имя мира"
                    placeholderTextColor={COLORS.textSecondary}
                    value={worldName}
                    onChangeText={setWorldName}
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

            {/* === БЛОК 2: Код сессии === */}
            <View
                style={[
                    styles.block,
                    { width: containerWidth, justifyContent: "center" },
                ]}
            >
                <TextInput
                    style={styles.inputCentered}
                    placeholder="Код сессии"
                    placeholderTextColor={COLORS.textSecondary}
                    value={sessionCode}
                    onChangeText={setSessionCode}
                    textAlign="center"
                />
            </View>

            {/* === КНОПКА СОЗДАНИЯ === */}
            <TouchableOpacity
                onPress={handleCreateSession}
                style={[
                    styles.buttonCreateSession,
                    isButtonDisabled && { opacity: 0.5 },
                ]}
                disabled={isButtonDisabled}
            >
                <Text style={styles.buttonText}>Создать</Text>
            </TouchableOpacity>
        </View>
    );
};

export default observer(CreateSessionScreen);