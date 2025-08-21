import AddButton from '@/components/AddButton';
import DeleteButton from '@/components/DeleteButton';
import EditButton from '@/components/EditButton';
import Loader from '@/components/Loader';
import ShoppingListModal from '@/components/ShoppingListModal';
import { styles } from '@/styles/styles';
import { colors } from '@/styles/tokens';
import { deleteLists, getLists, ShoppingList } from '@/utils/lists.utils';
import { syncUser } from '@/utils/users.utils';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {  

    // const [users, setUsers] = useState<User[]>([]);
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const [loading, setLoading] = useState(true);
    const [listModalVisible, setListModalVisible] = useState(false);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

     useEffect(() => {
        async function fetchData() {                  
            try {
                const data = await getLists();
                setLists(data);
            } catch (error) {
               console.error('Error initializing data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [listModalVisible]);

    function handleRowSelect(rowId: string) {
        setSelectedRows(prevSelectedRows => {
            if (prevSelectedRows.includes(rowId)) {
                return prevSelectedRows.filter(id => id !== rowId);
            } else {
                return [...prevSelectedRows, rowId];
            }
        });
    }

    async function deleteSelectedRows() {
        if (selectedRows.length === 0) return;
        const updatedLists = lists.filter(list => !selectedRows.includes(list._id));
        setLists(updatedLists);
        setSelectedRows([]);        
        await deleteLists(selectedRows); 
        await syncUser();           
    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <View style={styles.mainScreenContainer}>
            {loading && <Loader />}
            <ScrollView style={styles.shoppingListsContainer}>
              { !lists || lists.length === 0 ? (
                <Text style={styles.h3}>Ooops something went wrong, no shopping list found...</Text>
              ) : (
                lists?.map(list => (                    
                      <TouchableOpacity key={list._id} 
                        style={[styles.shoppingListsRow, { backgroundColor: selectedRows.includes(list._id) ? colors.primaryLight : 'transparent' }]} 
                        onPress={() => router.push(`/list?id=${list._id}` as any)} 
                        onLongPress={() => handleRowSelect(list._id)}>
                          <Text style={styles.text_md}>{list.name}</Text>
                          <Text style={styles.text_md}>{list.items.length === 0 ? 'Empty' : `${list.items.length} items`}</Text>
                      </TouchableOpacity>
                    
              )))}
            </ScrollView>
            <ShoppingListModal visible={listModalVisible} onClose={() => setListModalVisible(false)} onConfirm={(name) => {}} />
            <View style={styles.addButtonContainer}>
                <EditButton onPress={() => {}} disabled={selectedRows.length !== 1} />
                <AddButton onPress={() => setListModalVisible(true)} />
                <DeleteButton onPress={deleteSelectedRows} disabled={selectedRows.length === 0}/>
            </View>  
          </View>
        </SafeAreaView>
    );
}
