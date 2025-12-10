import React from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constant/colors";

interface CharacterModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
}

const CharacterModal: React.FC<CharacterModalProps> = ({
    visible,
    onClose,
    title,
    children,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* === ЗАГОЛОВОК === */}
                    <Text style={styles.title}>{title}</Text>

                    {/* === КОНТЕНТ С ПРОКРУТКОЙ === */}
                    <ScrollView
                        style={styles.scrollArea}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {children || (
                            <Text style={styles.placeholder}>
                                Здесь будет контент: {title.toLowerCase()}
                            </Text>
                        )}
                    </ScrollView>

                    {/* === КНОПКА ЗАКРЫТИЯ === */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CharacterModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    modalContainer: {
        width: "100%",
        maxWidth: 600,
        maxHeight: "80%",
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontFamily: "Roboto",
        fontSize: 22,
        fontWeight: "500",
        color: COLORS.textPrimary,
        marginBottom: 12,
        textAlign: "center",
    },
    scrollArea: {
        flexGrow: 0,
        maxHeight: "70%",
    },
    scrollContent: {
        paddingBottom: 10,
    },
    placeholder: {
        color: COLORS.textSecondary,
        fontSize: 16,
        textAlign: "center",
    },
    closeButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        alignSelf: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 16,
    },
    closeButtonText: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontFamily: "Roboto",
    },
});