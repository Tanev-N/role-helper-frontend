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

    const sendText = async () => {
        if (!sessionStore || !text.trim()) return;
        const localId = `u-${Date.now()}`;
        setLocalMessages((s) => [...s, { id: localId, text, fromUser: true }]);
        const payload = text;
        setText("");
        await sessionStore.sendMessage("TEXT", payload);
        // after store updates, it will re-map on next effect or we can append response
    };

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
