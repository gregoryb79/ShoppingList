import Loader from '@/components/Loader';
import { MainButton } from '@/components/MainButton';
import { styles } from '@/styles/styles';
import { spacing } from '@/styles/tokens';
import { doLogin } from '@/utils/users.utils';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from './_layout';

export default function LoginScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { connected, setConnected, loggedUser, setLoggedUser } = useAppContext();
    

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            alert('Please fill in all fields.');
            return;
        }
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValidEmail) {
            alert('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            await doLogin(email, password);
            console.log('Login successful, navigating to main screen...');
            router.replace('/');
            setLoggedUser(prev => !prev);
        } catch (error) {
            console.log('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
            <View style={styles.mainScreenContainer}>
                {loading && <Loader />}
                <Text style={[styles.h2, styles.text_center]}>
                    Shopping List App
                    </Text>
                <Text style={[styles.text_md, styles.text_center]}>
                    Login to keep your data backed up
                </Text>
                <View style={styles.loginContainer}>
                    <TextInput style={styles.loginInput} 
                        placeholder="mail@yourmail.com"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput style={styles.loginInput} 
                        placeholder="Password" 
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <MainButton label="Login" onPress={handleLogin} />
                </View>
                <Text style={[styles.text_lg, styles.text_center, { marginBottom: spacing.lg }]}>
                    Don't have an account? <Link href="/register" style={styles.link}>Register.</Link>
                </Text>
            </View>
        </SafeAreaView>
    );
}
