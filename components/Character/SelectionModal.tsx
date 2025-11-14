import { COLORS } from "@/constant/colors";
import React from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

interface SelectionItem {
    name: string;
    nameEn?: string;
    icon: any | null;
}

interface SelectionModalProps {
    visible: boolean;
    title: string;
    items: SelectionItem[];
    selectedValue: string;
    onSelect: (value: string) => void;
    onClose: () => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({
    visible,
    title,
    items,
    selectedValue,
    onSelect,
    onClose,
}) => {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, isMobile && styles.modalContentMobile]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {items.map((item) => {
                            const isSelected = item.name === selectedValue || item.nameEn === selectedValue;
                            return (
                                <TouchableOpacity
                                    key={item.name}
                                    style={[
                                        styles.itemContainer,
                                        isSelected && styles.itemContainerSelected,
                                    ]}
                                    onPress={() => {
                                        onSelect(item.name);
                                        onClose();
                                    }}
                                >
                                    {item.icon ? (
                                        <Image source={item.icon} style={styles.itemIcon} />
                                    ) : (
                                        <View style={styles.itemIconPlaceholder} />
                                    )}
                                    <Text
                                        style={[
                                            styles.itemText,
                                            isSelected && styles.itemTextSelected,
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: COLORS.backgroundPrimary,
        borderRadius: 16,
        width: "100%",
        maxWidth: 600,
        maxHeight: "80%",
        padding: 20,
    },
    modalContentMobile: {
        maxWidth: "100%",
        maxHeight: "90%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.textLowEmphasis,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: "600",
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.backgroundSecondary,
        justifyContent: "center",
        alignItems: "center",
    },
    closeButtonText: {
        fontSize: 20,
        color: COLORS.textPrimary,
        fontWeight: "600",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        gap: 12,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 12,
        padding: 16,
        gap: 16,
    },
    itemContainerSelected: {
        backgroundColor: COLORS.primary,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    itemIcon: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },
    itemIconPlaceholder: {
        width: 40,
        height: 40,
    },
    itemText: {
        fontSize: 20,
        color: COLORS.textPrimary,
        fontFamily: "Roboto",
        flex: 1,
    },
    itemTextSelected: {
        fontWeight: "600",
        color: COLORS.textPrimary,
    },
});

export default SelectionModal;

