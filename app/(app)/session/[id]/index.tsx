import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef } from "react";
import { View, useWindowDimensions } from "react-native";
import Chat from "../../../../components/Chat";


const SessionScreen = () => {
    const { id } = useLocalSearchParams();
    const { sessionStore, gamesStore } = useStore();
    useRouter();
    const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    useEffect(() => {
        void (async () => {
            if (!sessionStore) {
                console.error("SessionStore не инициализирован");
                return;
            }
            await sessionStore.initSession(id as string);
        })();
    }, [id, sessionStore]);

    // Опрос игроков каждые 5 секунд
    useEffect(() => {
        const pollPlayers = async () => {
            const sessionId = id as string;
            if (sessionId) {
                await gamesStore.fetchSessionPlayers(sessionId);
            }
        };

        // Первый опрос сразу
        pollPlayers();

        // Устанавливаем интервал опроса каждые 5 секунд
        pollIntervalRef.current = setInterval(pollPlayers, 5000);

        // Очистка интервала при размонтировании
        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [id, gamesStore]);

    // Мгновенно обновляем игроков при возврате на экран сессии
    useFocusEffect(
        useCallback(() => {
            const sessionId = id as string;
            if (sessionId) {
                void gamesStore.fetchSessionPlayers(sessionId);
            }
        }, [id, gamesStore])
    );

    const horizontalPadding = isMobile ? 12 : 72;
    const verticalPadding = isMobile ? 12 : 66;

    return (
        <View
            style={{
                flex: 1,
                height: "100%",
                width: "100%",
                backgroundColor: COLORS.backgroundPrimary,
                paddingHorizontal: horizontalPadding,
                paddingVertical: verticalPadding,
            }}
        >
            <Chat />
        </View>
    );
}

export default observer(SessionScreen);

