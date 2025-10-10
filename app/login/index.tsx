import { View, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import useStore from "@/hooks/store";
import { observer } from "mobx-react-lite";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

const LoginScreen = observer(() => {
    const { authStore } = useStore();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        void (async () => {
            if (!authStore) {
                Alert.alert("Ошибка", "AuthStore не инициализирован");
                return;
            }
            await authStore.login(username, password);
            if (authStore.isAuth) {
                router.replace("/(app)/cabinet");
            } else {
                Alert.alert("Логин не прошел бро", "Что-то у тебя не правильно");
            }
        })();
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button
                title="Login"
                onPress={handleLogin}
            />
        </View>
    );
});

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
