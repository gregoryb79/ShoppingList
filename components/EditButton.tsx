import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, iconSizes } from '../styles/tokens';

type EditButtonProps = {
    onPress?: () => void;
    disabled?: boolean;
}
export default function EditButton({onPress, disabled}: EditButtonProps) {
    return (
        <TouchableOpacity 
            onPress={onPress}            
            style={[
                styles.container,
                { borderColor: disabled ? colors.textSecondary : colors.primaryBlue }
            ]}
            disabled={disabled}>            
            <Icon name="edit" size={iconSizes.lg} color={disabled ? colors.textSecondary : colors.primaryBlue}/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        width: iconSizes.lg+8,
        height: iconSizes.lg+8,
        borderWidth: 2,
        // borderColor: colors.primaryBlue,
        borderRadius: (iconSizes.lg + 8) / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
