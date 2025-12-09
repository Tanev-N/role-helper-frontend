import { useEffect, useRef } from 'react';
import { usePathname } from 'expo-router';

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
  
  const getDefaultRoute = (currentPath: string) => {
    if (currentPath.startsWith('/cabinet/character')) {
      return '/cabinet/characters';
    } else if (currentPath.startsWith('/cabinet/')) {
      return '/cabinet';
    } else {
      return '/main';
    }
  };
  
  return {
    getPreviousRoute,
    goBack,
    getDefaultRoute,
    // getHistory: () => [...history.current], // для отладки
  };
};