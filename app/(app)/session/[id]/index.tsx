import { View, StyleSheet } from "react-native";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import useStore from "@/hooks/store";
import Chat from "../../../../components/Chat";
import { COLORS } from "@/constant/colors";


const SessionScreen = () => {
    const { id } = useLocalSearchParams();
    const { sessionStore } = useStore();
    useRouter();

    useEffect(() => {
        void (async () => {
            if (!sessionStore) {
                console.error("SessionStore не инициализирован");
                return;
            }
            await sessionStore.initSession(id as string);
        })();
    }, [id, sessionStore]);

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