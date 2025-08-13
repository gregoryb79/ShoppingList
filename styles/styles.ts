import { colors, typography, spacing, borderRadius } from '../styles/tokens';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.background,
        padding: spacing.lg,  
        gap: spacing.md,     
    },
    h3: {
        fontSize: typography.lg,
        fontWeight: typography.weights.bold,        
        color: colors.textPrimary,
    },    
    text_md: {
        fontSize: typography.md,
        color: colors.textPrimary,
    },
    text_center: {
        textAlign: 'center',
    },
    backgroundWhite:{
        backgroundColor: colors.textWhite,
    },
    borderRadius_sm:{
        borderRadius: borderRadius.sm,
    },
    padding_sm: {
        padding: spacing.sm,
    },
    mainScreenContainer: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
        // borderWidth: 2,
        // borderColor: 'red',
    },
    shoppingListsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,        
    },
    addNewListButton: {        
        flexDirection: 'row',
        justifyContent: 'center',        
    },
});