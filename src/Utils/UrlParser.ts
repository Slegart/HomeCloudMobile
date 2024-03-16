import React from 'react'

export const UrlParser = (path:string) => {
    const BaseUrl = 'http://192.168.1.3:5000';
    const LiveUrl = 'http://100.117.186.16:5000';
    const isProduction = process.env.NODE_ENV === 'production';
    //window.location.hostname === 'localhost' ? false : true;
    //console.log("isProduction: ",isProduction);

     //const url = isProduction ? LiveUrl : BaseUrl;
     const url = BaseUrl; //testing local
     //const url= LiveUrl; //testing live
    //console.log('url:', url + path);
    return url + path;
}
