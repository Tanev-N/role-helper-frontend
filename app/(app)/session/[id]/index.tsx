import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
            let gameId: string | number | undefined = gamesStore.getCurrentSession?.game_id;

            // Если currentSession не установлен, пытаемся найти сессию в previousSessions
            if (!gameId) {
                const sessionId = id as string;
                const previousSessions = gamesStore.getPreviousSessions;
                const session = previousSessions.find(s => String(s.id) === String(sessionId));
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
        const loadSessionKey = async () => {
            console.log("[SessionScreen] useEffect для кнопки запущен, id:", id);

            // Проверяем currentSession и previousSessions для поиска session_key
            const currentSession = gamesStore.getCurrentSession;
            console.log("[SessionScreen] currentSession:", currentSession);
            let sessionKey = currentSession?.session_key;
            console.log("[SessionScreen] sessionKey из currentSession:", sessionKey);

            // Если session_key нет в currentSession, ищем в previousSessions
            if (!sessionKey) {
                const sessionId = id as string;
                const previousSessions = gamesStore.getPreviousSessions ?? [];
                console.log("[SessionScreen] previousSessions:", previousSessions);
                console.log("[SessionScreen] previousSessions length:", previousSessions.length);
                console.log("[SessionScreen] Ищем сессию с id:", sessionId);

                // Выводим все id из previousSessions для отладки
                previousSessions.forEach((s, idx) => {
                    console.log(`[SessionScreen] previousSessions[${idx}].id:`, s.id, "type:", typeof s.id);
                });

                // Ищем сессию по id - сравниваем как строки
                const session = previousSessions.find(s => {
                    const sId = String(s.id);
                    const targetId = String(sessionId);
                    const match = sId === targetId;
                    console.log(`[SessionScreen] Сравнение: "${sId}" === "${targetId}" = ${match}`);
                    if (match) {
                        console.log("[SessionScreen] Найдена сессия:", s);
                    }
                    return match;
                });
                sessionKey = session?.session_key;
                console.log("[SessionScreen] sessionKey из previousSessions:", sessionKey);
            }

            // Если session_key все еще не найден, пробуем загрузить из localStorage
            if (!sessionKey) {
                try {
                    const storedKey = await AsyncStorage.getItem(`session_key_${id}`);
                    if (storedKey) {
                        sessionKey = storedKey;
                        console.log("[SessionScreen] sessionKey загружен из localStorage:", sessionKey);
                    }
                } catch (error) {
                    console.error("[SessionScreen] Ошибка при загрузке из localStorage:", error);
                }
            }

            // Если есть session_key, добавляем кнопку
            if (sessionKey) {
                console.log("[SessionScreen] sessionKey найден, добавляем кнопку:", sessionKey);
                // Сохраняем в localStorage для следующей загрузки
                try {
                    await AsyncStorage.setItem(`session_key_${id}`, sessionKey);
                } catch (error) {
                    console.error("[SessionScreen] Ошибка при сохранении в localStorage:", error);
                }

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
                console.log("[SessionScreen] Кнопка добавлена в стор. Всего кнопок:", rightButtonsStore.getButtons.length);
            } else {
                console.log("[SessionScreen] sessionKey не найден, удаляем кнопку");
                // Если session_key нет, удаляем кнопку
                rightButtonsStore.removeButton("copy-session-key");
            }
        };

        loadSessionKey();

        // Очистка кнопки при размонтировании
        return () => {
            console.log("[SessionScreen] Очистка кнопки при размонтировании");
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