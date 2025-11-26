import React from "react";
import { Modal, View, Pressable, Text, StyleSheet } from "react-native";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { Colors } from "@/src/styles/style";
import { useTranslation } from "react-i18next";

interface EditDeleteDialogProps {
    visible: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    showDelete?: boolean;
    position?: { top: number; right: number };
}

export function EditDeleteDialog({
    visible,
    onClose,
    onEdit,
    onDelete,
    showDelete = true,
    position = { top: 100, right: 8 },
}: EditDeleteDialogProps) {
    const { t } = useTranslation();

    return (
        <Modal visible={visible} transparent animationType="fade">
            <Pressable style={styles.backdrop} onPress={onClose}>
                <View style={[styles.dialog, position]}>

                {/* Edit */}
                <Pressable style={styles.button} onPress={onEdit}>
                  <Icon name="Pencil" size={18} color={Colors.textPrimary} />
                  <Text style={styles.text}>{t('dialogs.editDelete.edit')}</Text>
                </Pressable>

                {/* Delete */}
                {showDelete && (
                  <>
                    <View style={styles.divider} />
                    <Pressable style={styles.button} onPress={onDelete}>
                      <Icon name="Trash" size={18} color={Colors.deleteColor} />
                      <Text style={[styles.text, styles.deleteText]}>
                        {t('dialogs.editDelete.delete')}
                      </Text>
                    </Pressable>
                  </>
                )}
            </View>
          </Pressable>
        </Modal>
  );
}


const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
  },

  dialog: {
    position: "absolute",
    backgroundColor: Colors.background,
    borderRadius: 15,
    paddingVertical: 6,
    width: 220,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 14,
  },

  text: {
    fontSize: 16,
    color: Colors.textPrimary,
  },

  deleteText: {
    color: Colors.deleteColor,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: Colors.borderColor,
    marginVertical: 4,
  },
});