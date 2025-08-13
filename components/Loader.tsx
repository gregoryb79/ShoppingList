import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, iconSizes, typography, spacing, borderRadius } from '../styles/tokens';

export default function Loader() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: colors.background,
    },
});
