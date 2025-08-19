import { borderRadius, colors, iconSizes, spacing, typography } from "@/styles/tokens";
import { Modal, StyleSheet, Text, TextInput, View } from "react-native";
import CloseButton from "./CloseButton";
import { MainButton } from "./MainButton";
import { useState } from "react";
// import CheckBox from "./CheckBox";
import { createShoppingList } from "@/utils/lists.utils";

type ShoppingListModalProps = {
    visible: boolean,    
    confirmButtonLabel?: string,
    title?: string,
    placeholder?: string,
    listName?: string,
    onClose: () => void,
    onConfirm: (name: string) => void
}
export default function ShoppingListModal({visible, onClose, onConfirm, confirmButtonLabel, title, placeholder, listName}: ShoppingListModalProps) {
    const [textInput, setTextInput] = useState(listName || "");
    const [isChecked, setIsChecked] = useState(false);

    async function handleConfirm() {
        console.log('Confirm pressed:', textInput);
        console.log('Private:', isChecked);
        console.log('Title:', title);
        if (textInput.trim() === "") {
            alert('Please fill in all fields');
            return;
        }

        if (!title) {
            console.log('Creating shopping list:', textInput, 'Private:', isChecked);
            await createShoppingList(textInput);
            onClose();
        } else {
            // await updateShoppingList(textInput, isChecked);
        }
    }

    return (
        <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.container}>
                    <View style={styles.listContainer}>
                        <View style={styles.closeButtonContainer}>
                            <CloseButton onPress={() => { console.log('Close pressed'); onClose(); }} />
                        </View>
                        <Text style={styles.title}>{title || "Create a new shopping list"}</Text>
                        <TextInput style={styles.input} placeholder={placeholder || "List name"}
                            value={textInput}
                            onChangeText={setTextInput}
                         />
                         {/* <View style={styles.checkboxContainer}>
                             <CheckBox checked={isChecked} onChange={setIsChecked} size={iconSizes.sm} checkedColor={colors.primary} />
                             <Text style={[styles.checkboxLabel, { color: isChecked ? colors.textPrimary : colors.textSecondary }]}>Private</Text>
                         </View> */}
                        <MainButton label={confirmButtonLabel || "Create"} onPress={handleConfirm} />
                    </View>
                </View>
            </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 2,
        // borderColor: 'red',
        // backgroundColor: colors.background,
    },
    listContainer: {
        position: 'relative',
        padding: spacing.md,
        width: '90%',
        // height: '30%',
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: colors.background,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: borderRadius.base,
    },
    closeButtonContainer: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        zIndex: 10,
        // backgroundColor: 'rgba(255,0,0,0.2)',
    },
    title: {
        fontSize: typography.lg,
        fontWeight: typography.weights.semibold,
        marginBottom: spacing.md,
    },
    input: {
        fontSize: typography.lg,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.base,
        padding: spacing.sm,
        marginBottom: spacing.md,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    checkboxLabel: {
        fontSize: typography.md,
        marginLeft: spacing.sm,
    },

});
