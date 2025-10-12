import { View, Text, TouchableOpacity } from "react-native";
import { observer } from "mobx-react-lite";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "@/constant/colors";

const CreateSessionScreen = () => {
    const router = useRouter();
    const handleCreateSession = () => {
        router.push("/session/1");
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleCreateSession} style={styles.buttonCreateSession}><Text>Create Session</Text></TouchableOpacity>
        </View>
    )
}

export default observer(CreateSessionScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.backgroundPrimary,
    },
    buttonCreateSession: {
        padding: 20,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        color: COLORS.textPrimary,
        fontSize: 18,
    }
});