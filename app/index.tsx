import AddButton from '@/components/AddButton';
import Loader from '@/components/Loader';
import { styles } from '@/styles/styles';
import { initiateListsStorage, ShoppingList } from '@/utils/lists.utils';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {  

    // const [users, setUsers] = useState<User[]>([]);
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        async function fetchData() {                  
            try {
                const data = await initiateListsStorage();
                setLists(data);
            } catch (error) {
                // handle error
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <View style={styles.mainScreenContainer}>
            {loading && <Loader />}
            <ScrollView style={styles.shoppingListsContainer}>
              {lists?.map(list => (
                <TouchableOpacity key={list._id} style={styles.shoppingListsRow}>
                  <Text style={styles.text_md}>{list.name}</Text>
                  <Text style={styles.text_md}>{list.items.length === 0 ? 'Empty' : `${list.items.length} items`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.addButtonContainer}>
              <AddButton />
            </View>
          </View>
        </SafeAreaView>
    );
}
