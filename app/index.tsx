import AddButton from '@/components/AddButton';
import DeleteButton from '@/components/DeleteButton';
import EditButton from '@/components/EditButton';
import Loader from '@/components/Loader';
import ShoppingListModal from '@/components/ShoppingListModal';
import { styles } from '@/styles/styles';
import { colors } from '@/styles/tokens';
import { isTokenExpired, verifyToken } from '@/utils/apiClient';
import { addSharedList, deleteLists, getLists, ShoppingList } from '@/utils/lists.utils';
import { syncUser } from '@/utils/users.utils';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConnected } from './_layout';


export default function HomeScreen() {
    
    console.log('Rendering HomeScreen');

    const params = useLocalSearchParams();
    const sharedListId = params.share as string;

    // const [users, setUsers] = useState<User[]>([]);
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const [loading, setLoading] = useState(true);
    const [listModalVisible, setListModalVisible] = useState(false);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

     useEffect(() => {  
        async function sharedList() {
            await addSharedList(sharedListId);
        }
        if (sharedListId) {
            console.log('Shared list ID found:', sharedListId);
            sharedList();
        }
        fetchData();
        syncIndex();
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

    async function fetchData() {                  
        try {
            await verifyToken();
            const data = await getLists();
            setLists(data);
        } catch (error) {
            console.error('Error initializing data:', error);
        } finally {
            setLoading(false);
        }
    };

    async function deleteSelectedRows() { 
        console.log('Deleting selected rows:', selectedRows);             
        await deleteLists(selectedRows); 
        setSelectedRows([]);  
        await fetchData();         
    }

    const { setConnected } = useConnected();
    function syncIndex() {
        setConnected(false);
        syncUser().then((result) => {
            if (result === true) {
                console.log('User data synced successfully, setting connected to true');
                setConnected(true);
            } else {
                console.log('Sync failed or returned false, setting connected to false');
                setConnected(false);
            }
        });
    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <View style={styles.mainScreenContainer}>
            {loading && <Loader />}
            <ScrollView style={styles.shoppingListsContainer}>
              { !lists || lists.filter(list => !list.isDeleted).length === 0 ? (
                <Text style={styles.h3}>Ooops something went wrong, no shopping list found...</Text>
              ) : (
                lists?.map(list => (!list.isDeleted &&                     
                      <TouchableOpacity key={list._id} 
                        style={[styles.shoppingListsRow, { backgroundColor: selectedRows.includes(list._id) ? colors.primaryLight : 'transparent' }]} 
                        onPress={() => router.push(`/list?id=${list._id}` as any)} 
                        onLongPress={() => handleRowSelect(list._id)}>
                          <Text style={styles.text_md}>{list.name}</Text>
                          <Text style={styles.text_md}>{list.items.filter(item => !item.isDeleted).length === 0 ? 'Empty' : `${list.items.filter(item => !item.isDeleted).length} items`}</Text>
                      </TouchableOpacity>
                    
              )))}
            </ScrollView>
            <ShoppingListModal visible={listModalVisible} onClose={() => setListModalVisible(false)} onConfirm={(name) => {}} />
            <View style={styles.addButtonContainer}>
                {/* <EditButton onPress={() => {}} disabled={selectedRows.length !== 1} /> */}
                <EditButton onPress={() => {}} disabled={true} />
                <AddButton onPress={() => setListModalVisible(true)} />
                <DeleteButton onPress={deleteSelectedRows} disabled={selectedRows.length === 0}/>
            </View>  
          </View>
        </SafeAreaView>
    );
}
