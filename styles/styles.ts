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
    h2: {
        fontSize: typography.xxl,
        fontWeight: typography.weights.bold,        
        color: colors.primary,
        // textAlign: 'center',
    },
    h3: {
        fontSize: typography.lg,
        fontWeight: typography.weights.bold,        
        color: colors.textPrimary,
    },    
    h4: {
        fontSize: typography.md,
        fontWeight: typography.weights.bold,        
        color: colors.textPrimary,
    },
    text_lg: {
        fontSize: typography.lg,
        color: colors.textPrimary,
    },    
    text_md: {
        fontSize: typography.md,
        color: colors.textPrimary,
    },
    text_sm: {
        fontSize: typography.sm,
        color: colors.textPrimary,
    }, 
    text_center: {
        textAlign: 'center',
    },
    link: {
        color: colors.primary,
        textDecorationLine: 'underline',
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
    addButtonContainer: {        
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.md,
    },
    shoppingListsContainer: {
        flex: 1,
        flexDirection: 'column',        
        marginBottom: spacing.sm,
    },
    quickEntryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
        gap: spacing.md,
        // borderWidth: 1,
        // borderBottomColor: colors.border, 
    },
    quickInput: {
        flex: 1,
        fontSize: typography.lg,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.base,
        padding: spacing.sm,
        // marginBottom: spacing.md,
        // marginLeft: spacing.md,        
    },
    loginContainer: {
        // flex: 1,
        marginTop: spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.sm,
        gap: spacing.md,        
    },
    loginInput: {
        // flex: 1,
        width: '100%',
        fontSize: typography.lg,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.base,
        padding: spacing.sm,
        marginBottom: spacing.md,
    },

});