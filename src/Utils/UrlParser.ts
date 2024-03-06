import React from 'react'

export const UrlParser = (path:string) => {
    const BaseUrl = 'http://192.168.1.3:3000';
    //const LiveUrl = 'https://homecloudapi.herokuapp.com/';
    // const isProduction = window.location.hostname === 'localhost' ? false : true;
    // console.log("isProduction: ",isProduction);

    // const url = isProduction ? LiveUrl : BaseUrl;
     const url = BaseUrl; //testing local
     //const url= LiveUrl; //testing live

    return url + path;
}
