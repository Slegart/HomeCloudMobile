import React, { useState, useEffect } from 'react';
import { View, Button, Image } from 'react-native';
import axiosInstance from '../Utils/axiosInstance';
import { AuthUtils } from '../Utils/AuthUtils';
import { useNavigation } from '@react-navigation/native';
import { UrlParser } from '../Utils/UrlParser';
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
      const response = await axiosInstance.get(UrlParser('/media/FilesLength'),
        {
          headers:
          {
            Authorization: 'Bearer ' + token
          }
        });
      //Images: 0, Videos: 0, Other: 0
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

      {/* <Button
        title='Images screen'
        onPress={() => navigation.navigate('Images', { totalImages: TotalImages, })} /> */}
      <Button title='Images Gallery Screen' onPress={() => navigation.navigate('ImagesGallery', { totalImages: TotalImages, })} />
    </View>
  );
};

export default DetailsScreen;
