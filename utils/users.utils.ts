import { apiClient, clearToken, getToken, setToken } from "./apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mergeLists, ShoppingList } from "./lists.utils";

export type User = {
  _id: string;
  avatar?: string;
  email?: string;
  name: string;
  password?: string;
  lists: ShoppingList[];
};

// export type FamilyAccount = {
//   _id: string;
//   name: string;
//   token: string;
//   users: string[];
//   lists: ShoppingList[];
//   createdAt?: string;
//   updatedAt?: string;
// };

export async function getUser(): Promise<User> {
    
    const user = await AsyncStorage.getItem('currentUser');
    if (user) {
        const parsedUser = JSON.parse(user) as User;
        console.log('Existing user found:', parsedUser.name);
        return parsedUser;
    }
    console.log('No existing user found, creating a default user.');
    try{
        const res = await apiClient.post('/users/DefaultUser');
        const newUser = res.data.user as User;
        const token = res.data.token;
        setToken(token);
        console.log('Created new user:', newUser.name);
        await saveUser(newUser);        
        return newUser;
    } catch (error) {
        console.error('Error initializing user:', error);
        throw error;
    }
}

export async function saveUser(currentUser: User): Promise<void> {
    try {
        await AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('User saved to storage.');                
    } catch (error) {
        console.error('Error saving user:', error);
    }
}

export async function syncUser(): Promise<boolean> {

    const currentUser = await getUser();
    
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
            console.error('Error syncing data from server:', res);
            return false;
        }
    } catch (error: any) {
        if (error.response) {
            console.error('Error syncing data from server:', error.response.data);
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
            console.error('Error syncing user account to server:', res);
            return false;
        }
    } catch (error: any) {
        if (error.response) {
            console.error('Error syncing data from server:', error.response.data);
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

    return false;    
}



