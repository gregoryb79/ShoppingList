import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, clearToken, getToken, setToken } from "./apiClient";
import { getFamilyAccount, getUser, saveFamilyAccount, saveUser, User, type FamilyAccount } from './users.utils';

export type Item = {
  _id: string; // MongoDB ObjectId as string
  name: string;
  price?: number;  
  createdAt?: string;
  updatedAt?: string;
};

export type ShoppingListItem = {
  _id: string; // MongoDB ObjectId as string
  name: string;
  quantity: number;
  bought: boolean;
};

export type ShoppingList = {
  _id: string;
  name: string;
  items: ShoppingListItem[];
  createdAt?: string;
  updatedAt?: string;
};

export async function getLists(): Promise<ShoppingList[]> {
    // await new Promise(resolve => setTimeout(resolve, 3000));//to test loader
    // await AsyncStorage.clear();

    const currentUser = await getUser();

    // const storedLists = await AsyncStorage.getItem("shoppingLists");
    const familyAccount = await getFamilyAccount();
    const storedLists = familyAccount.lists;
    if (currentUser.privateLists && currentUser.privateLists.length > 0) {
        storedLists.push(...currentUser.privateLists);
    }
    if (!storedLists || storedLists.length === 0) {
        console.log("No shopping lists found in storage, fetching from API.");
        try {
            const res = await apiClient.post('/lists/',{
                name: "Grocery List",
                items: [],
            });
            const newList = res.data as ShoppingList;
            console.log("Fetched default list from API:", newList);
            familyAccount.lists.push(newList);
            await saveFamilyAccount(familyAccount);            
            console.log("No shopping lists found, initializing with default list.", familyAccount.lists);
            return familyAccount.lists;            
        }catch (error) {
            console.error('Error fetching default list:', error);
            return [];
        }      
    }
    console.log("Shopping lists found in storage, returning existing lists.", storedLists);
    return storedLists;    
}

export async function saveLists(lists: ShoppingList[]): Promise<void> {
    try {
        await AsyncStorage.setItem("shoppingLists", JSON.stringify(lists));
        console.log("Shopping lists saved to storage.");
    } catch (error) {
        console.error("Error saving shopping lists:", error);
    }
}

export async function createShoppingList(listName: string, isPrivate: boolean): Promise<void> {
    try {
        const res = await apiClient.post('/lists/', {
            name: listName, 
            items: [],                       
        });
        const newList = res.data as ShoppingList;
        console.log("Created new shopping list:", newList);
        if (isPrivate) {
            const currentUser = await getUser();
            if (currentUser) {
                if (!currentUser.privateLists) {
                    currentUser.privateLists = [];
                }
                currentUser.privateLists.push(newList);
                await saveUser(currentUser);
            }
        } else {
            const familyAccount = await getFamilyAccount();
            familyAccount.lists.push(newList);
            await saveFamilyAccount(familyAccount);
        }
    } catch (error) {
        console.error("Error creating shopping list:", error);
    }   
    
}


