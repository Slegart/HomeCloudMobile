import AsyncStorage from '@react-native-async-storage/async-storage';

export const UrlParser = async () => {
    const Baseurl = await AsyncStorage.getItem('ServerIp');
    const Port = await AsyncStorage.getItem('Port');
    const url =  'http://'+Baseurl + ':' + Port;
    return url ;
}
