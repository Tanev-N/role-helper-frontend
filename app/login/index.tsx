import React, { useState } from "react";
import { Text, View, Pressable } from "react-native";
import AuthCard from "@/components/Auth/AuthCard";
import AuthInput from "@/components/Auth/AuthInput";
import AuthButton from "@/components/Auth/AuthButton";
import { COLORS } from "@/components/UI/Colors";
import { TYPOGRAPHY } from "@/components/UI/Typography";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import useStore from "@/hooks/store";

const LoginScreen = observer(() => {
  const { authStore } = useStore();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    await authStore.login(username, password);
    if (authStore.isAuth) router.replace("/(app)/cabinet");
    else setError("неверный логин или пароль");
  };

  const isActive = username && password;

  return (
    <AuthCard>
      {/* === Заголовок === */}
      <Text
        style={[
          {
            fontSize: 48,
            textAlign: "center",
            fontFamily: "UncialAntiqua",
            fontWeight: "400" as const,
            color: "#499A00",
          },
        ]}
      >
        CriticalRoll
      </Text>

      {/* === Подзаголовок === */}
      <Text
        style={[
          {
            fontSize: 28,
            textAlign: "center",
            marginTop: 8,
            fontFamily: "Roboto",
            fontWeight: "400" as const,
            color: "#FFFFFF",
          },
        ]}
      >
        Авторизация
      </Text>

      {/* === Поля формы === */}
      <View style={{ marginTop: 32 }}>
        <AuthInput
          placeholder="Логин"
          value={username}
          onChangeText={setUsername}
        />
        <AuthInput
          placeholder="Пароль"
          secure
          value={password}
          onChangeText={setPassword}
          error={error}
        />

        <AuthButton title="Войти" onPress={handleLogin} disabled={!isActive} />

        {/* === Ссылка на регистрацию === */}
        <Pressable
          onPress={() => router.push("/register")}
          style={{ marginTop: 24, alignSelf: "center" }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontFamily: "Roboto",
              fontWeight: "400" as const,
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
