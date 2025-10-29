import React, { useState } from "react";
import { Text, View, Pressable, Alert } from "react-native";
import AuthCard from "@/components/Auth/AuthCard";
import AuthInput from "@/components/Auth/AuthInput";
import AuthButton from "@/components/Auth/AuthButton";
import { COLORS } from "@/components/UI/Colors";
import useStore from "@/hooks/store";
import { observer } from "mobx-react-lite";
import { useRouter } from "expo-router";

const LoginScreen = observer(() => {
  const { authStore } = useStore();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    void (async () => {
      if (!authStore) {
        Alert.alert("Ошибка", "AuthStore не инициализирован");
        return;
      }

      setError(""); // сбрасываем прошлые ошибки
      await authStore.login(username, password);

      if (authStore.isAuth) {
        router.replace("/(app)/main");
      } else if (authStore.error === "InvalidCredentials") {
        setError("Неверный логин или пароль");
      } else if (authStore.error === "NetworkError") {
        Alert.alert("Ошибка сети", "Не удалось подключиться к серверу");
      } else {
        Alert.alert("Ошибка", "Не удалось войти");
      }
    })();
  };

  const isActive = username.trim() !== "" && password.trim() !== "";

  return (
    <AuthCard>
      {/* === Заголовок === */}
      <Text
        style={{
          fontSize: 48,
          textAlign: "center",
          fontFamily: "UncialAntiqua",
          fontWeight: "400",
          color: "#499A00",
        }}
      >
        CriticalRoll
      </Text>

      {/* === Подзаголовок === */}
      <Text
        style={{
          fontSize: 28,
          textAlign: "center",
          marginTop: 8,
          fontFamily: "Roboto",
          fontWeight: "400",
          color: "#FFFFFF",
        }}
      >
        Авторизация
      </Text>

      {/* === Поля формы === */}
      <View style={{ marginTop: 32 }}>
        <AuthInput
          placeholder="Логин"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setError("");
          }}
        />

        <AuthInput
          placeholder="Пароль"
          secure
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
          error={error}
        />

        {/* === Кнопка входа === */}
        <AuthButton title="Войти" onPress={handleLogin} disabled={!isActive} />

        {/* === Ссылка на регистрацию === */}
        <Pressable
          onPress={() => router.push("/register")}
          style={{ marginTop: 24, alignSelf: "center" }}
        >
          <Text
            style={{
              color: COLORS.grey,
              fontFamily: "Roboto",
              fontWeight: "400",
              fontSize: 18,
              lineHeight: 18,
              textAlign: "center",
              textDecorationLine: "underline",
            }}
          >
            Нет аккаунта? Зарегистрироваться
          </Text>
        </Pressable>
      </View>
    </AuthCard>
  );
});

export default LoginScreen;
