import React, { useState, useEffect } from 'react';
import { View, Button, Image } from 'react-native';
import axios from 'axios';
import { encode as base64Encode } from 'base-64';
import { AuthUtils } from '../Utils/AuthUtils';
import { useNavigation } from '@react-navigation/native';
const DetailsScreen = ({ navigation }:any) => {
  const navigate = useNavigation();
  const [imageUri, setImageUri] = useState('');
  const [TotalImages, setTotalImages] = useState(0);
  const [TotalVideos, setTotalVideos] = useState(0);
  const [TotalOther, setTotalOther] = useState(0);

  const GetDocumentsSize = async () => {
    try {
      const token = await AuthUtils.GetJWT();
      if (token === null) return;
      const response = await axios.get('http://192.168.1.3:3000/media/FilesLength',
        {
          headers:
          {
            Authorization: 'Bearer ' + token
          }
        });
      console.log(response.data);
      //Images: 1, Videos: 0, Other: 0
      setTotalImages(response.data.Images);
      setTotalVideos(response.data.Videos);
      setTotalOther(response.data.Other);
    }
    catch (error) { console.log(error) }
  }

  const Start = async () => {
    await GetDocumentsSize();
  }
  useEffect(() => {
    Start()
  }, []);

  return (
    <View>

      <Button
        title='Images screen'
        onPress={() => navigation.navigate('Images', { totalImages: TotalImages, })} />

    </View>
  );
};

export default DetailsScreen;
