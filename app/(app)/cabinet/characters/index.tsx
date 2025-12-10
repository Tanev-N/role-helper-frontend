import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect } from "react";
import {
    ImageBackground,
    Pressable,
    ScrollView,
    Text,
    useWindowDimensions,
    View
} from "react-native";

import { imagesUrlDefault } from "@/constant/default_images";
import useStore from "@/hooks/store";
import { styles } from "./styles";

const CharactersListScreen = observer(() => {
    const { charactersStore } = useStore();
    const router = useRouter();
    const { width } = useWindowDimensions();

    const isMobile = width < 768;
    const isSmallMobile = width < 420;

    const columns = isMobile ? 2 : 4;

    const DESKTOP_MAX_WIDTH = 904;
    const MOBILE_CARD_BASE = 190;
    const MOBILE_GAP = 46;

    const gap = isMobile ? MOBILE_GAP : 24;

    const containerWidth = isMobile
        ? Math.min(width * 0.95, 2 * MOBILE_CARD_BASE + MOBILE_GAP)
        : Math.min(width * 0.95, DESKTOP_MAX_WIDTH);

    const cardWidth = (containerWidth - gap * (columns - 1)) / columns;

    const cardHeight = (cardWidth * 368) / 190;
    const avatarHeight = (cardWidth * 287) / 190;
    const nameHeight = cardHeight - avatarHeight;

    useEffect(() => {
        charactersStore.fetchCharacters();
    }, [charactersStore]);

    useFocusEffect(
        useCallback(() => {
            charactersStore.fetchCharacters();
        }, [charactersStore])
    );

    const characters = charactersStore.getCharacters || [];

    const fallbackColors = [
        "#5E8A00",
        "#970088",
        "#003CB3",
        "#8A7100",
        "#5C0F00",
    ];

    const titleSize = isSmallMobile ? 22 : 24;

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={[
                styles.screenContent,
                { paddingTop: isMobile ? 72 : 64 },
            ]}
        >
            <View style={{ width: containerWidth }}>
                <Text style={[styles.title, { fontSize: titleSize }]}>
                    ВАШИ ПЕРСОНАЖИ
                </Text>
                <View style={styles.titleDivider} />
            </View>

            <View
                style={[
                    styles.grid,
                    {
                        width: containerWidth,
                        columnGap: gap,
                        rowGap: gap,
                    },
                ]}
            >
                {characters.map((character: any, index: number) => {
                    const bgColor =
                        character.color || fallbackColors[index % fallbackColors.length];
                    const photo = character.photo;

                    return (
                        <Pressable
                            key={character.id}
                            onPress={() => { }
                                // router.push(`/(app)/cabinet/character/${character.id}`)
                            }
                            style={({ pressed }) => [
                                styles.cardWrapper,
                                {
                                    width: cardWidth,
                                    height: cardHeight,
                                    opacity: pressed ? 0.85 : 1,
                                },
                            ]}
                        >
                            <ImageBackground
                                source={
                                    photo
                                        ? { uri: photo }
                                        : { uri: imagesUrlDefault.charactersUrl }
                                }
                                style={[
                                    styles.avatarContainer,
                                    {
                                        height: avatarHeight,
                                        backgroundColor: bgColor,
                                    },
                                ]}
                                resizeMode="cover"
                            />

                            <View style={[styles.nameContainer, { height: nameHeight }]}>
                                <Text style={styles.nameText} numberOfLines={2}>
                                    {character.name}
                                </Text>
                            </View>
                        </Pressable>
                    );
                })}
            </View>
        </ScrollView>
    );
});

export default CharactersListScreen;