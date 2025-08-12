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

export async function initiateListsStorage() {
    const storedLists = await AsyncStorage.getItem("shoppingLists");
    if (!storedLists) {
        await AsyncStorage.setItem("shoppingLists", JSON.stringify([]));
    }
}

const shoppingList: ShoppingList = {
  _id: "1",
  name: "Grocery List",
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const listOfShoppingLists: ShoppingList[] = [shoppingList];


