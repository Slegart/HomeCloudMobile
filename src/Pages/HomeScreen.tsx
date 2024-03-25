import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, ToastAndroid, StyleSheet, Switch } from 'react-native';
import axiosInstance from '../Utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UrlParser } from '../Utils/UrlParser';
export default function HomeScreen({ navigation }: any) {
    const [Username, setUsername] = useState<string>('');

    const [Password, setPassword] = useState<string>('');
    const [ConfirmPassword, setConfirmPassword] = useState<string>('');
    const [PasswordsMatch, setPasswordsMatch] = useState<boolean>(false);

    const [RememberCredientials, setRememberCredientials] = useState<boolean>(false);
    const [IsinitalConnection, setIsinitalConnection] = useState<boolean>(false);

    const [Loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        navigation.addListener('focus', () => {
            CheckConnection();
        });
    },[]);

    useEffect(() => {
        if (Password === ConfirmPassword) {
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
        }
    }, [Password, ConfirmPassword]);

    useEffect(() => {
        const retrieveCredentials = async () => {
            try {
                const rememberCredentials = (await AsyncStorage.getItem('RememberCredientials')) === 'true';
                console.log('Remember credentials:', rememberCredentials);
                setRememberCredientials(rememberCredentials);

                if (rememberCredentials) {
                    console.log("Credentials true");
                    const username = await AsyncStorage.getItem('username') || '';
                    const password = await AsyncStorage.getItem('password') || '';
                    setUsername(username);
                    setPassword(password);
                } else {
                    console.log("Credentials false");
                    setUsername('');
                    setPassword('');
                }
            } catch (error) {
                console.error('Error retrieving credentials:', error);
            }
        };

        retrieveCredentials();
        CheckConnection();
    }, []);

    const showToast = (Message: string) => {
        ToastAndroid.show(Message, ToastAndroid.SHORT);
    };

    const storeToken = async (token: string) => {
        try {
            await AsyncStorage.setItem('jwtToken', token);
        } catch (error) {
            console.error('Error storing token:', error);
        }
    };

    const SaveCredientials = async (username: string, password: string) => {
        try {
            if (RememberCredientials) {
                console.log('Storing credientials');
                await AsyncStorage.setItem('username', username);
                await AsyncStorage.setItem('password', password);
                await AsyncStorage.setItem('RememberCredientials', 'true');
            }
            else {
                console.log('Removing credientials');
                await AsyncStorage.removeItem('username');
                await AsyncStorage.removeItem('password');
                await AsyncStorage.setItem('RememberCredientials', 'false');
            }
        } catch (error) {
            console.error('Error storing credientials:', error);
        }
    }

    const Login = async (directpage: string) => {
        try {
            console.log('Logging in');
            const url = await UrlParser();
            const response = await axiosInstance.post('/auth/login', {
                username: Username,
                password: Password
            }, {
                baseURL: url
            });
            console.log('Login response:', response.data);
            if (response.data.success === true) {
                await SaveCredientials(Username, Password)
                const jwtToken = response.data.access_token;
                await storeToken(jwtToken);
                await GetSettings(jwtToken);
                directpage === "Connected" ? navigation.navigate('Main') : navigation.navigate('Preferences');
                console.log('JWT Token:', jwtToken);
            } else {
                console.log('Login failed:', response.data.message);
                showToast(response.data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            showToast('Error during login');
        }
    };

    const GetSettings = async (token: string) => {
        const url = await UrlParser();
        axiosInstance.get(`/settings/GetSettings`, {
            baseURL: url,
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

    const Register = async () => {
        try {
            const url = await UrlParser();
            const response = await axiosInstance.post('/auth/register', {
                username: Username,
                password: Password
            }, {
                baseURL: url
            });
            console.log('Register response:', response.data);
            if (response.data.success === true) {
                await SaveCredientials(Username, Password)
                const jwtToken = response.data.access_token;
                await storeToken(jwtToken);
                await GetSettings(jwtToken);
                navigation.navigate('Preferences');
                console.log('JWT Token:', jwtToken);
            } else {
                console.log('Register failed:', response.data.message);
                showToast(response.data.message);
            }
        } catch (error) {
            console.error('Error during register:', error);
            showToast('Error during register');
        }
    }

    const AuthCheck = async () => {
        console.log('Checking connection');
        try {
            IsinitalConnection ? Register() : Login('Connected');

        } catch (error) {
            console.error('Error checking connection:', error);
            showToast((error as Error).message);
        }
    };

    const CheckConnection = async () => {
        setLoading(true);
        try {
            const url = await UrlParser();
            const response = await axiosInstance.get(`/auth/Connection`, { baseURL: url });
            response.data === 'Connected' ? setIsinitalConnection(false) : setIsinitalConnection(true);
        } catch (error) {
            console.error('Error checking connection:', error);
            // Handle error state here if needed
        } finally {
            setLoading(false);
        }
    }
    

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
        <View style={styles.container}>
            {Loading && <Text>Loading...</Text>}
            {!Loading && (
                <>
                    <Text style={{ fontSize: 20, marginBottom: 20, color:'black' }}>Home Cloud</Text>
    
                    <TextInput
                        style={styles.input}
                        placeholder='Username'
                        defaultValue={IsinitalConnection ? "" : Username}
                        onChange={(event) => { setUsername(event.nativeEvent.text) }}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Password'
                        defaultValue={IsinitalConnection ? "" : Password}
                        onChange={(event) => { setPassword(event.nativeEvent.text) }}
                        secureTextEntry={true}
                    />
                    {IsinitalConnection && (
                        <TextInput
                            style={styles.input}
                            placeholder='Confirm Password'
                            secureTextEntry={true}
                            defaultValue=""
                            onChange={(event) => { setConfirmPassword(event.nativeEvent.text) }}
                        />
                    )}
                    <Button
                        title={IsinitalConnection ? "Register" : "Login"}
                        disabled={PasswordsMatch || !IsinitalConnection ? false : true}
                        onPress={() => AuthCheck()}
                    />
    
                    <Text style={{color:'black'}}>Remember Credientials</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={RememberCredientials ? "green" : "gray"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={(value) => setRememberCredientials(value)}
                        value={RememberCredientials}
                    />
                </>
            )}
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