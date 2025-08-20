import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, clearToken, getToken, setToken } from "./apiClient";
import { getUser, saveUser, User, } from './users.utils';
import uuid from 'react-native-uuid';

export type Item = {
  _id: string;
  name: string;
  price?: number;  
};

export type ShoppingListItem = {
  item: Item;
  quantity: number;
  bought: boolean;
};

export type ShoppingList = {
  _id: string;  
  name: string;
  items: ShoppingListItem[];
  shared: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function getLists(): Promise<ShoppingList[]> {

    // await AsyncStorage.clear();
    
    const currentUser = await getUser();
   
    const storedLists = currentUser.lists;    
    if (!storedLists || storedLists.length === 0) {
        console.log("No shopping lists found in storage, creating default list.");
      
        const newList: ShoppingList = {
            _id: 'L-' + uuid.v4(),
            name: "Grocery List",
            shared: false,
            items: [],
        };
        console.log("Default list created:", newList);
        currentUser.lists.push(newList);
        await saveUser(currentUser);
        return currentUser.lists;

    }
    console.log("Shopping lists found in storage, returning existing lists.", storedLists.length);
    return storedLists;    
}

export async function createShoppingList(listName: string): Promise<void> {
    const newList: ShoppingList = {
        _id: 'L-' + uuid.v4(),
        name: listName,
        items: [],
        shared: false,
    };
    console.log("Created new shopping list:", newList);
    const currentUser = await getUser();
    currentUser.lists.push(newList);   
    await saveUser(currentUser);   
           
}

export function mergeLists(serverLists: ShoppingList[], localLists: ShoppingList[]): ShoppingList[] {
    const merged = [...localLists];

    serverLists.forEach(serverList => {
        const localList = merged.find(list => list._id === serverList._id);
        if (localList) {
            // Merge items if the list exists locally
            localList.items = mergeListEntries(serverList.items, localList.items);
        } else {
            // If the list doesn't exist locally, add it
            merged.push(serverList);
        }
    });

    return merged;
}

export function mergeListEntries(serverListEntries: ShoppingListItem[], localListEntries: ShoppingListItem[]): ShoppingListItem[] {
    const merged = [...localListEntries];
    
    serverListEntries.forEach(serverListEntry => {
        const localEntry = merged.find(entry => entry.item._id === serverListEntry.item._id);
        if (localEntry) {
            localEntry.quantity = Math.max(serverListEntry.quantity, localEntry.quantity);
            localEntry.bought = serverListEntry.bought || localEntry.bought;
        } else {
            merged.push(serverListEntry);
        }
    });

    return merged;
}