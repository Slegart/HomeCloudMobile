import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, ToastAndroid } from 'react-native';
import axios from 'axios';
import { UrlParser } from '../Utils/UrlParser';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }:any) {
    const [Username, setUsername] = useState<string>('admin');
    const [Password, setPassword] = useState<string>('admin');

    const showToast = (Message:string) => {
        ToastAndroid.show(Message, ToastAndroid.SHORT);
      };

    const storeToken = async (token: string) => {
        try {
            await AsyncStorage.setItem('jwtToken', token);
        } catch (error) {
            console.error('Error storing token:', error);
        }
    };

    const Login = async () => {
        try {
            const response = await axios.post(UrlParser('/auth/login'), {
                username: Username,
                password: Password
            });
            if (response.data.success === true) {
                const jwtToken = response.data.access_token;
                await storeToken(jwtToken);
                GetSettings(jwtToken);
                navigation.navigate('Main');
                console.log('JWT Token:', jwtToken);
            }
            else {
                console.log('Login failed:', response.data.message);
                showToast(response.data.message)
            }

        } catch (error) {
            console.error('Error during login:', error);
            showToast('Error during login')
        }
    };

const GetSettings = (token: string) => {
    axios.get(UrlParser('/settings/GetSettings'), {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
        const settings = response.data;
        AsyncStorage.setItem('settings', JSON.stringify(settings));
    })
    .catch((error) => {
        console.error('Error getting settings:', error);
    });
}

    

    const CheckConnection = async () => {
        console.log('Checking connection');
        try {
            const response = await axios.get(UrlParser('/auth/Connection'));
            console.log('Connection response:', response);
            if (response.data === 'Connected') {
                await Login();
            }
            else {
                console.log('No connection');
                const resp = "response: " + response.data;
                showToast(resp);
            }

        } catch (error) {
            console.error('Error checking connection:', error);
            showToast((error as Error).message);
        }
    };

    useEffect(() => {
        const retrieveToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('jwtToken');
                if (storedToken) {
                    console.log('Retrieved JWT Token:', storedToken);
                }
            } catch (error) {
                console.error('Error retrieving token:', error);
            }
        };

        retrieveToken();
    }, []);

    return (
        <View>
            <Text>Home</Text>
            <TextInput
                placeholder='Username'
                defaultValue='admin'
                onChange={(event) => { setUsername(event.nativeEvent.text) }}
            ></TextInput>
            <TextInput
                placeholder='Password'
                defaultValue='admin'
                onChange={(event) => { setPassword(event.nativeEvent.text) }}
            ></TextInput>
            <Button
                title="Login"
                onPress={() => CheckConnection()}
            />
          
        </View>
    );
}
