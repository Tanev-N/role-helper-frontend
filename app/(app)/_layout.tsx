import { useNavigationHistory } from '@/hooks/useNavigationHistory';

import { COLORS } from "@/constant/colors";
import { ICONS } from "@/constant/icons";
import useStore from "@/hooks/store";
import { Redirect, Stack, usePathname, useRouter } from "expo-router";
import { CornerUpLeft } from "lucide-react-native";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import DEBUG_MODE from "../../config/debug";

function AppLayoutContent() {
  const { authStore, gamesStore, sessionStore } = useStore();
  const isAuth = !!authStore?.isAuth;
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const hasHandledReload = useRef(false);

  const isMobile = width < 1300;

  // Обработка перезагрузки страницы
  useEffect(() => {
    // Проверяем, была ли уже обработана перезагрузка в этой сессии
    const reloadHandledKey = "reloadHandled";
    if (typeof window !== "undefined" && sessionStorage.getItem(reloadHandledKey) === "true") {
      return;
    }

    // Проверяем, была ли перезагрузка страницы
    // Используем комбинацию sessionStorage и проверки типа навигации
    let wasReloaded = false;
    if (typeof window !== "undefined") {
      // Проверяем флаг из sessionStorage (устанавливается при beforeunload)
      const reloadFlag = sessionStorage.getItem("pageReloaded") === "true";

      // Проверяем тип навигации (если доступно)
      const navType = (performance as any).navigation?.type;
      const isReload = navType === 1; // TYPE_RELOAD

      wasReloaded = reloadFlag || isReload;
    }

    const handleReload = async () => {
      // Помечаем, что обработка началась
      if (typeof window !== "undefined") {
        sessionStorage.setItem(reloadHandledKey, "true");
      }

      const currentSession = gamesStore.getCurrentSession;
      const sessionRole = gamesStore.getSessionRole;

      // Обрабатываем сессию только если была реальная перезагрузка страницы
      if (wasReloaded && currentSession && sessionRole) {
        try {
          if (sessionRole === "player") {
            // Если игрок - выходим из сессии
            await gamesStore.leaveSession(currentSession.id);
            sessionStore?.clearSession();
          } else if (sessionRole === "master") {
            // Если мастер - завершаем сессию
            await gamesStore.finishSession(currentSession.id, "Сессия завершена из-за перезагрузки страницы");
            sessionStore?.clearSession();
          }
        } catch (e) {
          console.warn("Ошибка при обработке перезагрузки сессии", e);
          // В случае ошибки все равно очищаем состояние
          gamesStore.exitSession();
          sessionStore?.clearSession();
        }
      }

      // Перенаправляем на главную страницу при любой перезагрузке
      if (wasReloaded) {
        // Очищаем флаг перезагрузки перед редиректом
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("pageReloaded");
        }
        // Используем setTimeout для гарантии выполнения после монтирования
        setTimeout(() => {
          router.replace("/(app)/main");
        }, 0);
      }
    };

    // Выполняем обработку при монтировании
    handleReload();

    // Устанавливаем флаг перезагрузки при событии beforeunload
    if (typeof window !== "undefined") {
      const handleBeforeUnload = () => {
        sessionStorage.setItem("pageReloaded", "true");
        // Сбрасываем флаг обработки, чтобы при следующей загрузке обработка выполнилась
        sessionStorage.removeItem(reloadHandledKey);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [gamesStore, sessionStore, router]);

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
    "/cabinet/weapon", //окно списка оружия
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
  const pathname = usePathname();
  const { getPreviousRoute, goBack, getDefaultRoute } = useNavigationHistory();

  const handleBack = () => {
    const previousRoute = getPreviousRoute();

    if (previousRoute) {
      // Есть история - переходим на предыдущий маршрут
      goBack(); // Удаляем текущую страницу из истории
      router.push(previousRoute as any);
    } else {
      // Нет истории - идем на дефолтный маршрут
      const defaultRoute = getDefaultRoute(pathname);
      router.push(defaultRoute as any);
    }
  };

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={handleBack}
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
