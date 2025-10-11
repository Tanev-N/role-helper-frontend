import { View, Text } from "react-native";
import { observer } from "mobx-react-lite";
const CharactersScreen = () => {
    return (
        <View>
            <Text>Characters Screen</Text>
        </View>
    );
}

export default observer(CharactersScreen);