import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeView from './Screens/Home/HomeView.js'
import GratitudeForm from './Screens/GratitudeForm/GratitudeForm.js'
import DetailGratitude from './Screens/Detail/DetailGratitude.js'


export default function App() {
  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen 
          name='Home' 
          component={HomeView}
          options={{
            headerShown: false
          }

          }
        ></Stack.Screen>

        <Stack.Screen 
          name='Salvar Gratidão' 
          component={GratitudeForm}
          options={
            {
              headerBackTitle: 'Voltar'
            }
          }
        ></Stack.Screen>

        <Stack.Screen 
          name='Detalhamento' 
          component={DetailGratitude}
          options={
            {
              headerBackTitle: 'Voltar'
            }
          }
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    
  );

  
}
