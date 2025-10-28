import React from "react";
import { View, Text, TouchableOpacity, Pressable, useWindowDimensions } from "react-native";
import { Users2, ArrowRight, Plus } from "lucide-react-native";
import { s } from "./styles";

export default function CharactersBlock() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const blockWidth = Math.min(width * 0.95, 904);

  const colors = [
    "rgba(73,124,0,1)",
    "rgba(151,0,136,1)",
    "rgba(0,60,179,1)",
    "rgba(138,113,0,1)",
    "rgba(92,15,0,1)",
  ];

  const maxCharacters = isMobile ? 8 : 24;
  const displayCharacters = Math.min(15, maxCharacters);
  const charsPerRow = isMobile ? 4 : 8;

  const charCardSize =
    (blockWidth - 35 * 2 - (charsPerRow - 1) * 8) / charsPerRow;

  return (
    <View style={[s.sectionBlock, { width: blockWidth }]}>
      <View style={s.sectionHeader}>
        <View style={s.sectionTitleRow}>
          <Users2 size={28} color={"rgba(227,227,227,1)"} />
          <View style={{ marginLeft: 25 }}>
            <Text style={s.sectionTitle}>Мои персонажи</Text>
            <Text style={s.sectionSubtitle}>Доступно 15 персонажей</Text>
          </View>
        </View>
        <TouchableOpacity style={s.iconCircle}>
          <ArrowRight size={20} color={"rgba(227,227,227,1)"} />
        </TouchableOpacity>
      </View>

      <View style={s.divider} />

      <View style={[s.itemsGrid, { gap: 18, paddingHorizontal: 35 }]}>
        {[...Array(displayCharacters)].map((_, i) => (
          <Pressable
            key={i}
            style={({ pressed }) => [
              s.characterSquare,
              {
                backgroundColor: colors[i % colors.length],
                width: charCardSize,
                height: charCardSize,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          />
        ))}

        <TouchableOpacity
          style={[s.addSquare, { width: charCardSize, height: charCardSize }]}
        >
          <Plus size={36} color={"rgba(227,227,227,1)"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
