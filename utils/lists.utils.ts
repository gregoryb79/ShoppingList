import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, clearToken, getToken, setToken } from "./apiClient";
import { getFamilyAccount, getUser, saveFamilyAccount, type FamilyAccount } from './users.utils';

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
    if (!storedLists || storedLists.length === 0) {
        console.log("No shopping lists found in storage, fetching from API.");
        try {
            const res = await apiClient.put('/lists/',{
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

// export async function createList(listName: string): Promise<boolean> {
//     const newList: ShoppingList = {
//         _id: new Date().toISOString(),
//         name: listName,
//         items: [],
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//     };

//     const currentLists = await getLists();
//     currentLists.push(newList);
//     await saveLists(currentLists);
// }
