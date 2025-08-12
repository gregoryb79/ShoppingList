import { TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, iconSizes, typography, spacing, borderRadius } from '../styles/tokens';

type SettingsButtonProps = {
    onPress?: () => void;
    style?: object;
}
export default function HamburgerButton({onPress, style}: SettingsButtonProps) {
    return (
        <TouchableOpacity 
            onPress={onPress}            
            style={[{ padding: 0 }, style]}
        >            
            <Icon name="menu" size={iconSizes.md} color={colors.primaryBlue}/>
        </TouchableOpacity>
    );
}