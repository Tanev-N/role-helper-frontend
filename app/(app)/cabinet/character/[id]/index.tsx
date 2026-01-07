import CharactersScreen from "@/app/(app)/cabinet/character/index";
import { useLocalSearchParams } from "expo-router";
import { observer } from "mobx-react-lite";

const CharacterScreenById = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <CharactersScreen
            characterId={id}
            mode="edit"
        />
    );
};

export default observer(CharacterScreenById);