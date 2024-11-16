import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react';
import { SymbolView } from 'expo-symbols';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    const navigation = useNavigation();
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const saveGratitude = async () => {
      if (title == "") {
        Alert.alert("O título está vazio...", "Não deixe a sua gratidão sem nome...")
        return
      }

        try {
          const listaString = await AsyncStorage.getItem('@gratitudes');
          const listaJSON =  listaString != null ? JSON.parse(listaString) : [];
          const novaLista = [...listaJSON, {"id": listaJSON.length, "title" : title, "description" : description}]
          const novaListaStringada = JSON.stringify(novaLista); 
          await AsyncStorage.setItem('@gratitudes', novaListaStringada);
          navigation.goBack()
        } catch (error) {
          return [];
        }
      };

  return (
        <View style={formStyles.container}>
            <Text style={formStyles.textInputLabel}>Título da Gratidão:</Text>
            <TextInput
                style={formStyles.textField}
                value={title}
                onChangeText={(newValue) => {newValue.length <= 20 ? setTitle(newValue) : Alert.alert("Ops... o máximo 20 letras", "Use a descrição para falar mais sobre a sua gratidão ☺️")}}
                placeholder='Eu sou grato por...'
            />
            <Text
              style={formStyles.letterCount}
            >{title.length}/20</Text>
            <Text style={formStyles.textInputLabel}>Adicione uma descrição:</Text>

            <TextInput 
                style={formStyles.textArea}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={4}
                placeholder='Isso me fez grato porque...'
            />
            
            <TouchableOpacity style={formStyles.buttonConfirm} onPress={saveGratitude}>
                <View>
                    <SymbolView
                        name='checkmark'
                        tintColor= 'white'
                    />
                </View>
            </TouchableOpacity>
            
        </View>
  );
}

const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'leading',
    justifyContent: 'top',
    paddingVertical: 20
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },

  textField: {
    height: 48,
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#d0e0e0'
  },
  
  textInputLabel: {
    fontWeight: 'semibold',
    paddingHorizontal: 20
  },

  textArea: {
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#d0e0e0'
  },

  buttonConfirm : {
    width: 65,
    height: 65,
    backgroundColor: '#9bcd6d',
    borderRadius: 35,
    position: 'absolute',
    bottom: 40,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },

  confirmButtonText: {
    fontWeight: 'bold',
    fontSize: 32,
    color: 'white'
  },
  letterCount: {
    textAlign: 'right',
    paddingHorizontal: 20,
    fontSize: 10,
  }
});
