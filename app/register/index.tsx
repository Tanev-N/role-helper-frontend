import React, { useState } from "react";
import { Text, View, Pressable, Alert } from "react-native";
import AuthCard from "@/components/Auth/AuthCard";
import AuthInput from "@/components/Auth/AuthInput";
import AuthButton from "@/components/Auth/AuthButton";
import { COLORS } from "@/components/UI/Colors";
import useStore from "@/hooks/store";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";

const RegisterScreen = observer(() => {
  const { authStore } = useStore();
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

//   const handleRegister = () => {
//     void (async () => {
//       if (!authStore) {
//         Alert.alert("Ошибка", "AuthStore не инициализирован");
//         return;
//       }

//       // очищаем ошибки перед новой попыткой
//       setErrorLogin("");
//       setErrorPassword("");

//       // проверка совпадения паролей
//       if (password !== repassword) {
//         setErrorPassword("Пароли должны совпадать");
//         return;
//       }

//       await authStore.register(login, password, repassword);

//       if (authStore.isAuth) {
//         router.replace("/(app)/main");
//       } else if (authStore.error === "UserAlreadyExists") {
//         setErrorLogin("Данный логин уже существует");
//       } else {
//         Alert.alert("Регистрация не прошла");
//       }
//     })();
//   };

// const handleRegister = () => {
//     void (async () => {
//         if (!authStore) {
//         Alert.alert("Ошибка", "AuthStore не инициализирован");
//         return;
//         }

//         setErrorLogin("");
//         setErrorPassword("");

//         if (password !== repassword) {
//         setErrorPassword("Пароли должны совпадать");
//         return;
//         }

//         const result = await authStore.register(login, password, repassword);

//         if (result === "ok" && authStore.isAuth) {
//         router.replace("/(app)/main");
//         } else if (result === "exists") {
//         setErrorLogin("Данный логин уже существует");
//         } else {
//         Alert.alert("Регистрация не прошла");
//         }
//     })();
//     };

const handleRegister = () => {
  void (async () => {
    if (!authStore) {
      Alert.alert("Ошибка", "AuthStore не инициализирован");
      return;
    }

    setErrorLogin("");
    setErrorPassword("");

    if (password !== repassword) {
      setErrorPassword("Пароли должны совпадать");
      return;
    }

    await authStore.register(login, password, repassword);

    if (authStore.isAuth) {
      router.replace("/(app)/main");
    } else if (authStore.error === "UserAlreadyExists") {
      setErrorLogin("Данный логин уже существует");
    } else {
      Alert.alert("Регистрация не прошла");
    }
  })();
};



  const isActive =
    login.trim() !== "" && password.trim() !== "" && repassword.trim() !== "";

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
        Регистрация
      </Text>

      {/* === Поля === */}
      <View style={{ marginTop: 32 }}>
        <AuthInput
          placeholder="Логин"
          value={login}
          onChangeText={(t) => {
            setLogin(t);
            setErrorLogin("");
          }}
          error={errorLogin}
        />

        <AuthInput
          placeholder="Пароль"
          secure
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setErrorPassword("");
          }}
        />

        <AuthInput
          placeholder="Повторите пароль"
          secure
          value={repassword}
          onChangeText={(t) => {
            setRepassword(t);
            setErrorPassword("");
          }}
          error={errorPassword}
        />

        {/* === Кнопка регистрации === */}
        <AuthButton
          title="Регистрация"
          onPress={handleRegister}
          disabled={!isActive}
        />

        {/* === Ссылка на вход === */}
        <Pressable
          onPress={() => router.push("/login")}
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
            Уже есть аккаунт? Войти
          </Text>
        </Pressable>
      </View>
    </AuthCard>
  );
});

export default RegisterScreen;
