import { Stack, Redirect } from "expo-router";
import { observer } from "mobx-react-lite";
import useStore from "@/hooks/store";
import { View, StyleSheet } from "react-native";
import { COLORS } from "@/constant/colors";

function AppLayoutContent() {
    const { authStore } = useStore();
    const isAuth = !!authStore?.isAuth;

    if (!isAuth) {
        return <Redirect href="/login" />;
    }

    return (
        <View style={styles.container}>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
        fontFamily: "Roboto",
        fontWeight: "400",
        fontStyle: "normal",
    },
});

export default observer(AppLayoutContent);
