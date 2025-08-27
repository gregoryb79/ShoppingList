import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, clearToken, getToken, setToken } from "./apiClient";
import { getUser, saveUser, User, } from './users.utils';
import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export type Item = {
  _id: string;
  name: string;
  price?: number;
};

export type ShoppingListRow = {
  item: Item;
  quantity: number;
  bought: boolean;
  isDeleted?: boolean;  
//   createdAt?: string;
//   updatedAt?: string;
};

export type ShoppingList = {
  _id: string;  
  name: string;
  items: ShoppingListRow[];
  shared: boolean;
  isDeleted?: boolean;
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

export async function deleteLists(listIds: string[]): Promise<void> {
    const currentUser = await getUser();
    currentUser.lists = currentUser.lists.map(list => {
        if (listIds.includes(list._id)) {
            list.isDeleted = true;
        }
        return list;
    });
    await saveUser(currentUser);
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

export async function addSharedList(sharedListId: string): Promise<void> {
    console.log('Adding shared list with id:', sharedListId);
    const currentUser = await getUser();
    const list = currentUser.lists.find(list => list._id === sharedListId);
    if (list) {
        console.log('Shared list already exists:', list._id);
        return;
    }
    
    try{
        const res = await apiClient.get(`/lists/${sharedListId}`);
        const serverList = res.data as ShoppingList;
        if (!serverList) {
            console.error('No shopping list found with id:', sharedListId);
            alert("Ooops, the shared list was not found at the server.");
            return;
        }
        currentUser.lists.push(serverList);
        console.log('Added shared list:', serverList._id);
        console.log('Current user has ', currentUser.lists.length,' lists.');
    }catch (error) {
        console.log('Error fetching shared list:', error);
        alert("Ooops, something went wrong while fetching the shared list.");
        return;
    }
    await saveUser(currentUser);            
}

export async function addToList(listId: string, itemName: string): Promise<void> {
    const currentUser = await getUser();
    const list = currentUser.lists.find(list => list._id === listId);
    if (!list) {
        console.error('List not found:', listId);
        return;
    }

    const newItem: Item = {
        _id: 'I-' + uuid.v4(),
        name: itemName,
    };
    const newRow: ShoppingListRow = {
        item: newItem,
        quantity: 1,
        bought: false,
        isDeleted: false,
    };
    console.log('Adding new item to list:', newRow);

    list.items.push(newRow);
    await saveUser(currentUser);    
}

export async function updateList(updatedList: ShoppingList): Promise<void> {
    const currentUser = await getUser();
    const listIndex = currentUser.lists.findIndex(list => list._id === updatedList._id);
    if (listIndex !== -1) {
        currentUser.lists[listIndex] = updatedList;
        console.log('Updated lists:', currentUser.lists);
        await saveUser(currentUser);
    }
}

export async function deleteFromList(listId: string, itemIds: string[]): Promise<void> {
    const currentUser = await getUser();
    const list = currentUser.lists.find(list => list._id === listId);
    if (!list) {
        console.error('List not found:', listId);
        return;
    }
    list.items = list.items.map(row => {
        if (itemIds.includes(row.item._id)) {
            row.isDeleted = true;
        }
        return row;
    });
    await saveUser(currentUser);
}

export async function getList(id: string): Promise<ShoppingList | null> {
    const currentUser = await getUser();
    const list = currentUser.lists.find(list => list._id === id);
    return list || null;
}

export async function syncList(id: string): Promise<boolean> {
    console.log('Syncing list with id:', id);
    const currentUser = await getUser();
    const localList = currentUser.lists.find(list => list._id === id);
    if (!localList) {
        console.error('Local list not found for sync:', id);
        return false;
    }
    
    try{
        console.log('Fetching server list for sync:', id);
        const response = await apiClient.get(`/lists/${id}`);
        const serverList = response.data as ShoppingList;
        console.log('Server list fetched:', serverList.items.length);
        if (!serverList) {
            console.error('Server list not found for sync:', id);
            return false;
        }
        localList.items = mergeListEntries(serverList.items, localList.items);
        console.log('Server list with merged with local list:', id);
        currentUser.lists = currentUser.lists.filter(list => list._id !== id);
        currentUser.lists.push(localList);
        await saveUser(currentUser);
    }catch (error) {
        console.log('Error fetching server list:', error);
        return false;
    }
    
    try{
        console.log('Updating server list:', id,localList);
        const res = await apiClient.put(`/lists/${id}`, localList);
        if (res.status !== 200) {
            console.error('Error updating server list:', id);
            return false;
        }
    }catch (error) {
        console.log('Error updating server list:', error);
        return false;
    }

    return true;
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

export function mergeListEntries(serverListEntries: ShoppingListRow[], localListEntries: ShoppingListRow[]): ShoppingListRow[] {
    const merged = [...localListEntries];
    
    serverListEntries.forEach(serverListEntry => {
        const localEntry = merged.find(entry => entry.item._id === serverListEntry.item._id);
        if (localEntry) {
            localEntry.quantity = Math.max(serverListEntry.quantity, localEntry.quantity);
            localEntry.bought = serverListEntry.bought || localEntry.bought;
            localEntry.isDeleted = serverListEntry.isDeleted || localEntry.isDeleted;
        } else {
            merged.push(serverListEntry);
        }
    });

    return merged;
}

export async function shareList(listId: string): Promise<void> {
     const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Open Shopping List App</title>
    </head>
    <body>
      <h1>Open Shopping List App</h1>
      <p>
        <a href="shoppinglist://?share=${listId}">
          <h1>Click here to open the shared shopping list in the app</h1>
        </a>
      </p>
      <p>
        If you have the app installed, tapping the link above will open it directly to the shared list.
      </p>
    </body>
    </html>
  `;

  const fileUri = FileSystem.cacheDirectory + `shoppinglist-share-${listId}.html`;
  await FileSystem.writeAsStringAsync(fileUri, htmlContent, { encoding: FileSystem.EncodingType.UTF8 });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, { mimeType: 'text/html' });
  } else {
    alert('Sharing is not available on this device');
  }
}