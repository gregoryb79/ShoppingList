import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Modal } from 'react-native';
import { Link, router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchUsers } from '@/utils/users.utils';
import { type User } from '../utils/users.utils';


export default function HomeScreen() {  

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        async function fetchData() {                  
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (error) {
                // handle error
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <SafeAreaView edges={['bottom']}>   
            <View>
                {users?.map(user => (
                    <View key={user._id}>
                        <Text>{user.name}</Text>
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
}
