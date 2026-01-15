import { useEffect, useRef } from "react";
import { usePathname } from "expo-router";

export const useNavigationHistory = () => {
  const pathname = usePathname();
  const history = useRef<string[]>([]);

  useEffect(() => {
    if (history.current.length === 0) {
      // Первая загрузка приложения
      history.current.push(pathname);
    } else if (history.current[history.current.length - 1] !== pathname) {
      history.current.push(pathname);

      if (history.current.length > 20) {
        history.current = history.current.slice(-20);
      }
    }
  }, [pathname]);

  const getPreviousRoute = () => {
    if (history.current.length < 2) return null;
    return history.current[history.current.length - 2];
  };

  const goBack = () => {
    if (history.current.length > 1) {
      // Удаляем текущую страницу из истории при навигации назад
      history.current.pop();
    }
  };

  /**
   * Возвращает дефолтный роут, если идти назад некуда.
   * Учитывает и старые пути без "(app)", и новые с "(app)".
   */
  const getDefaultRoute = (currentPath: string) => {
    // Нормализуем путь: убираем префикс "/(app)" если есть
    const normalized =
      currentPath.startsWith("/(app)")
        ? currentPath.replace("/(app)", "")
        : currentPath;

    if (normalized.startsWith("/cabinet/character")) {
      // список персонажей
      return "/(app)/cabinet/characters";
    } else if (normalized.startsWith("/cabinet/")) {
      // корень кабинета
      return "/(app)/cabinet";
    } else {
      // главная страница приложения
      return "/(app)/main";
    }
  };

  return {
    getPreviousRoute,
    goBack,
    getDefaultRoute,
    // getHistory: () => [...history.current], // для отладки
  };
};