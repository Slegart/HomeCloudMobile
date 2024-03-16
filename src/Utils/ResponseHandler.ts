import axios from "axios";
import { ToastAndroid } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
};

export const ResponseHandler = (response: any) => {
    const navigation: NavigationProp<ParamListBase> = null as any;
    if (response) {
        if (response.status === 200) { }
        else if (response.status === 201) { }
        else if (response.status === 204) { }

        else if (response.status >= 400 && response.status < 500) {
            if (response.status === 400) {
                showToast('Bad Request');
            } else if (response.status === 401) {
                console.log('Unauthorized');
                showToast('Unauthorized');
                navigation.navigate('Home');
            }
            else if (response.status === 404) { showToast('Not Found') }

        } else if (response.status >= 500 && response.status < 600) {
            if (response.status === 500) { showToast('Internal Server Error') }
            else if (response.status === 503) { showToast('Service Unavailable') }
        }
    }
};
