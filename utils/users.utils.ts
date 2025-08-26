import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { apiClient, clearToken, isTokenExpired, setToken } from "./apiClient";
import { mergeLists, ShoppingList } from "./lists.utils";
import uuid from 'react-native-uuid';

export type User = {
  _id: string;
  avatar?: string;
  email?: string;
  name: string;
  password?: string;
  lists: ShoppingList[];
};

export async function getUser(): Promise<User> {
    
    const user = await AsyncStorage.getItem('currentUser');
    if (user) {
        const parsedUser = JSON.parse(user) as User;
        console.log('Existing user found:', parsedUser.name);        
        return parsedUser;
    }
    console.log('No existing user found, creating a default user.');
    const newUser: User = {
        _id: 'U-' + uuid.v4(),
        name: 'DefaultUser',
        email: 'default@example.com',
        password: 'password',
        lists: [],
    };
    console.log('Created new user:', newUser.name);
    await saveUser(newUser);
    // try {
    //     const res = await apiClient.post('/users', newUser);
    //     const token = res.data.token;
    //     setToken(token);
    // } catch (error) {
    //     console.log('Error creating user:', error);
    //     alert('Oops, something went wrong. Please try again.');
    // }

    return newUser;
}

export async function saveUser(currentUser: User): Promise<void> {
    try {
        await AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('User saved to storage.');                
    } catch (error) {
        console.log('Error saving user:', error);
    }
}

export async function syncUser(): Promise<boolean> {

    const currentUser = await getUser();
    if (currentUser.name == 'DefaultUser' && await isTokenExpired()) {        
        console.log("Default User with no valid token - creating new default user");
        const newUser = currentUser;
        try {
            const res = await apiClient.post('/users', newUser);
            console.log('Created new user on server:', res.status);
            const token = res.data.token;
            setToken(token);
            return true;
        } catch (error) {
            console.log('Error creating user:', error);
            return false;
            // alert('Oops, something went wrong. Please try again.');
        }
    }

    try {
        const res = await apiClient.get(`/users/${currentUser._id}`);
        if (res.status === 200) {
            const userDataFromServer = res.data;
            const serverLists = userDataFromServer.lists;
            const mergedLists = mergeLists(serverLists,currentUser.lists);
            currentUser.lists = mergedLists;
            await saveUser(currentUser);
            console.log('User data synced successfully:', currentUser.name);            
        } else {
            console.log('Error syncing data from server:', res);
            return false;
        }
    } catch (error: any) {
        if (error.response) {
            console.log('Error syncing data from server:', error.response.data);
            return false;
        } else if (error.request) {
            console.log('Network error or timeout:', error.message);
            return false;
        } else {
            // Something else happened
            console.log('Other error:', error.message);  
            return false;           
        }
    }
    try {

        // console.log('Syncing user account to server:', currentUser, currentUser.lists);
        const res = await apiClient.put(`/users`, currentUser);
        if (res.status === 200) {
            console.log('User account synced successfully');
            return true;
        } else {
            console.log('Error syncing user account to server:', res);
            return false;
        }
    } catch (error: any) {
        if (error.response) {
            console.log('Error syncing data from server:', error.response.data);
            return false; 
        } else if (error.request) {
            console.log('Network error or timeout:', error.message);
            return false;
        } else {
            // Something else happened
            console.log('Other error:', error.message);
            return false;
        }
    }

}

export async function doRegister(username: string, email: string, password: string): Promise<void> {
    const currentUser = await getUser();
    try {
        const res = await apiClient.post('/users/register', { username, email, password, currentUserId: currentUser._id });
        const registeredUser = res.data.user as User;
        const token = res.data.token;
        setToken(token);
        await saveUser(registeredUser);
        console.log('User registered successfully:', registeredUser.name);
    } catch (error) {
        console.log('Error registering user:', error);
        alert('Oops, something went wrong. Please try again.');
    }
}

export async function doLogin(email: string, password: string): Promise<void> {
    try {
        const res = await apiClient.post('/users/login', { email, password });
        const loggedInUser = res.data.user as User;
        const token = res.data.token;
        setToken(token);
        await saveUser(loggedInUser);
        console.log('User logged in successfully:', loggedInUser.name);
    } catch (error) {
        console.log('Error logging in user:', error);
        alert('Oops, something went wrong. Please try again.');
    }
}

export async function doLogout(): Promise<void> {
    clearToken();
    try {
        await AsyncStorage.removeItem('currentUser');
        console.log('User logged out successfully');
        router.replace('/');
    } catch (error) {        
        console.log('Error logging out user:', error);        
    }
}
