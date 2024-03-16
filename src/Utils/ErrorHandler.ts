import { ToastAndroid } from "react-native";

const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
};

export const ErrorHandler = (error: any) => {
   
    if (error) {
        if (error.response) {
            if (error.response.status === 400) {
                showToast('Bad Request');
            } else if (error.response.status === 401) {
                console.log('Unauthorized');
                showToast('Unauthorized, Login');
            }
            else if (error.response.status === 404) { showToast('Not Found') }
            else if (error.response.status === 500) { showToast('Internal Server Error') }
            else if (error.response.status === 503) { showToast('Service Unavailable') }
        }
    }
};
