import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { colors, typography, spacing, borderRadius } from '../styles/tokens';

import { ActivityIndicator, View, Text } from 'react-native';
import SettingsButton from '@/components/SettingsButton';
import HamburgerButton from '@/components/HamburgerButton';
import { getUser } from '@/utils/users.utils';




export default function RootLayout() {
    const [loading, setLoading] = useState(true);
    
    // useEffect(() => {
    //     async function initializeApp (){
    //         setLoading(true);
    //         try {
    //             // const user = await getUser();                
    //             // await initiateListsStorage();
    //         } catch (error) {
    //             console.error('Error during app initialization:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
        
    //     initializeApp();
    // }, []);
   

    // if (loading) {
    //     return (
    //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //         <ActivityIndicator size="large" />
    //         <Text>Initializing app...</Text>        
    //     </View>
    //     );
    // }

    return (
        <Stack screenOptions= {headerOptions}>
            <Stack.Screen name="index" options={{ 
                headerLeft: () => <HamburgerButton onPress={() => {}} style={{marginRight: spacing.md}}/>,
                title: 'Shopping List',
                headerRight: () => <SettingsButton onPress={() => {}}/>
            }}/>
            {/* <Stack.Screen name="index" options={{ title: 'TravelExpences ', headerRight: () => <SettingsButton onPress={() => {router.push('/settings')}}/>}} />
            <Stack.Screen name="expenses" options={{ title: 'Expenses', headerRight: () => <SettingsButton onPress={() => {router.push('/settings')}}/> }} />                        
            <Stack.Screen name="settings" options={{ title: 'Settings'}} /> 
            <Stack.Screen name="currencies_config" options={{ title: 'Currencies', headerRight: () => <SettingsButton onPress={() => {router.push('/settings')}}/> }} />                   */}
        </Stack>
    );
}
 const headerOptions = {
    headerStyle: {
        backgroundColor: colors.textWhite, 
    },
    headerTintColor: colors.primaryBlue, // White text
    headerTitleStyle: {
        fontWeight: typography.weights.bold,
        fontSize: typography.xxl,
    },
};