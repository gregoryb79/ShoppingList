import AsyncStorage from '@react-native-async-storage/async-storage';

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

export async function initiateListsStorage(): Promise<ShoppingList[]> {
    // await new Promise(resolve => setTimeout(resolve, 3000));//to test loader

    const storedLists = await AsyncStorage.getItem("shoppingLists");
    if (!storedLists || storedLists === "[]") {
        await AsyncStorage.setItem("shoppingLists", JSON.stringify(listOfShoppingLists));
        console.log("No shopping lists found, initializing with default list.", listOfShoppingLists);
        return listOfShoppingLists;
    }
    console.log("Shopping lists found in storage, returning existing lists.", JSON.parse(storedLists));
    return JSON.parse(storedLists);
}

const shoppingList: ShoppingList = {
  _id: "1",
  name: "Grocery List",
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const listOfShoppingLists: ShoppingList[] = [shoppingList];


