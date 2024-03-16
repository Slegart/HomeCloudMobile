import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseHandler } from './ResponseHandler';
import { ErrorHandler } from './ErrorHandler';
import { InternalAxiosRequestConfig } from 'axios';
const port = 5000;
const axiosInstance: AxiosInstance = axios.create(
    {
        baseURL: 'http://192.168.1.3:' + port,
    }
);

axiosInstance.interceptors.request.use(function (config: InternalAxiosRequestConfig<any>) {
    //ResponseHandler(config);
    return config;
}, function (error) {
    ErrorHandler(error);
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (response: AxiosResponse) {
   //ResponseHandler(response);
    return response;
}, function (error) {
   ErrorHandler(error);
    return Promise.reject(error);
});

export default axiosInstance;
