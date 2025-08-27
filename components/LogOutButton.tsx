import { TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, iconSizes, typography, spacing, borderRadius } from '../styles/tokens';

type LogOutButtonProps = {
    onPress?: () => void;
    style?: object;
    disabled?: boolean;
}
export default function LogOutButton({onPress, style, disabled}: LogOutButtonProps) {
    return (
        <TouchableOpacity 
            onPress={onPress}            
            style={[{ padding: 0 }, style]}
            disabled={disabled}
        >            
            <Icon name="logout" size={iconSizes.md} color={disabled ? colors.textSecondary : colors.primaryBlue}/>
        </TouchableOpacity>
    );
}