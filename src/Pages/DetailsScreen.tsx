import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import axios from 'axios';
import { encode as base64Encode } from 'base-64';
import { AuthUtils } from '../Utils/AuthUtils';
const ImageDisplayScreen = () => {
  const [imageUri, setImageUri] = useState('');

  const getImage = async () => {
    try {
      const token = await AuthUtils.GetJWT();
   
      const response = await axios.get('http://192.168.1.3:3000/media/getFiles', {
        params: {
          Ftype: 'images',
          Page: 1,
          PageSize: 5
        },
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
       
      const uint8Array = new Uint8Array(response.data);
      const byteArray = Array.from(uint8Array);
      const base64Image = base64Encode(String.fromCharCode.apply(null, byteArray));

      setImageUri(`data:image/jpeg;base64,${base64Image}`);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  return (
    <View>
      <Button title="Load Image" onPress={getImage}></Button>
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
    </View>
  );
};

export default ImageDisplayScreen;
