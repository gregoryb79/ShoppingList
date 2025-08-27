import AddButton from '@/components/AddButton';
import Loader from '@/components/Loader';
import { styles } from '@/styles/styles';
import { addToList, deleteFromList, getList, type ShoppingList, syncList, updateList } from '@/utils/lists.utils';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Share, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CheckBox from '@/components/CheckBox';
import DeleteButton from '@/components/DeleteButton';
import EditButton from '@/components/EditButton';
import ShareButton from '@/components/ShareButton';
import { colors } from '@/styles/tokens';
import { useConnected } from './_layout';
import { MainButton } from '@/components/MainButton';
import { SecondaryButton } from '@/components/SecondaryButton';

export default function ShoppingListScreen() { 
    const params = useLocalSearchParams();
    const listId = params.id as string;    

    console.log('ShoppingList id:', listId);
    const [loading,setLoading] = useState(true);
    const [list, setList] = useState<ShoppingList | null>(null);
    const [textInput, setTextInput] = useState("");
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    useEffect(() => {       
        fetchData();
    }, []);

    const { setConnected } = useConnected();
    async function handleAddItem() {
        if (!textInput.trim() || !list) return;
        console.log('Adding new item:', textInput);     
        await addToList(listId, textInput);
        fetchData();
        console.log('Item added, syncing list...'); 
        syncShoppingList();
        setTextInput("");
    }

    async function fetchData() {
            try {                
                const data = await getList(listId);
                if (!data) {
                    console.error('No shopping list found with id:', listId);
                    return;
                }
                const sortedItems = data.items.slice().sort((a, b) => {
                    if (a.bought === b.bought) return 0;
                    return a.bought ? 1 : -1;
                });
                setList({ ...data, items: sortedItems });
            } catch (error) {
                console.error('Error fetching shopping list:', error);
            } finally {
                setLoading(false);
            }
    }

    async function handleToggleBought(itemId: string) {
        if (!list) return;
        const updatedItems = list.items.map(row =>
            row.item._id === itemId
            ? { ...row, bought: !row.bought }
            : row
        );
        const updatedList = { ...list, items: updatedItems };
        await updateList(updatedList);
        setList(updatedList);

        syncShoppingList();
        fetchData();
    }

    function syncShoppingList() {
        setConnected(false);
        syncList(listId).then((result) => {
            if (result) {
                console.log('List synced successfully');
                setConnected(true);
            } else {
                console.log('List sync failed');
            }
        });
    }

    function handleRowSelect(itemId: string) {
        setSelectedRows(prevSelectedRows => {
            if (prevSelectedRows.includes(itemId)) {
                return prevSelectedRows.filter(id => id !== itemId);
            } else {
                return [...prevSelectedRows, itemId];
            }
        });
        console.log('Selected rows:', selectedRows);
    }

    async function deleteSelectedRows() {
        console.log('Deleting selected rows:', selectedRows);
        if (!list) return;
        await deleteFromList(list._id, selectedRows);
        setSelectedRows([]);
        fetchData();        
    }

    async function handleShare() {
        if (!list) return;
        const sharingLink = `shoppinglist://?share=${list._id}`;
        console.log('Sharing link:', sharingLink);
        await Share.share({ message: sharingLink });
    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <View style={styles.mainScreenContainer}>
            {loading && <Loader />}
            <Text style={styles.h3}>Shopping List: {list ? list.name : 'Loading...'}</Text>
            <View style={styles.quickEntryContainer}>
                {/* <Text style={styles.h4}>Quick Entry:</Text> */}
                <TextInput style={styles.quickInput} placeholder={"enter item..."}
                    value={textInput}
                    onChangeText={setTextInput}
                    onSubmitEditing={handleAddItem}
                />        
                <SecondaryButton label={"Add"}  onPress={handleAddItem} />        
            </View>
            <ScrollView style={styles.shoppingListsContainer}>
              { !list ? (
                <Text style={styles.h4}>Ooops something went wrong, no shopping list found...</Text>
              ) : (
                list.items.map(row => (!row.isDeleted &&
                      <TouchableOpacity key={row.item._id} 
                        style={[styles.shoppingListsRow, { backgroundColor: selectedRows.includes(row.item._id) ? colors.primaryLight : 'transparent' }]} 
                        onLongPress={() => {handleRowSelect(row.item._id)}}>
                        <View>
                          <Text style={styles.text_md}>{row.item.name}</Text>
                          {row.quantity > 1 && <Text style={styles.text_sm}>{row.quantity} pcs</Text>}
                        </View>
                          <CheckBox checked={row.bought} size={24} checkedColor={colors.primary} onChange={() => {handleToggleBought(row.item._id)}} />
                      </TouchableOpacity>

              )))}
            </ScrollView>
            <View style={styles.addButtonContainer}>
                {/* <EditButton onPress={() => {}} disabled={selectedRows.length !== 1} /> */}
                <EditButton onPress={() => {}} disabled={true} />
                {/* <AddButton onPress={() => {}} /> */}
                <ShareButton onPress={handleShare} />
                <DeleteButton onPress={deleteSelectedRows} disabled={selectedRows.length === 0}/>
                
            </View>           
          </View>
          
        </SafeAreaView>
    );
}
