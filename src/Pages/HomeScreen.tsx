import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import axios from 'axios';
import { UrlParser } from '../Utils/UrlParser';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }:any) {
    const [Username, setUsername] = useState<string>('');
    const [Password, setPassword] = useState<string>('');

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
                navigation.navigate('Main');
                console.log('JWT Token:', jwtToken);
            }
            else {
                console.log('Login failed:', response.data.message);
            }

        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const CheckConnection = async () => {
        try {
            const response = await axios.get(UrlParser('/auth/Connection'));
            if (response.data === 'Connected') {
                await Login();
            }
            else {
                console.log('no connection');
            }

        } catch (error) {
            console.error('Error checking connection:', error);
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

    async function clearjwt() {
        try {
            await AsyncStorage.removeItem('jwtToken');
            console.log('jwtToken removed');
        } catch (error) {
            console.error('Error removing jwtToken:', error);
        }
    }

    return (
        <View>
            <Text>Home</Text>
            <TextInput
                placeholder='Username'
                onChange={(event) => { setUsername(event.nativeEvent.text) }}
            ></TextInput>
            <TextInput
                placeholder='Password'
                onChange={(event) => { setPassword(event.nativeEvent.text) }}
            ></TextInput>
            <Button
                title="Check"
                onPress={() => CheckConnection()}
            />
               <Button
                title="clear jwt"
                onPress={() => clearjwt()}
            />
        </View>
    );
}
