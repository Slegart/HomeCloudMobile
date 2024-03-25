import React, { useEffect } from 'react'
import { StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { View, Text, Button, TextInput, Switch } from 'react-native';
import { UrlParser } from '../Utils/UrlParser';
import axiosInstance from '../Utils/axiosInstance';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function SetConfigPage({ navigation}:any) {
    const [ServerIp, setServerIp] = useState<string>('');
    const [Port, SetDefaultPort] = useState<string>('');
    const [ServerConnected, setServerConnected] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        TestConnection();
    }, []);

    const TestConnection = async () => {
        let ip = ""
        let port = ""
        let url = ""
        if(ServerIp === '' || Port === '')
        {
            try
            {
                const Baseurl = await AsyncStorage.getItem('ServerIp');
                console.log(Baseurl);
                if(Baseurl !== null)
                {
                    ip = Baseurl;
                }
                const Port = await AsyncStorage.getItem('Port');
                if(Port !== null)
                {
                    port = Port;
                }
                url = 'http://' + ip + ':' + port +'/auth/Connection';
                const response = await axios.get(url).then((response) => {
                    if (response.data === 'Connected' || 'InitialConnection') {
                        setLoading(false);
                        navigation.navigate('Home')
                    }
                    else
                    {
                        setServerConnected(false);
                        setLoading(false);
                    }
                }).catch((error) => {
                    console.error('Error:', error);
                });
            }
            catch(error)
            {
                console.error('Error:', error);
            }
        }

        
        console.log(url);
        url = 'http://' + ServerIp + ':' + Port+'/auth/Connection';
        const response = await axios.get(url).then((response) => {
            if (response.data === 'Connected' || 'InitialConnection') {
                setLoading(false);
                setServerConnected(true);
            }
            else
            {
                setServerConnected(false);
                setLoading(false);
            }
        }).catch((error) => {
            console.error('Error:', error);
        });

    }
    const SaveConfig = async () => {
        await AsyncStorage.setItem('ServerIp', ServerIp);
        await AsyncStorage.setItem('Port', Port);
        navigation.navigate('Home')
    }
    return (
        
           <View style={styles.container}>
     
            <Text style={{ fontSize: 20, marginBottom: 20, color:'black' }}>Connect to server</Text>

            <Text style={{ fontSize: 20, marginBottom: 20, color:'black' }}>Enter server details</Text>
            <TextInput
                style={styles.input}
                placeholder='Server Ip'
                onChange={(event) => { setServerIp(event.nativeEvent.text) }}
            />
            <Text style={{ fontSize: 20, marginBottom: 20, color:'black' }}>Enter server port</Text>
            <TextInput
                style={styles.input}
                placeholder='Port'
                onChange={(event) => { SetDefaultPort(event.nativeEvent.text) }}
            />
         { !ServerConnected&&  <TouchableOpacity
                style={styles.input}
                onPress={() => { TestConnection() }}
            >
                <Text style={{color:'black'}}>Test Connection</Text>
            </TouchableOpacity>}

            {
                ServerConnected && <Button
                    title='Save Config'
                    onPress={() => {SaveConfig() }}
                />
            }
      
        </View>
       
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    input: {
        color: 'black',
        width: '80%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});