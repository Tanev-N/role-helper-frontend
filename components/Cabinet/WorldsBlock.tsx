import React from "react";
import { View, Text, TouchableOpacity, Pressable, useWindowDimensions } from "react-native";
import { Globe2, ArrowRight, Plus } from "lucide-react-native";
import { s } from "./styles";

export default function WorldsBlock() {
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

  const maxWorlds = isMobile ? 4 : 12;
  const displayWorlds = Math.min(7, maxWorlds);
  const worldsPerRow = isMobile ? 2 : 4;

  const worldCardWidth =
    (blockWidth - 35 * 2 - (worldsPerRow - 1) * 8) / worldsPerRow;

  return (
    <View style={[s.sectionBlock, { width: blockWidth }]}>
      <View style={s.sectionHeader}>
        <View style={s.sectionTitleRow}>
          <Globe2 size={28} color={"rgba(227,227,227,1)"} />
          <View style={{ marginLeft: 25 }}>
            <Text style={s.sectionTitle}>Мои миры</Text>
            <Text style={s.sectionSubtitle}>Доступно 7 миров</Text>
          </View>
        </View>
        <TouchableOpacity style={s.iconCircle}>
          <ArrowRight size={20} color={"rgba(227,227,227,1)"} />
        </TouchableOpacity>
      </View>

      <View style={s.divider} />

      <View style={[s.itemsGrid, { gap: 18, paddingHorizontal: 35 }]}>
        {[...Array(displayWorlds)].map((_, i) => (
          <Pressable
            key={i}
            style={({ pressed }) => [
              s.worldRect,
              {
                backgroundColor: colors[i % colors.length],
                width: worldCardWidth,
                height: 88,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          />
        ))}

        <TouchableOpacity
          style={[s.addRect, { width: worldCardWidth, height: 88 }]}
        >
          <Plus size={36} color={"rgba(227,227,227,1)"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
