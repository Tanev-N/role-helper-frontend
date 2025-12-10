import { COLORS } from "@/constant/colors";
import { imagesUrlDefault } from "@/constant/default_images";
import useStore from "@/hooks/store";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ArrowRight, Plus, Users2 } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect } from "react";
import { ImageBackground, Pressable, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { styles } from "./styles";

const CharactersBlock = observer(() => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const blockWidth = Math.min(width * 0.95, 904);
  const router = useRouter();
  const { charactersStore } = useStore();

  useEffect(() => {
    charactersStore.fetchCharacters();
  }, [charactersStore]);

  // Обновляем данные при возврате на страницу
  useFocusEffect(
    useCallback(() => {
      charactersStore.fetchCharacters();
    }, [charactersStore])
  );

  const charsPerRow = isMobile ? 4 : 8;
  const characters = charactersStore.getCharacters || [];

  // Fallback цвета для фона, если изображения нет
  const fallbackColors = [
    COLORS.primary,
    COLORS.intelligence,
    COLORS.wisdom,
    COLORS.charisma,
    COLORS.strength,
    COLORS.dexterity,
    COLORS.vitality,
    COLORS.constitution,
  ];

  const charCardSize =
    (blockWidth - 35 * 2 - (charsPerRow - 1) * 8) / charsPerRow;

  return (
    <View style={[styles.sectionBlock, { width: blockWidth }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Users2 size={28} color={"rgba(227,227,227,1)"} />
          <View style={{ marginLeft: 25 }}>
            <Text style={styles.sectionTitle}>Мои персонажи</Text>
            <Text style={styles.sectionSubtitle}>Персонажей доступно {characters ? characters.length : 0}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => router.push('/cabinet/characters')}
        >
          <ArrowRight size={20} color={"rgba(227,227,227,1)"} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={[styles.itemsGrid, { gap: 18, paddingHorizontal: 35 }]}>
        {characters && characters.map((character, i) => {
          const bgColor = fallbackColors[i % fallbackColors.length];
          return (
            <Pressable
              key={character.id}
              style={({ pressed }) => [
                styles.characterSquare,
                {
                  width: charCardSize,
                  height: charCardSize,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={() => {
                router.push(`/(app)/cabinet/character/${character.id}`);
              }}
            >
              <ImageBackground
                source={character.photo ? { uri: character.photo } : { uri: imagesUrlDefault.charactersUrl }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 8,
                  backgroundColor: bgColor,
                }}
                resizeMode="cover"
              />
            </Pressable>
          );
        })}

        <TouchableOpacity
          style={[styles.addSquare, { width: charCardSize, height: charCardSize }]}
          onPress={() => { router.navigate("/(app)/cabinet/character") }}
        >
          <Plus size={36} color={"rgba(227,227,227,1)"} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default CharactersBlock;
