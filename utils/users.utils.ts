import { apiClient, clearToken, getToken, setToken } from "./apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  _id: string;
  avatar?: string;
  email?: string;
  name: string;
  password?: string;
};

export async function initUser(): Promise<User> {
    const user = await AsyncStorage.getItem('currentUser');
    if (user) {
        const parsedUser = JSON.parse(user) as User;
        console.log('Existing user found:', parsedUser);
        return parsedUser;
    }
    console.log('No existing user found, creating a default user.');
    try{
        const res = await apiClient.put('/users/DefaultUser');
        const newUser = res.data as User;
        console.log('Created new user:', newUser);
        return newUser;
    } catch (error) {
        console.error('Error initializing user:', error);
        throw error;
    }
}


export async function fetchUsers(): Promise<User[]> {
    console.log('Fetching users.');
    try {
        const response = await apiClient.get(`/users`);        
        const result = await response.data;
        console.log('Fetched users:', result);
        return result;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}


