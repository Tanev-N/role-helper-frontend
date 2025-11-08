import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    useWindowDimensions,
    ScrollView,
    LayoutChangeEvent,
    Platform,
} from "react-native";
import { COLORS } from "@/constant/colors";

type User = {
    id: number;
    name: string;
    color: string;
};

const users: User[] = [
    { id: 1, name: "Фирен", color: "#4caf50" },
    { id: 2, name: "Элис", color: "#651717" },
    { id: 3, name: "Гигачад", color: "#9c7a00" },
    { id: 4, name: "Момо", color: "#e91e63" },
    { id: 5, name: "Николя", color: "#0049d9" },
    { id: 6, name: "Артур", color: "#6cb72b" },
    { id: 7, name: "Динамо", color: "#9c7a00" },
    { id: 8, name: "Люля", color: "#651717" },
];

const ChatUsers = () => {
    const { width } = useWindowDimensions();
    const [containerWidth, setContainerWidth] = useState(0);
    const isMobile = width < 1300;

    useEffect(() => {
        if (Platform.OS === "web" && typeof document !== "undefined") {
            const style = document.createElement("style");
            style.innerHTML = `
                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
            `;
            document.head.appendChild(style);
            return () => {
                if (style.parentNode) style.parentNode.removeChild(style);
            };
        }
    }, []);

        if (isMobile) {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                style={styles.scrollMobile}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 22,
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                }}
            >
                {users.map((u) => (
                    <View
                        key={u.id}
                        style={[styles.userBoxMobile, { backgroundColor: u.color }]}
                    >
                        <Text style={styles.userNameMobile}>{u.name}</Text>
                    </View>
                ))}
            </ScrollView>
        );
    }

    const columns: User[][] = [[], []];
    users.forEach((u, i) => columns[i % 2].unshift(u));

    const totalGap = 22;
    const boxSize =
        containerWidth > 0
            ? Math.max(containerWidth / 2 - totalGap / 2, 100)
            : 120;

    const onLayout = (e: LayoutChangeEvent) => {
        setContainerWidth(e.nativeEvent.layout.width);
    };

    return (
        <ScrollView
            style={styles.scrollDesktop}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
            showsVerticalScrollIndicator={true}
        >
            <View style={[styles.desktopContainer, { gap: totalGap }]} onLayout={onLayout}>
                {columns.map((col, colIndex) => (
                    <View key={colIndex} style={[styles.column, { gap: totalGap }]}>
                        {col.map((u) => (
                            <View
                                key={u.id}
                                style={[
                                    styles.userBox,
                                    { backgroundColor: u.color, width: boxSize, height: boxSize },
                                ]}
                            >
                                <Text style={styles.userName}>{u.name}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default ChatUsers;

const styles = StyleSheet.create({
    /** Десктоп */
    scrollDesktop: {
        flex: 1,
        width: "100%",
    },
    desktopContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        width: "100%",
        paddingVertical: 16,
    },
    column: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    userBox: {
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    userName: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 24,
        lineHeight: 24,
        color: COLORS.textPrimary,
        textAlign: "center",
    },

    /** мобилка */
    scrollMobile: {
        flexGrow: 0,
        width: "100%",
        maxHeight: 160,
    },
    userBoxMobile: {
        width: 100,
        height: 100,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0, 
    },
    userNameMobile: {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: 20,
        lineHeight: 20,
        color: COLORS.textPrimary,
        textAlign: "center",
    },
});
