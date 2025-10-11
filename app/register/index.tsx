import React, { useState, useMemo } from "react";
import { Text, View, Pressable } from "react-native";
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

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false); // добавили
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [error, setError] = useState("");

  // === Проверка email ===
  const isEmailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );

  // === Проверки пароля ===
  const passwordChecks = useMemo(() => {
    return [
      { label: "Минимум 8 символов", valid: /^.{8,}$/.test(password) },
      { label: "Есть заглавная буква", valid: /[A-Z]/.test(password) },
      { label: "Есть строчная буква", valid: /[a-z]/.test(password) },
      { label: "Есть цифра", valid: /[0-9]/.test(password) },
      { label: "Есть спецсимвол", valid: /[!@#$%^&*(),.?\":{}|<>]/.test(password) },
      { label: "Пароли совпадают", valid: password !== "" && password === repassword },
    ];
  }, [password, repassword]);

  const allValid = passwordChecks.every((c) => c.valid);
  const isActive = isEmailValid && password && repassword && allValid && !error;

  // === Обработчик регистрации ===
  const handleRegister = async () => {
    setError("");

    if (!isEmailValid) {
      setError("Введите корректный адрес электронной почты");
      return;
    }

    if (!allValid) {
      setError("Пароль не соответствует требованиям");
      return;
    }

    try {
      const success = await authStore.register(email, password, repassword);

      if (success === false || authStore.error === "UserAlreadyExists") {
        setError("Пользователь с данным логином уже зарегистрирован");
        return;
      }

      if (authStore.isAuth) {
        router.replace("/(app)/cabinet");
      } else {
        setError("Ошибка регистрации");
      }
    } catch (e) {
      console.error("Ошибка регистрации:", e);
      setError("Не удалось выполнить регистрацию. Попробуйте позже.");
    }
  };

  return (
    <AuthCard>
      {/* === Заголовки === */}
      <Text
        style={{
          fontSize: 48,
          textAlign: "center",
          fontFamily: "UncialAntiqua",
          fontWeight: "400" as const,
          color: "#499A00",
        }}
      >
        CriticalRoll
      </Text>

      <Text
        style={{
          fontSize: 28,
          textAlign: "center",
          marginTop: 8,
          fontFamily: "Roboto",
          fontWeight: "400" as const,
          color: "#FFFFFF",
        }}
      >
        Регистрация
      </Text>

      {/* === Форма === */}
      <View style={{ marginTop: 32 }}>
        {/* Email */}
        <AuthInput
          placeholder="Адрес электронной почты"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setError(""); // сбрасываем ошибку при изменении
          }}
          onBlur={() => setEmailTouched(true)} //  отмечаем, что поле покинуто
          error={
            emailTouched && !isEmailValid && email
              ? "Неверный формат e-mail"
              : error === "Пользователь с данным логином уже зарегистрирован"
              ? error
              : undefined
          }
        />

        {/* Пароли */}
        <AuthInput
          placeholder="Пароль"
          secure
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setError("");
          }}
        />
        <AuthInput
          placeholder="Повторите пароль"
          secure
          value={repassword}
          onChangeText={(t) => {
            setRepassword(t);
            setError("");
          }}
          error={
            error &&
            error !== "Пользователь с данным логином уже зарегистрирован"
              ? error
              : undefined
          }
        />

        {/* === Список требований === */}
        <View style={{ marginTop: 12, marginLeft: "10%" }}>
          {passwordChecks.map((check, i) => (
            <View
              key={i}
              style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}
            >
              <Text
                style={{
                  color: check.valid ? "#6DE901" : "#FF1D25",
                  fontFamily: "Roboto",
                  fontWeight: "400" as const,
                  fontSize: 16,
                }}
              >
                {check.valid ? "☑" : "☐"} {check.label}
              </Text>
            </View>
          ))}
        </View>

        {/* === Кнопка регистрации === */}
        <AuthButton title="Регистрация" onPress={handleRegister} disabled={!isActive} />

        {/* === Ссылка на вход === */}
        <Pressable
          onPress={() => router.push("/login")}
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
            Уже есть аккаунт? Войти
          </Text>
        </Pressable>
      </View>
    </AuthCard>
  );
});

export default RegisterScreen;
