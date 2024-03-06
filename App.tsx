import React from 'react';
import type { PropsWithChildren } from 'react';
import axios from 'axios';
import { Colors} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/Pages/HomeScreen.tsx'
import DetailsScreen from './src/Pages/DetailsScreen.tsx'
import MainScreen from './src/Pages/MainScreen.tsx';

function App(): React.JSX.Element {

  const [Response, setResponse] = React.useState('');
  async function CheckConnection() {
    try {

      //const response = await axios.post('http://localhost:3000/auth/login', {   
      const response = await axios.post('http://192.168.1.3:3000/auth/login', {
        username: 'admin',
        password: 'admin',
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);
      const token = response.data.access_token;
      setResponse(token);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
   <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Main" component={MainScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

export default App;
