import { router, Stack } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { colors, iconSizes, typography } from '../styles/tokens';

import LoginButton from '@/components/LoginButton';
import LogOutButton from '@/components/LogOutButton';
import { doLogout, getUser, syncUser } from '@/utils/users.utils';
import { ActivityIndicator, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SYNC_INTERVAL_CONNECTED = 300000; // 5 minutes in ms
const SYNC_INTERVAL_DISCONNECTED = 30000; // 30 seconds in ms

export const AppContext = createContext<{
  connected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  loggedUser: boolean;
  setLoggedUser: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  connected: false,
  setConnected: () => {},
  loggedUser: false,
  setLoggedUser: () => {},
});

export const useAppContext = () => useContext(AppContext);

export default function RootLayout() {
    
    console.log('Rendering RootLayout');
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState("");
    const [loggedUser, setLoggedUser] = useState(false);

    useEffect(() => {
        async function initializeApp() {
            // await AsyncStorage.clear();
            setLoading(true);            
            try {                
                const user = await getUser();                
                if (user) {
                    setUsername(user.name);
                    console.log('User found:', user.name);
                }
            } catch (error) {
                console.error('Error during app initialization:', error);
            } finally {
                setLoading(false);
            }
        };
        
        initializeApp();              

        syncUserData();
        

    }, [loggedUser]);

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
                    if (status === "Logging out"){
                        router.replace('/');                        
                    }                    
                    setConnected(true);
                } else {
                    console.log('Sync failed or returned false, setting connected to false');
                    if (status === "Logging out"){
                        router.replace('/');
                    } 
                    setConnected(false);
                }
            });
        } catch (error) {
            console.error('Error during app initialization:', error);
        } 
    }

    async function logOut() {
        setStatus("Logging out");
        await doLogout();
        syncUserData();  
        setLoggedUser(prev => !prev);      
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
    <AppContext.Provider value={{ connected, setConnected, loggedUser, setLoggedUser }}>
      <Stack screenOptions={headerOptions}>
          <Stack.Screen name="index" options={{ 
              // headerLeft: () => <HamburgerButton onPress={() => {}} style={{marginRight: spacing.md}}/>,
              title: 'Shopping List',
              headerRight: () => (<>
                  {!connected && <Icon name="cloud-off" size={iconSizes.md} color={colors.textSecondary}/>}
                  {username === "DefaultUser" && <LoginButton onPress={() => {router.push('/login')}} disabled={false}/>}
                  {username !== "DefaultUser" && <LogOutButton onPress={logOut} disabled={false}/>}                    
              </>)
          }}/>
          <Stack.Screen name="list" options={{ 
              // headerLeft: () => <HamburgerButton onPress={() => {}} style={{marginRight: spacing.md}}/>,
              title: 'Shopping List',
              headerRight: () => (<>
                  {!connected && <Icon name="cloud-off" size={iconSizes.md} color={colors.textSecondary}/>}
                  {username === "DefaultUser" && <LoginButton onPress={() => {router.push('/login')}} disabled={false}/>}
                  {username !== "DefaultUser" && <LogOutButton onPress={logOut} disabled={false}/>}
              </>)
          }}/>
          <Stack.Screen name="login" options={{ 
              // headerLeft: () => <HamburgerButton onPress={() => {}} style={{marginRight: spacing.md}}/>,
              title: 'Log In',
              headerRight: () => (<>
                  {!connected && <Icon name="cloud-off" size={iconSizes.md} color={colors.textSecondary}/>}                        
              </>)
          }}/>
          <Stack.Screen name="register" options={{ 
              // headerLeft: () => <HamburgerButton onPress={() => {}} style={{marginRight: spacing.md}}/>,
              title: 'Register',
              headerRight: () => (<>
                  {!connected && <Icon name="cloud-off" size={iconSizes.md} color={colors.textSecondary}/>}                        
              </>)
          }}/>               
      </Stack>
    </AppContext.Provider>
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