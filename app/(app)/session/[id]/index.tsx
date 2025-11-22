import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Chat from "../../../../components/Chat";


const SessionScreen = () => {
    const { id } = useLocalSearchParams();
    const { sessionStore, gamesStore } = useStore();
    useRouter();
    const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
            // Пытаемся получить gameId из currentSession
            let gameId: number | undefined = gamesStore.getCurrentSession?.game_id;

            // Если currentSession не установлен, пытаемся найти сессию в previousSessions
            if (!gameId) {
                const sessionId = parseInt(id as string, 10);
                const previousSessions = gamesStore.getPreviousSessions;
                const session = previousSessions.find(s => s.id === sessionId);
                gameId = session?.game_id;
            }

            if (gameId) {
                await gamesStore.fetchGamePlayers(gameId);
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

    return (
        <View
            style={{
                height: "100%",
                width: "100%",
                backgroundColor: COLORS.backgroundPrimary,
                borderRadius: 16,
                paddingHorizontal: 72,
                paddingVertical: 66,
            }}
        >
            <Chat />
        </View>

    );
}

export default observer(SessionScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.backgroundPrimary,
    }
});