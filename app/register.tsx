import Loader from '@/components/Loader';
import { MainButton } from '@/components/MainButton';
import { styles } from '@/styles/styles';
import { addToList, deleteFromList, getList, type ShoppingList, syncList, updateList } from '@/utils/lists.utils';
import { doRegister } from '@/utils/users.utils';
import { Link, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Share, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        if (!email.trim() || !username.trim() || !password.trim()) {
            alert('Please fill in all fields.');
            return;
        }
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValidEmail) {
            alert('Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        try {
            await doRegister(username, email, password);
            console.log('Registration successful, navigating to main screen...');
            router.replace('/');
        } catch (error) {
            console.log('Registration failed:', error);
        } finally {
            setLoading(false);
        }

    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
            <View style={styles.mainScreenContainer}>
                {loading && <Loader />}
                <Text style={[styles.h2, styles.text_center]}>
                    Shopping List App
                    </Text>
                <Text style={[styles.text_md, styles.text_center]}>
                    Create an account to keep your data backed up.
                </Text>
                <View style={styles.loginContainer}>
                    <TextInput style={styles.loginInput} 
                        placeholder="Select your Username"
                        onChangeText={setUsername} />
                    <TextInput style={styles.loginInput} 
                        placeholder="mail@yourmail.com" 
                        onChangeText={setEmail} />
                    <TextInput style={styles.loginInput} 
                        placeholder="Password (at least 6 characters)" 
                        secureTextEntry 
                        onChangeText={setPassword} />
                    <MainButton label="Register" onPress={handleRegister} />
                </View>                 
            </View>
        </SafeAreaView>
    );
}
