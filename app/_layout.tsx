import { Stack } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { colors, iconSizes, typography } from '../styles/tokens';

import HamburgerButton from '@/components/HamburgerButton';
import { getUser, syncUser } from '@/utils/users.utils';
import { ActivityIndicator, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SYNC_INTERVAL_CONNECTED = 300000; // 5 minutes in ms
const SYNC_INTERVAL_DISCONNECTED = 30000; // 30 seconds in ms

export const ConnectedContext = createContext<{ connected: boolean; setConnected: (v: boolean) => void }>({
  connected: false,
  setConnected: () => {},
});
export const useConnected = () => useContext(ConnectedContext);

export default function RootLayout() {
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);

    useEffect(() => {     
        async function initializeApp (){
            setLoading(true);
            try {
                const user = await getUser();                                
            } catch (error) {
                console.error('Error during app initialization:', error);
            } finally {
                setLoading(false);
            }
        };
        
        initializeApp();              

        syncUserData();
        

    }, []);

    useEffect(() => {
        const intervalTime = connected ? SYNC_INTERVAL_CONNECTED : SYNC_INTERVAL_DISCONNECTED; 

        const interval = setInterval(() => {
            console.log('Syncing user data at interval:', intervalTime);
            syncUserData();
        }, intervalTime);

        return () => clearInterval(interval);
    }, [connected]);

    function syncUserData() {
        try {
            syncUser().then((result) => {
                if (result === true) {
                    console.log('User data synced successfully, setting connected to true');
                    setConnected(true);
                } else {
                    console.log('Sync failed or returned false, setting connected to false');
                    setConnected(false);
                }
            });
        } catch (error) {
            console.error('Error during app initialization:', error);
        } 
    }

    if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <Text>Initializing app...</Text>        
        </View>
        );
    }

    return (
        <ConnectedContext.Provider value={{ connected, setConnected }}>
            <Stack screenOptions= {headerOptions}>
                <Stack.Screen name="index" options={{ 
                    // headerLeft: () => <HamburgerButton onPress={() => {}} style={{marginRight: spacing.md}}/>,
                    title: 'Shopping List',
                    headerRight: () => (<>
                        {!connected && <Icon name="cloud-off" size={iconSizes.md} color={colors.textSecondary}/>}
                        <HamburgerButton onPress={() => {}}/>                    
                    </>)
                }}/>
                <Stack.Screen name="list" options={{ 
                    // headerLeft: () => <HamburgerButton onPress={() => {}} style={{marginRight: spacing.md}}/>,
                    title: 'Shopping List',
                    headerRight: () => (<>
                        {!connected && <Icon name="cloud-off" size={iconSizes.md} color={colors.textSecondary}/>}
                        <HamburgerButton onPress={() => {}}/>                    
                    </>)
                }}/>
                {/* <Stack.Screen name="index" options={{ title: 'TravelExpences ', headerRight: () => <SettingsButton onPress={() => {router.push('/settings')}}/>}} />
                <Stack.Screen name="expenses" options={{ title: 'Expenses', headerRight: () => <SettingsButton onPress={() => {router.push('/settings')}}/> }} />                        
                <Stack.Screen name="settings" options={{ title: 'Settings'}} /> 
                <Stack.Screen name="currencies_config" options={{ title: 'Currencies', headerRight: () => <SettingsButton onPress={() => {router.push('/settings')}}/> }} />                   */}
            </Stack>
        </ConnectedContext.Provider>
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