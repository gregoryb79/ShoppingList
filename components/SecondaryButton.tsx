import { TouchableOpacity, StyleSheet, Text, ViewStyle } from "react-native";
import { colors, typography, spacing, borderRadius } from '../styles/tokens';



type SecondaryButtonProps = {    
    onPress: () => void;
    label: string;
    extraStyles?: ViewStyle;
    disabled?: boolean;
}
export function SecondaryButton({ onPress, label, extraStyles, disabled }: SecondaryButtonProps) {

return(
    <TouchableOpacity style={[styles.secondaryButton, extraStyles, disabled && { opacity: 0.5 }]} onPress={onPress} disabled={disabled}>
        <Text style={styles.secondaryButtonText}>{label}</Text>
    </TouchableOpacity>
    );
}

export const styles = StyleSheet.create({    
    secondaryButton: {
        backgroundColor: colors.primaryBlue,
        paddingTop: spacing.sm, paddingBottom: spacing.sm,
        paddingLeft: spacing.md, paddingRight: spacing.md,
        borderRadius: borderRadius.base,
        alignItems: 'center',        
        alignSelf: 'center',
        // marginBottom: spacing.md,
    },
    secondaryButtonText: {
        color: colors.textWhite,
        fontSize: typography.lg,
        fontWeight: typography.weights.semibold,
    },
});