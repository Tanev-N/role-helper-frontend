import { View, Text } from "react-native";
import { observer } from "mobx-react-lite";
const CharacterScreen = ({ id }: { id: string }) => {
    return (
        <View>
            <Text>Character Screen {id}</Text>
        </View>
    );
}

export default observer(CharacterScreen);