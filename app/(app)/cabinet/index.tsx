import React from "react";
import { ScrollView } from "react-native";
import { observer } from "mobx-react-lite";
import CabinetHeader from "@/components/Cabinet/CabinetHeader";
import CharactersBlock from "@/components/Cabinet/CharactersBlock";
import WorldsBlock from "@/components/Cabinet/WorldsBlock";
import { s } from "@/components/Cabinet/styles";

const CabinetScreen = observer(function CabinetScreen() {
  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ alignItems: "center", paddingVertical: 24 }}
    >
      <CabinetHeader />
      <CharactersBlock />
      <WorldsBlock />
    </ScrollView>
  );
});

export default CabinetScreen;

