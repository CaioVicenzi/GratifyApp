import { FlatList, StyleSheet, Text, TouchableOpacity, View, Button, TextInput, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function App() {
    const navigation = useNavigation();
    const [gratitutes, setGratitudes] = useState([])
    const [search, setSearch] = useState("")

    useFocusEffect(() => {
        retriveGratitudes();
    });

    const retriveGratitudes = async () => {

        try {
            const listaString = await AsyncStorage.getItem('@gratitudes');
            const listaJSON =  JSON.parse(listaString)
            setGratitudes(listaJSON)
          } catch (error) {
            console.log("Erro ao recuperar a lista:", error);
            return [];
          }
      }


      const clearGratitudeList = async () => {
        try {
          const key = '@gratitudes'; // Chave usada para armazenar a lista
          await AsyncStorage.removeItem(key);
          console.log('Lista de gratidões foi limpa com sucesso!');
        } catch (error) {
          console.error('Erro ao limpar a lista de gratidões:', error);
        }
      };

      const randomButtonPressed = () => {
        if (gratitutes.length == 0) {
          Alert.alert("Ainda não temos gratidão para sortear...", "Adicione a sua primeira gratidão ☺️")
          return
        } 

        const randomIndex = Math.floor(Math.random() * gratitutes.length);
        const randomGratitude = gratitutes[randomIndex]

        Alert.alert(
          randomGratitude.title,
          randomGratitude.description,
          [
          {text: "Detalhar", onPress: () => navigation.navigate("Detalhamento", {
            id: randomGratitude.id,
            title: randomGratitude.title,
            description: randomGratitude.description
          }), style: 'normal'},
          {text: "Cancelar", style: "cancel"}
          ]
        )
      }


  return (

    <SafeAreaView style={homeStyles.container}>
        <View style={homeStyles.container}>
            <Text style={homeStyles.title}>Gratify</Text>

            <View style= {homeStyles.search}>
            <Entypo 
              style={homeStyles.searchSymbol}
              name="magnifying-glass" 
              size={24}
            />
              <TextInput
                text= {search}
                onChangeText={setSearch}
                style= {homeStyles.searchText}
                placeholder='Pesquisar...'
              />
            </View>
            
            {
              gratitutes.length > 0 ? 
              <FlatList
              data={gratitutes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                item.title.toLowerCase().includes(search.toLowerCase()) ? 
                <TouchableOpacity style={homeStyles.gratitudeItem} onPress={() => navigation.navigate('Detalhamento', {
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  date: item.date
                })}>
                  <View style={homeStyles.VStack}> 
                      <Text style= {homeStyles.gratitudeTitle}>{item.title}</Text>
                      <Text style= {homeStyles.gratitudeDescription}>{item.description}</Text>
                  </View>
                  
                  <SymbolView 
                      style = {homeStyles.crevronList}
                      name='chevron.right'
                  />
                </TouchableOpacity>
                : 
                null
              )}
            /> : 
              <View style={homeStyles.noGratitudeYet}>
                <Text>Adicione a sua primeira gratidão 😉</Text>
              </View>
            }

            
            

        </View>

        <TouchableOpacity style={homeStyles.buttonAddGratitude} onPress={goToForm}>
                <View>
                   <Text style={homeStyles.plusButtonText}>+</Text>
                </View>
            </TouchableOpacity>

        <TouchableOpacity
            style= {homeStyles.randomButton}
            onPress={randomButtonPressed}
          >
            <Ionicons name="dice-outline" size={28} color="white" />
          </TouchableOpacity>
    </SafeAreaView>
    
  );

  function goToForm () {
    navigation.navigate('Salvar Gratidão')
  }

  
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'leading',
    justifyContent: 'top',
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },


  title: {
    fontWeight: 'bold',
    fontSize: 40,
    padding: 20
  },

  buttonAddGratitude : {
    width: 65,
    height: 65,
    backgroundColor: '#2c3e50',
    borderRadius: 35,
    position: 'absolute',
    bottom: 40,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },

  plusButtonText: {
    fontWeight: 'bold',
    fontSize: 32,
    color: 'white'
  },

  gratitudeItem: {
    backgroundColor: '#d0e0e0',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },

  VStack: {
    flexDirection: 'column'
  },

  gratitudeTitle : {
    fontWeight: 'bold',
    fontSize: 16
  },

  gratitudeDescription: {
    fontSize: 12,
    fontWeight: 'semibold',
    color: '#777'
  },

  list: {
    paddingTop: 30
  },

  crevronList : {
    marginLeft: 'auto',
    width: 12,
    tintColor: 'gray'
  },

  search: {
    backgroundColor: '#e0e0e0',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'leading',
    marginHorizontal: 20,
    marginBottom: 30,
    flexDirection: 'row',
    paddingHorizontal: 10
  },

  searchSymbol : {
    width: 30,
    height: 30,
    tintColor: 'black',
  },
  searchText: {
    paddingHorizontal: 15,
    fontSize: 18
  },

  randomButton: {
    backgroundColor: '#d1a500',
    width: 64,
    height: 64,
    position: 'absolute',
    left: 20,
    bottom: 40,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },

  noGratitudeYet: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
});
