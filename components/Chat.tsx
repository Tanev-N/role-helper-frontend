import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Platform } from "react-native";
import { observer } from "mobx-react-lite";
import useStore from "@/hooks/store";
import { COLORS } from "@/constant/colors";

type Message = {
    id: string;
    text: string;
    fromUser: boolean;
    timestamp?: string;
};

const Chat = () => {
    const { sessionStore } = useStore();
    const [text, setText] = useState("");
    const [localMessages, setLocalMessages] = useState<Message[]>([]);
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<any>(null);
    const chunksRef = useRef<any[]>([]);

    useEffect(() => {
        if (!sessionStore) return;
        // Map store history -> local messages
        const msgs = sessionStore.getHistory.map((h: any, idx: number) => ({
            id: `s-${idx}`,
            text: `Q: ${h.query}\nA: ${h.answer}`,
            fromUser: false,
            timestamp: h.timestamp,
        }));
        setLocalMessages(msgs);
    }, [sessionStore, sessionStore?.history.length]);

    const sendText = async () => {
        if (!sessionStore || !text.trim()) return;
        const localId = `u-${Date.now()}`;
        setLocalMessages((s) => [...s, { id: localId, text, fromUser: true }]);
        const payload = text;
        setText("");
        await sessionStore.sendMessage("TEXT", payload);
        // after store updates, it will re-map on next effect or we can append response
    };

    // Web MediaRecorder recorder
    const startRecordingWeb = async () => {
        if (!(navigator && (navigator as any).mediaDevices)) return alert("Recording not supported");
        try {
            const stream = await (navigator as any).mediaDevices.getUserMedia({ audio: true });
            const options = { mimeType: "audio/webm" };
            const mediaRecorder = new (window as any).MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            mediaRecorder.ondataavailable = (e: any) => chunksRef.current.push(e.data);
            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                await handleRecordedBlob(blob);
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
        const fd = new FormData();
        // try to name file
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: blob.type });
        fd.append("file", file);
        // send to transcribe first (optional)
        const transcription = await sessionStore.transcribeAudio(fd);
        if (transcription) {
            // send transcription as TEXT ask to llm
            await sessionStore.sendMessage("TEXT", transcription);
        } else {
            // send voice ask directly
            await sessionStore.sendMessage("VOICE", fd);
        }
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
        <View style={[styles.message, item.fromUser ? styles.user : styles.bot]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={localMessages}
                keyExtractor={(i) => i.id}
                renderItem={renderItem}
                style={styles.history}
            />

            <View style={styles.composer}>
                <TextInput
                    placeholder="Type a message"
                    placeholderTextColor={COLORS.textLowEmphasis}
                    value={text}
                    onChangeText={setText}
                    style={styles.input}
                />

                <TouchableOpacity onPress={sendText} style={styles.sendButton}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={toggleRecord} style={styles.micButton}>
                    <Text style={styles.sendText}>{recording ? "Stop" : "Rec"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default observer(Chat);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundSecondary,
        padding: 12,
        borderRadius: 16,
    },
    history: {
        flex: 1,
        marginBottom: 8,
    },
    message: {
        padding: 10,
        borderRadius: 8,
        marginVertical: 6,
        maxWidth: "85%",
    },
    user: {
        alignSelf: "flex-end",
        backgroundColor: COLORS.primary,
    },
    bot: {
        alignSelf: "flex-start",
        backgroundColor: COLORS.backgroundSecondary,
    },
    messageText: {
        color: COLORS.textPrimary,
    },
    composer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.backgroundSecondary,
        color: COLORS.textPrimary,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    sendButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        marginLeft: 8,

    },
    sendText: {
        color: COLORS.textPrimary,
    },
    micButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: COLORS.backgroundPrimary,
        borderRadius: 8,
        marginLeft: 8,
    },
});
