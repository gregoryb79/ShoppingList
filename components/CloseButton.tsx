import { TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, iconSizes, typography, spacing, borderRadius } from '../styles/tokens';

type CloseButtonProps = {
    onPress?: () => void;
}
export default function CloseButton({onPress}: CloseButtonProps) {
    return (
        <TouchableOpacity 
            onPress={onPress}
            style={{ padding: 0, marginRight: 0 }}
        >            
            <Icon name="cancel" size={iconSizes.md} color={colors.primaryBlue}/>
        </TouchableOpacity>
    );
}