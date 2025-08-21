import AddButton from '@/components/AddButton';
import Loader from '@/components/Loader';
import ShoppingListModal from '@/components/ShoppingListModal';
import { styles } from '@/styles/styles';
import { getList, getLists, ShoppingList } from '@/utils/lists.utils';
import { router, useLocalSearchParams } from 'expo-router';
import { sortRoutesWithInitial } from 'expo-router/build/sortRoutes';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShoppingListScreen() { 
    const params = useLocalSearchParams();
    const listId = params.id as string;
    console.log('ShoppingList id:', listId);
    const [loading,setLoading] = useState(true);
    const [list, setList] = useState<ShoppingList | null>(null);
    const [textInput, setTextInput] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getList(listId);
                if (data) setList(data);
            } catch (error) {
                console.error('Error fetching shopping list:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    function handleAddItem() {
        if (!textInput.trim()) return;

        console.log('Adding new item:', textInput);

        setTextInput("");
    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <View style={styles.mainScreenContainer}>
            {loading && <Loader />}
            <Text style={styles.h3}>Shopping List: {list ? list.name : 'Loading...'}</Text>
            <View >
                <TextInput style={styles.quickInput} placeholder={"enter item..."}
                    value={textInput}
                    onChangeText={setTextInput}
                    onSubmitEditing={handleAddItem}
                />                
            </View>
            <ScrollView style={styles.shoppingListsContainer}>
              { !list ? (
                <Text style={styles.h4}>Ooops something went wrong, no shopping list found...</Text>
              ) : (
                list.items.map(row => (
                      <TouchableOpacity key={row.item._id} style={styles.shoppingListsRow} onPress={() => router.push(`/lists?id=${row.item._id}` as any)}>
                          <Text style={styles.text_md}>{row.item.name}</Text>                          
                      </TouchableOpacity>

              )))}
            </ScrollView>
            <View style={styles.addButtonContainer}>
                        <AddButton onPress={() => {}} />
            </View>           
          </View>
          
        </SafeAreaView>
    );
}
