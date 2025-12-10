import { observer } from "mobx-react-lite";
import React from "react";
import {
    ActivityIndicator,
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
    loading?: boolean;
    placeholderText?: string;
}

const CharacterModal: React.FC<CharacterModalProps> = observer(({
    visible,
    onClose,
    title,
    children,
    loading = false,
    placeholderText,
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
                        {children ? (
                            children
                        ) : loading ? (
                            <View style={styles.loadingWrapper}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                                <Text style={styles.placeholder}>Загрузка...</Text>
                            </View>
                        ) : (
                            <Text style={styles.placeholder}>
                                {placeholderText || `Здесь будет контент: ${title.toLowerCase()}`}
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
});

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
    loadingWrapper: {
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
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