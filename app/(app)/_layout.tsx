import { COLORS } from "@/constant/colors";
import { ICONS } from "@/constant/icons";
import useStore from "@/hooks/store";
import { Redirect, Stack, usePathname, useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import DEBUG_MODE from "../../config/debug";

function AppLayoutContent() {
    const { authStore } = useStore();
    const isAuth = !!authStore?.isAuth;
    const pathname = usePathname();
    const router = useRouter();

    console.log("DEBUG_MODE =", DEBUG_MODE);
    console.log("isAuth =", isAuth);

    // Пропуск редиректа, если DEBUG_MODE включен
    if (!DEBUG_MODE) {
        if (!isAuth) {
            return <Redirect href="/login" />;
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.routeBox}>
                {!("/main" === pathname) && <ElementMenu icon={ICONS.home} path="/(app)/main" />}
                {!("/cabinet" === pathname) && <ElementMenu icon={ICONS.profile} path="/(app)/cabinet" />}

            </View>

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
        fontWeight: "400",
        fontStyle: "normal",

    },
    routeBox: {
        position: "absolute",
        top: 50,
        right: 50,
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    elementMenu: {
        width: 70,
        height: 70,
        borderRadius: 16,
        backgroundColor: COLORS.backgroundSecondary,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        transitionDuration: "200ms",
    },
    icon: {
        width: 32,
        height: 32,
    }
});

export default observer(AppLayoutContent);



const ElementMenu = ({ icon, path }: { icon: any, path: any }) => {
    const [hovered, setHovered] = useState(false);
    const router = useRouter();
    return (
        <Pressable
            onHoverIn={() => setHovered(true)}
            onHoverOut={() => setHovered(false)}
            onPress={() => { router.push(path) }}
            style={[
                styles.elementMenu,
                hovered ? { borderWidth: 1, borderColor: COLORS.primary } : {},
            ]}
        >
            <Image source={icon} />
        </Pressable>
    );

}
