import CharacterMain from "@/components/Character/CharacterMain";
import CharacterSecondary from "@/components/Character/CharacterSecondary";
import { characterStyles as styles } from "@/components/Character/styles";
import { COLORS } from "@/constant/colors";
import { observer } from "mobx-react-lite";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const CharactersScreen = () => {
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: COLORS.backgroundPrimary }}
            contentContainerStyle={{
                alignItems: "center",
                paddingTop: 40,
                paddingBottom: 60,
            }}
        >
            {/* === ОСНОВНАЯ ИНФОРМАЦИЯ === */}
            <View style={styles.block}>
                <Text style={styles.sectionTitle}>ОСНОВНАЯ ИНФОРМАЦИЯ</Text>
                <CharacterMain />
            </View>

            {/* === ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ === */}
            <View style={styles.block}>
                <Text style={styles.sectionTitle}>ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ</Text>
                <CharacterSecondary />
            </View>
        </ScrollView>
    );
}

export default observer(CharactersScreen);