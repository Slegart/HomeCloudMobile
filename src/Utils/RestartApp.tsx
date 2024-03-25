import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, View, Alert } from 'react-native'
import axiosInstance from './axiosInstance'
import { AuthUtils } from './AuthUtils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UrlParser } from './UrlParser'

const RestartApp = ({navigation}:any) => {
  const [RestartInitiated, setRestartInitiated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  }, [RestartInitiated])

const RestartServer = async () => {
  try {
    setLoading(true);
    const Port = 5005
    const url = await UrlParser()
    const response = await axiosInstance.get(`/ssh/RestartServer`, {  
      baseURL: url,  
      headers: {
        Authorization: 'Bearer ' + await AuthUtils.GetJWT(),
      },
      params: {
        Port: Port,
      }
    });
    console.log('Server Restarted? ', response.data);
    setLoading(false);
    AsyncStorage.setItem('Port', Port.toString());
    if (response.data === 'Server Restarted') {
      navigation.navigate('Main');
    }
  } catch (error) {
    setLoading(false);
    console.error('Error restarting server:', error);
    Alert.alert('Error', 'Failed to restart the server. Please try again later.');
  }
}


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Restart" onPress={() => RestartServer()} />
      )}
    </View>
  )
}

export default RestartApp 
