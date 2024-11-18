import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native';
import { SymbolView } from 'expo-symbols';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export default function App() {
    const navigation = useNavigation();
    const route = useRoute()
    const title = route.params.title
    const description = route.params.description
    const id = route.params.id
    const date = route.params.date

    const [newTitle, setNewTitle] = useState(title)
    const [newDescription, setNewDescription] = useState(description)

    const handleDelete = async () => {
      try {
        const listaString = await AsyncStorage.getItem('@gratitudes');
        const listaJSON =  listaString != null ? JSON.parse(listaString) : [];
        const novaLista = listaJSON.filter(
          (gratitude) => gratitude.id != id
        );
        const novaListaStringada = JSON.stringify(novaLista); 
        await AsyncStorage.setItem('@gratitudes', novaListaStringada);
        navigation.goBack()
      } catch (error){
        console.log("Deu algum erro no handleDelete")
        console.log(error)
      }
      
    }

    const showAlertDelete = async () => {
      Alert.alert (
        "Deseja apagar a gratidão?",
        "Essa ação não poderá ser desfeita.",
        [
          {text: "Cancelar", style: 'cancel'},
          {text: "Deletar", onPress: handleDelete, style: 'destructive'}
        ]
      )
    }

    const confirmChanges = async () => {
      if (newTitle == "") {
        Alert.alert("O título está vazio...", "Não deixe a sua gratidão sem nome...")
        return
      }

      try {
        const listaString = await AsyncStorage.getItem('@gratitudes');
        const listaJSON =  listaString != null ? JSON.parse(listaString) : [];
        const novaLista = listaJSON.filter(
          (gratitude) => gratitude.id != id
        );
        const novaLista2 = [...novaLista, {"id": id, "title" : newTitle, "description" : newDescription}]

        const novaListaStringada = JSON.stringify(novaLista2); 
        await AsyncStorage.setItem('@gratitudes', novaListaStringada);
        navigation.goBack()
      } catch (error){
        console.log("Deu algum erro no handleDelete")
        console.log(error)
      }
    }

  return (
        <View style={detailStyles.container}>
          <View>
            <TextInput 
              style= {detailStyles.title} 
              value={newTitle}
              onChangeText={
                (newValue) => {
                    newValue.length <= 20 ? 
                    setNewTitle(newValue) : 
                    Alert.alert(
                      "Ops... o máximo 20 letras", 
                      "Use a descrição para falar mais sobre a sua gratidão ☺️"
                    )
                }
              }
            
            />

            <TextInput  
              value={newDescription}
              numberOfLines={2}
              onChangeText={setNewDescription}
            />
          </View>
            
          <TouchableOpacity
            style= {detailStyles.deleteButton}
            onPress={showAlertDelete}
          >
            <SymbolView style={detailStyles.deleteButtonText} name='trash'/>
          </TouchableOpacity>

        {
          newTitle != title || newDescription != description ?
          <TouchableOpacity
            style= {detailStyles.confirmChanges}
            onPress={confirmChanges}
          >
            <Text style={detailStyles.confirmChangesText}>Confirmar mudanças</Text>
            <SymbolView style={detailStyles.deleteButtonText} name='checkmark'/>
          </TouchableOpacity> 
          : null
        }
          <Text>Gratidão do dia {date}</Text>

          
        </View>
    
  );

  
}

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'leading',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },


  title: {
    fontWeight: 'bold',
    fontSize: 32,
  },

  deleteButton : {
    height: 40,
    width: 40,
    borderRadius: 25,
    backgroundColor: '#d74f47',
    position: 'absolute',
    top: 50,
    right:30,
    justifyContent: 'center',
    alignItems: 'center'
  },

  deleteButtonText : {
    color: 'white',
    fontWeight: 'bold',
    tintColor: 'white',
  },
  
  confirmChanges : {
    height: 60,
    width: '100%',
    borderRadius: 25,
    backgroundColor: '#2c3e50',
    position: 'absolute',
    bottom: 50,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  confirmChangesText: {
    color: 'white',
    padding: 20
  },

  

});
