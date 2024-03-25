import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/Pages/HomeScreen.tsx'
import DetailsScreen from './src/Pages/DetailsScreen.tsx'
import MainScreen from './src/Pages/MainScreen.tsx';
import UploadScreen from './src/Pages/UploadScreen.tsx';
import ImagesGalleryView from './src/Pages/FileTypeScreens/ImagesGalleryView.tsx';
import DocumentsView from './src/Pages/FileTypeScreens/DocumentsView.tsx';
import SettingsScreen from './src/Pages/SettingsScreen.tsx';
import PreferencesScreen from './src/Pages/PreferencesScreen.tsx';
import VideoView from './src/Pages/FileTypeScreens/VideoView.tsx';
import InitialConnectionScreen from './src/Pages/InitialConnectionScreen.tsx';
import RestartApp from './src/Utils/RestartApp.tsx';
import SetConfigPage from './src/Pages/SetConfigPage.tsx';
function App(): React.JSX.Element {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SetConfig" component={SetConfigPage} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Upload" component={UploadScreen} />
        <Stack.Screen name="ImagesGallery" component={ImagesGalleryView} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Documents" component={DocumentsView} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} />
        <Stack.Screen name="Video" component={VideoView} />
        <Stack.Screen name="InitialConnection" component={InitialConnectionScreen} />
        <Stack.Screen name="Restart" component={RestartApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
