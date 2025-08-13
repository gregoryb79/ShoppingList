import { apiClient, clearToken, getToken, setToken } from "./apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingList } from "./lists.utils";

export type User = {
  _id: string;
  avatar?: string;
  email?: string;
  name: string;
  password?: string;
};

export type FamilyAccount = {
  _id: string;
  name: string;
  token: string;
  users: User[];
  lists: ShoppingList[];
  createdAt?: string;
  updatedAt?: string;
};

export async function getUser(): Promise<User> {
    
    const user = await AsyncStorage.getItem('currentUser');
    if (user) {
        const parsedUser = JSON.parse(user) as User;
        console.log('Existing user found:', parsedUser);
        return parsedUser;
    }
    console.log('No existing user found, creating a default user.');
    try{
        const res = await apiClient.put('/users/DefaultUser');
        const newUser = res.data.user as User;
        const token = res.data.token;
        setToken(token);
        console.log('Created new user:', newUser);
        await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
        return newUser;
    } catch (error) {
        console.error('Error initializing user:', error);
        throw error;
    }
}

export async function getFamilyAccount(): Promise<FamilyAccount> {

    const familyAccount = await AsyncStorage.getItem('familyAccount');
    if (familyAccount) {
        const parsedAccount = JSON.parse(familyAccount) as FamilyAccount;
        console.log('Existing family account found:', parsedAccount);
        return parsedAccount;
    }
    console.log('No existing familyAccount found, creating a default family account.');
    try{
        const res = await apiClient.put('/users/FA/DefaultAccount');
        const newAccount = res.data.familyAccount as FamilyAccount;               
        console.log('Created new account:', newAccount);
        await saveFamilyAccount(newAccount);
        return newAccount;
    } catch (error) {
        console.error('Error initializing family account:', error);
        throw error;
    }
}
export async function saveFamilyAccount(account: FamilyAccount): Promise<void> {
    try {
        await AsyncStorage.setItem('familyAccount', JSON.stringify(account));
        console.log('Family account saved to storage.');
    } catch (error) {
        console.error('Error saving family account:', error);
    }
}

// export async function fetchUsers(): Promise<User[]> {
//     console.log('Fetching users.');
//     try {
//         const response = await apiClient.get(`/users`);        
//         const result = await response.data;
//         console.log('Fetched users:', result.length);
//         return result;
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         throw error;
//     }
// }


