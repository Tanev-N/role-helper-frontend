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
import { CornerUpLeft } from "lucide-react-native";

function AppLayoutContent() {
  const { authStore } = useStore();
  const isAuth = !!authStore?.isAuth;
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  const isMobile = width < 1300;

  if (!DEBUG_MODE) {
    if (!isAuth) {
      return <Redirect href="/login" />;
    }
  }


  const backExactRoutes = [
    "/connect",            // подключение к сессии
    "/session",            // создание сессии
    "/cabinet",            // профиль
    "/cabinet/characters", // список персонажей
    "/cabinet/worlds",     // список миров
    "/cabinet/worldgame",  // окно мира
    "/cabinet/session",    // окно конкретной сессии
    "/cabinet/game",    // окно создания игры
    "/cabinet/armor",   //окно списка брони
  ];

  const backPrefixRoutes = [
    "/cabinet/character",  // /cabinet/character и /cabinet/character/[id]
  ];

  const showBackButton =
    backExactRoutes.includes(pathname) ||
    backPrefixRoutes.some((prefix) => pathname.startsWith(prefix));

  return (
    <View style={styles.container}>
      {/* Кнопка "назад" */}
      {showBackButton && (
        <View style={isMobile ? styles.backBoxMobile : styles.backBoxDesktop}>
          <BackButton small={isMobile} />
        </View>
      )}

      {/* Панель с кнопками домой/кабинет */}
      <View
        style={[
          styles.routeBox,
          isMobile ? styles.routeBoxMobile : styles.routeBoxDesktop,
        ]}
      >
        {isMobile ? (
          <>
            {pathname !== "/cabinet" && (
              <ElementMenu icon={ICONS.profile} path="/cabinet" small />
            )}
            {pathname !== "/main" && (
              <ElementMenu icon={ICONS.home} path="/main" small />
            )}
          </>
        ) : (
          <>
            {pathname !== "/main" && (
              <ElementMenu icon={ICONS.home} path="/main" />
            )}
            {pathname !== "/cabinet" && (
              <ElementMenu icon={ICONS.profile} path="/cabinet" />
            )}
          </>
        )}
      </View>

      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },

  routeBox: {
    position: "absolute",
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  routeBoxDesktop: {
    top: 50,
    right: 50,
    flexDirection: "column",
    gap: 12,
  },

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

  backBoxDesktop: {
    position: "absolute",
    top: 50,
    left: 50,
    zIndex: 100,
  },

  backBoxMobile: {
    position: "absolute",
    top: 8,
    left: 16,
    zIndex: 101,
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
    transitionDuration: "200ms",
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
  path: string;
  small?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => router.push(path as any)}
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

const BackButton = ({ small = false }: { small?: boolean }) => {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => router.back()}
      style={[
        styles.elementMenu,
        small && styles.elementMenuSmall,
        hovered && { borderWidth: 1, borderColor: COLORS.primary },
      ]}
    >
      <CornerUpLeft size={small ? 22 : 28} color="#E3E3E3" />
    </Pressable>
  );
};

export default observer(AppLayoutContent);
