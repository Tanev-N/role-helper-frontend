import useStore from "@/hooks/store";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import React from "react";
import { ScrollView, useWindowDimensions } from "react-native";

import CabinetHeader from "@/components/Cabinet/CabinetHeader";
import CharactersBlock from "@/components/Cabinet/CharactersBlock";
import WorldsBlock from "@/components/Cabinet/WorldsBlock";
import { styles } from "@/components/Cabinet/styles";



const CabinetScreen = observer(() => {
  const { authStore } = useStore();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isMobile = width < 768;
  const blockWidth = Math.min(width * 0.95, 904);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center", paddingVertical: 24, justifyContent: "center", height: "100%" }}
    >
      <CabinetHeader authStore={authStore} router={router} blockWidth={blockWidth} />
      <CharactersBlock blockWidth={blockWidth} isMobile={isMobile} />
      <WorldsBlock blockWidth={blockWidth} isMobile={isMobile} />
    </ScrollView>
  );
});

export default CabinetScreen;
