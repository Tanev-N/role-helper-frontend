import { Stack, Redirect } from "expo-router";
import { observer } from "mobx-react-lite";
import useStore from "@/hooks/store";

function AppLayoutContent() {
    const { authStore } = useStore();
    const isAuth = !!authStore?.isAuth;

    if (!isAuth) {
        return <Redirect href="/login" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        ></Stack>
    );
}

export default observer(AppLayoutContent);
