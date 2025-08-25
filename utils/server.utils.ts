import { apiClient, clearToken, getToken, setToken } from "./apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUser, saveUser, } from './users.utils';
import {getLists, mergeLists, type ShoppingList} from './lists.utils';
import {type User} from './users.utils';



export async function syncUser(): Promise<void> {

    const currentUser = await getUser();

    try {
        const res = await apiClient.get(`/users/${currentUser._id}`);
        if (res.status === 200) {
            const userDataFromServer = res.data;
            const serverLists = userDataFromServer.lists;
            const mergedLists = mergeLists(serverLists,currentUser.lists);
            currentUser.lists = mergedLists;
            await saveUser(currentUser);
        } else {
            console.log('Error syncing data from server:', res);
        }
    } catch (error) {
        console.log('Error syncing data from server:', error);
    }
    try {
        const res = await apiClient.post(`/users`, currentUser);
        if (res.status === 200) {
            console.log('User account synced successfully:', res.data);
        } else {
            console.log('Error syncing user account to server:', res);
        }
    } catch (error) {
        console.log('Error syncing user account to server:', error);
    }
}

// export async function createUser(): Promise<void> {
//     const currentUser = await getUser();
//     try {
//         const res = await apiClient.put(`/users`, currentUser);
//         if (res.status === 200) {
//             console.log('User account created successfully:', res.data);
//         } else {
//             console.error('Error creating user account on server:', res);
//         }
//     } catch (error) {
//         console.error('Error creating user account on server:', error);
//     }
// }
