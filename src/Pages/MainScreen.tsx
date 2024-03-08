import React from 'react';
import { View, Text, Button, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

import { launchImageLibrary } from 'react-native-image-picker';
import { AuthUtils } from '../Utils/AuthUtils';
export default function MainScreen({ navigation }) {

  async function checkstorage() {
    try {
      const value = await AsyncStorage.getItem('jwtToken');
      console.log('jwtToken:', value);
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  }

  async function Navigate() {
    const token = await AuthUtils.GetJWT();
    try {
      const response = await axios.post(
        'http://192.168.1.3:3000/auth/verify',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('response:', response.data);
      if (response.data === 'Valid Token') {
        navigation.navigate('Details');
      }
      else {
        console.log('Invalid token');
      }
    }
    catch (error) {
      console.error('Error verifying token:', error);
    }
  }
  async function getlengthfiles() {
    try {
      const token = await AuthUtils.GetJWT();
      const response = await axios.get('http://192.168.1.3:3000/media/FilesLength', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Files length response:', response.data);
    } catch (error) {
      console.error('Error fetching files length:', error);

    }
  }



  return (
    <View>
      <Text>MainScreen</Text>
      <Button title='check jwt' onPress={checkstorage}></Button>
      <Button title='Switch to protected window' onPress={Navigate}></Button>
      <Button title='get files len' onPress={getlengthfiles}></Button>

      <Button title='upload screen' onPress={() => navigation.navigate('Upload')}></Button>
      
      <Button title='Details screen' onPress={() => navigation.navigate('Details')}></Button>
    </View>
  );
}