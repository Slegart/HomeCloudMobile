import React from 'react';
import type { PropsWithChildren } from 'react';
import axios from 'axios';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UrlParser } from './src/Utils/UrlParser.ts';

import HomeScreen from './src/Pages/HomeScreen.tsx'
import DetailsScreen from './src/Pages/DetailsScreen.tsx'
import MainScreen from './src/Pages/MainScreen.tsx';
import UploadScreen from './src/Pages/UploadScreen.tsx';
import ImagesGalleryView from './src/Pages/FileTypeScreens/ImagesGalleryView.tsx';
import DocumentsView from './src/Pages/FileTypeScreens/DocumentsView.tsx';
import SettingsScreen from './src/Pages/SettingsScreen.tsx';


function App(): React.JSX.Element {

  const [Response, setResponse] = React.useState('');
  async function CheckConnection() {
    try {

      //const response = await axios.post('http://localhost:3000/auth/login', {   
      const response = await axios.post(UrlParser('/auth/login'), {
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
        <Stack.Screen name="Upload" component={UploadScreen} />
        <Stack.Screen name="ImagesGallery" component={ImagesGalleryView} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Documents" component={DocumentsView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
