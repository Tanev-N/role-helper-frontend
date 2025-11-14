import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Share2 } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Alert, StyleSheet, View } from "react-native";
import Chat from "../../../../components/Chat";


const SessionScreen = () => {
    const { id } = useLocalSearchParams();
    const { sessionStore, gamesStore, rightButtonsStore } = useStore();
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

    // Добавление кнопки копирования кода сессии
    useEffect(() => {
        // Проверяем currentSession и previousSessions для поиска session_key
        const currentSession = gamesStore.getCurrentSession;
        let sessionKey = currentSession?.session_key;

        // Если session_key нет в currentSession, ищем в previousSessions
        if (!sessionKey) {
            const sessionId = id as string;
            const previousSessions = gamesStore.getPreviousSessions;
            // Сравниваем id как строку или число (в зависимости от типа)
            const session = previousSessions.find(s =>
                String(s.id) === String(sessionId) || s.id === sessionId
            );
            sessionKey = session?.session_key;
        }

        // Если есть session_key, добавляем кнопку
        if (sessionKey) {
            const handleCopySessionKey = async () => {
                try {
                    await Clipboard.setStringAsync(sessionKey!);
                    Alert.alert("Успешно", "Код сессии скопирован в буфер обмена");
                } catch (error) {
                    console.error("Ошибка при копировании:", error);
                    Alert.alert("Ошибка", "Не удалось скопировать код сессии");
                }
            };

            rightButtonsStore.addButton({
                id: "copy-session-key",
                icon: Share2,
                onPress: handleCopySessionKey,
            });
        } else {
            // Если session_key нет, удаляем кнопку
            rightButtonsStore.removeButton("copy-session-key");
        }

        // Очистка кнопки при размонтировании
        return () => {
            rightButtonsStore.removeButton("copy-session-key");
        };
    }, [id, gamesStore.getCurrentSession, gamesStore.getPreviousSessions, rightButtonsStore]);

    return (
        <View
            style={{
                height: "100%",
                width: "100%",
                backgroundColor: COLORS.backgroundSecondary,
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