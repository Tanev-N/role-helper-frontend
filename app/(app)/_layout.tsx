import { Stack, Redirect, useRouter, usePathname } from "expo-router";
import { observer } from "mobx-react-lite";
import useStore from "@/hooks/store";
import {
    View,
    StyleSheet,
    Pressable,
    Image,
    useWindowDimensions,
} from "react-native";
import { COLORS } from "@/constant/colors";
import { ICONS } from "@/constant/icons";
import { useState } from "react";
import DEBUG_MODE from "../../config/debug";

function AppLayoutContent() {
    const { authStore } = useStore();
    const isAuth = !!authStore?.isAuth;
    const pathname = usePathname();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width < 1300;

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
            {/* Панель с кнопками */}
            <View
                style={[
                    styles.routeBox,
                    isMobile ? styles.routeBoxMobile : styles.routeBoxDesktop,
                ]}
            >
                {isMobile ? (
                    <>
                        {!("/cabinet" === pathname) && (
                            <ElementMenu icon={ICONS.profile} path="/(app)/cabinet" small />
                        )}
                        {!("/main" === pathname) && (
                            <ElementMenu icon={ICONS.home} path="/(app)/main" small />
                        )}
                    </>
                ) : (
                    <>
                        {!("/main" === pathname) && (
                            <ElementMenu icon={ICONS.home} path="/(app)/main" />
                        )}
                        {!("/cabinet" === pathname) && (
                            <ElementMenu icon={ICONS.profile} path="/(app)/cabinet" />
                        )}
                    </>
                )}
            </View>

            {/* Контент страниц */}
            <Stack screenOptions={{ headerShown: false }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundPrimary,
    },

    /** === Общая основа панели === */
    routeBox: {
        position: "absolute",
        zIndex: 100,
        justifyContent: "center",
        alignItems: "center",
    },

    /** Desktop - vertical */
    routeBoxDesktop: {
        top: 50,
        right: 50,
        flexDirection: "column",
        gap: 12,
    },

    /** Mobile - horizontal */
    routeBoxMobile: {
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row-reverse",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#18191A",
        paddingVertical: 8,
        gap: 8,
    },

    elementMenu: {
        width: 70,
        height: 70,
        borderRadius: 16,
        backgroundColor: COLORS.backgroundSecondary,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },

    elementMenuSmall: {
        width: 55,
        height: 55,
        borderRadius: 12,
    },

    icon: {
        width: 32,
        height: 32,
    },
    iconSmall: {
        width: 26,
        height: 26,
    },
});

const ElementMenu = ({
    icon,
    path,
    small = false,
}: {
    icon: any;
    path: any;
    small?: boolean;
}) => {
    const [hovered, setHovered] = useState(false);
    const router = useRouter();

    return (
        <Pressable
            onHoverIn={() => setHovered(true)}
            onHoverOut={() => setHovered(false)}
            onPress={() => router.push(path)}
            style={[
                styles.elementMenu,
                small && styles.elementMenuSmall,
                hovered && { borderWidth: 1, borderColor: COLORS.primary },
            ]}
        >
            <Image source={icon} style={small ? styles.iconSmall : styles.icon} />
        </Pressable>
    );
};

export default observer(AppLayoutContent);