import CharactersScreen from "@/app/(app)/cabinet/character";
import { COLORS } from "@/constant/colors";
import useStore from "@/hooks/store";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import ChatUsers from "./ChatUsers";

type Message = {
    id: string;
    text: string;
    fromUser: boolean;
    timestamp?: string;
};

const Chat = () => {
    const { width } = useWindowDimensions();
    const isMobile = width < 1300;
    const router = useRouter();
    const { sessionStore, gamesStore, charactersStore } = useStore();
    const role = gamesStore.getSessionRole ?? "master";
    const playerCharacterId = gamesStore.getPlayerCharacterId;
    const [text, setText] = useState("");
    const [localMessages, setLocalMessages] = useState<Message[]>([]);
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<any>(null);
    const chunksRef = useRef<any[]>([]);

    useEffect(() => {
        if (!sessionStore) return;
        // Map store history -> separate user (query) and bot (answer) messages
        const msgs: Message[] = [];
        sessionStore.getHistory.forEach((h: any, idx: number) => {
            if (h.query) {
                msgs.push({ id: `s-q-${idx}`, text: h.query, fromUser: true, timestamp: h.timestamp });
            }
            if (h.answer) {
                msgs.push({ id: `s-a-${idx}`, text: h.answer, fromUser: false, timestamp: h.timestamp });
            }
        });
        setLocalMessages(msgs);
    }, [sessionStore, sessionStore?.history.length]);

    // Подтягиваем карточку выбранного персонажа для роли игрока
    useEffect(() => {
        if (role !== "player" || !playerCharacterId) return;
        const existing = charactersStore.getCharacterById(playerCharacterId);
        if (!existing) {
            charactersStore.fetchCharacterById(playerCharacterId, true);
        }
    }, [role, playerCharacterId, charactersStore]);

    const playerCharacter = playerCharacterId
        ? charactersStore.getCharacterById(playerCharacterId)
        : null;

    // --- отправка текста ---
    const sendText = async () => {
        if (!sessionStore || !text.trim()) return;
        const localId = `u-${Date.now()}`;
        setLocalMessages((s) => [...s, { id: localId, text, fromUser: true }]);
        const payload = text;
        setText("");
        await sessionStore.sendMessage("TEXT", payload);
        // after store updates, it will re-map on next effect or we can append response
    };

    // --- запись аудио ---

    // Web MediaRecorder recorder — try to record as MP3, otherwise record and convert
    const startRecordingWeb = async () => {
        if (!(navigator && (navigator as any).mediaDevices)) return alert("Recording not supported");
        try {
            const stream = await (navigator as any).mediaDevices.getUserMedia({ audio: true });
            // Prefer audio/mpeg if supported
            let mimeType = "";
            try {
                if ((window as any).MediaRecorder && (window as any).MediaRecorder.isTypeSupported("audio/mpeg")) {
                    mimeType = "audio/mpeg";
                } else if ((window as any).MediaRecorder && (window as any).MediaRecorder.isTypeSupported("audio/webm")) {
                    mimeType = "audio/webm";
                }
            } catch {
                mimeType = "audio/webm";
            }

            const options: any = mimeType ? { mimeType } : undefined;
            const mediaRecorder = new (window as any).MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            mediaRecorder.ondataavailable = (e: any) => chunksRef.current.push(e.data);
            mediaRecorder.onstop = async () => {
                const rawBlob = new Blob(chunksRef.current, { type: mimeType || "application/octet-stream" });
                // If we already have mp3, send directly. Otherwise try to convert.
                if (rawBlob.type.includes("mpeg") || rawBlob.type.includes("mp3")) {
                    await handleRecordedBlob(rawBlob);
                } else {
                    // attempt conversion to mp3
                    try {
                        const mp3 = await convertBlobToMp3(rawBlob);
                        await handleRecordedBlob(mp3);
                    } catch (e) {
                        console.warn("MP3 conversion failed, sending raw blob", e);
                        await handleRecordedBlob(rawBlob);
                    }
                }
            };
            mediaRecorder.start();
            setRecording(true);
        } catch (e) {
            console.warn("startRecordingWeb", e);
        }
    };

    const stopRecordingWeb = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const handleRecordedBlob = async (blob: Blob) => {
        if (!sessionStore) return;
        // try to name file (use .mp3 extension when possible)
        const ext = blob.type && blob.type.includes("mpeg") ? "mp3" : "webm";
        const file = new File([blob], `recording-${Date.now()}.${ext}`, { type: blob.type });

        const transcription = await sessionStore.transcribeAudio(file);
        if (transcription) {
            // send transcription as TEXT ask to llm
            await sessionStore.sendMessage("TEXT", transcription);
        } else {
            // send voice ask directly
            await sessionStore.sendMessage("VOICE", file);
        }
    };

    // load lamejs from CDN if not available
    const loadLameJs = async () => {
        if ((window as any).lamejs) return (window as any).lamejs;
        return new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/npm/lamejs@1.2.0/lame.min.js";
            s.onload = () => resolve((window as any).lamejs);
            s.onerror = (e) => reject(e);
            document.head.appendChild(s);
        });
    };

    const convertBlobToMp3 = async (blob: Blob): Promise<Blob> => {
        const arrayBuffer = await blob.arrayBuffer();
        const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) throw new Error("AudioContext not supported");
        const audioCtx = new AudioCtx();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        const lamejs = await loadLameJs();

        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;

        // Convert Float32 arrays to Int16
        const channelData = [] as Int16Array[];
        for (let c = 0; c < numChannels; c++) {
            const float32 = audioBuffer.getChannelData(c);
            const int16 = new Int16Array(float32.length);
            for (let i = 0; i < float32.length; i++) {
                let s = Math.max(-1, Math.min(1, float32[i]));
                int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }
            channelData.push(int16);
        }

        // If mono, duplicate channel to have two channels for encoder
        const left = channelData[0];
        const right = numChannels > 1 ? channelData[1] : channelData[0];

        const mp3encoder = new (lamejs as any).Mp3Encoder(2, sampleRate, 128);
        const samplesPerFrame = 1152;
        const mp3Data: any[] = [];

        const len = Math.max(left.length, right.length);
        for (let i = 0; i < len; i += samplesPerFrame) {
            const leftChunk = left.subarray(i, i + samplesPerFrame);
            const rightChunk = right.subarray(i, i + samplesPerFrame);
            const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
            if (mp3buf.length > 0) mp3Data.push(mp3buf);
        }

        const mp3buf = mp3encoder.flush();
        if (mp3buf.length > 0) mp3Data.push(mp3buf);

        const blobParts = mp3Data.map((b: any) => new Uint8Array(b).buffer);
        const mp3Blob = new Blob(blobParts, { type: "audio/mpeg" });
        return mp3Blob;
    };

    const toggleRecord = async () => {
        if (recording) {
            if (Platform.OS === "web") stopRecordingWeb();
            // For native/expo you can integrate expo-av or expo-media-library. Fallback: stop.
        } else {
            if (Platform.OS === "web") await startRecordingWeb();
        }
    };

    const renderItem = ({ item }: { item: Message }) => (
        <View style={[styles.message, item.fromUser ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    // Обработчик завершения сессии для мастера
    const handleFinishSession = async () => {
        const currentSession = gamesStore.getCurrentSession;
        if (!currentSession) return;

        try {
            await gamesStore.finishSession(currentSession.id, "Тут будет описание");
            router.replace("/(app)/main");
        } catch (e) {
            console.warn("Ошибка при завершении сессии", e);
        }
    };

    // Обработчик выхода из сессии для игрока
    const handleExitSession = async () => {
        const currentSession = gamesStore.getCurrentSession;
        if (!currentSession) {
            // Если сессии нет, просто очищаем состояние и переходим
            gamesStore.exitSession();
            sessionStore.clearSession();
            router.replace("/(app)/main");
            return;
        }

        try {
            await gamesStore.leaveSession(currentSession.id);
            sessionStore.clearSession();
            router.replace("/(app)/main");
        } catch (e) {
            console.warn("Ошибка при выходе из сессии", e);
            // В случае ошибки все равно очищаем локальное состояние и переходим
            gamesStore.exitSession();
            sessionStore.clearSession();
            router.replace("/(app)/main");
        }
    };

    return (
        <View style={styles.fullscreen}>
            <View style={[styles.page, isMobile && styles.pageMobile]}>
                {/* Левая колонка */}
                <View
                    style={[
                        styles.leftColumn,
                        isMobile && styles.leftColumnMobile,
                    ]}
                >
                    <ChatUsers />
                </View>

                {/* Правая колонка — чат для мастера или карточка персонажа для игрока */}
                {role === "player" ? (
                    <View
                        style={[
                            styles.chatContainer,
                            isMobile && styles.chatContainerMobile,
                        ]}
                    >
                        {/* Кнопка выхода из сессии для игрока */}
                        <View style={styles.exitButtonContainer}>
                            <TouchableOpacity
                                onPress={handleExitSession}
                                style={styles.exitButton}
                            >
                                <X size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        {playerCharacterId ? (
                            playerCharacter ? (
                                <CharactersScreen
                                    characterId={playerCharacter.id}
                                    mode="edit"
                                    onUpdated={() => {
                                        // Refresh data after save if needed
                                        charactersStore.fetchCharacterById(playerCharacter.id, true);
                                    }}
                                />
                            ) : (
                                <View style={styles.loadingBox}>
                                    <ActivityIndicator size="large" color={COLORS.primary} />
                                    <Text style={styles.loadingText}>Загружаем персонажа…</Text>
                                </View>
                            )
                        ) : (
                            <View style={styles.loadingBox}>
                                <Text style={styles.loadingText}>Персонаж не выбран</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View
                        style={[
                            styles.chatContainer,
                            isMobile && styles.chatContainerMobile,
                        ]}
                    >
                        <FlatList
                            data={localMessages}
                            keyExtractor={(i) => i.id}
                            renderItem={renderItem}
                            style={styles.history}
                        />

                        <View style={styles.composer}>
                            <TextInput
                                placeholder="Введите текст"
                                placeholderTextColor={COLORS.textLowEmphasis}
                                value={text}
                                onChangeText={setText}
                                style={[styles.input, { fontSize: 24, fontFamily: "Roboto" }]}
                            />

                            <TouchableOpacity onPress={sendText} style={styles.sendButton}>
                                <Text style={styles.sendText}>Send</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={toggleRecord} style={styles.micButton}>
                                <Text style={styles.sendText}>{recording ? "Stop" : "Rec"}</Text>
                            </TouchableOpacity>

                            {/* Кнопка завершения сессии для мастера */}
                            <TouchableOpacity
                                onPress={handleFinishSession}
                                style={styles.finishButton}
                            >
                                <X size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

export default observer(Chat);

const styles = StyleSheet.create({
    fullscreen: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.backgroundPrimary,
    },
    page: {
        flex: 1,
        flexDirection: "row",
        width: "100%",
        height: "100%",
    },
    pageMobile: {
        flexDirection: "column",
        padding: 12,
    },
    leftColumn: {
        flex: 3,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingHorizontal: 72,
        paddingVertical: 66,
    },
    leftColumnMobile: {
        width: "100%",
        paddingHorizontal: 24,
        paddingVertical: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    chatContainer: {
        flex: 7,
        backgroundColor: "#18191A",
        borderRadius: 0,
        paddingHorizontal: 72,
        paddingVertical: 66,
    },
    chatContainerMobile: {
        width: "100%",
        paddingHorizontal: 24,
        paddingVertical: 24,
        borderRadius: 16,
    },
    history: {
        flex: 1,
        marginBottom: 8,
    },
    message: {
        padding: 16,
        borderRadius: 16,
        marginVertical: 8,
        maxWidth: "85%",
        backgroundColor: "#2C2C31",
    },
    userMessage: { alignSelf: "flex-end" },
    botMessage: { alignSelf: "flex-start" },
    messageText: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 24,
        lineHeight: 24,
        color: COLORS.textPrimary,
    },
    loadingBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    loadingText: {
        color: COLORS.textSecondary,
        fontFamily: "Roboto",
        fontSize: 18,
    },
    composer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 12,
    },
    input: {
        flex: 1,
        backgroundColor: "#2C2C31",
        color: COLORS.textPrimary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        fontFamily: "Roboto",
    },
    sendButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        marginLeft: 8,
    },
    sendText: { color: COLORS.textPrimary, fontFamily: "Roboto" },
    micButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: COLORS.backgroundPrimary,
        borderRadius: 8,
        marginLeft: 8,
    },
    finishButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        marginLeft: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    exitButtonContainer: {
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 10,
    },
    exitButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
});
