import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthUtils } from '../Utils/AuthUtils';
import axios from 'axios';

export default function UploadScreen({ navigation }) {
  const [photo, setPhoto] = React.useState(null);

  const createFormData = async (photo) => {
    const data = new FormData();

    if (photo) {
      data.append('file', {
        name: photo.fileName || 'image.jpg',
        type: photo.type,
        uri: photo.uri,
      });
    }

    return data;
  };

  const handleChoosePhoto = () => {
    launchImageLibrary({ noData: true }, (response) => {
      console.log(response);

      const responsearray = response;
      responsearray.assets?.map((item, index) => {
        console.log(`Element ${index + 1}:`);
        console.log(`FileName: ${item.fileName}`);
        console.log(`FileSize: ${item.fileSize}`);
        console.log(`Height: ${item.height}`);
        console.log(`Width: ${item.width}`);
        console.log(`Type: ${item.type}`);
        console.log(`URI: ${item.uri}`);
        console.log('------------------------');
      });

      if (response && response.assets && response.assets.length > 0 && response.assets[0].uri) {
        console.log('setting photo state');
        setPhoto(response.assets[0]);
      }
    });
  };

  const handleUploadPhoto = async () => {
    if (!photo) {
      console.log('No photo selected');
      return;
    }

    // Use AuthUtils.GetJWT to get the JWT token
    const token = await AuthUtils.GetJWT();
    console.log('token:', token);
    const data = await createFormData(photo);

    console.log('FormData:', data);

    axios
      .post('http://192.168.1.3:3000/media/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('upload success', response.data);
        setPhoto(null);
      })
      .catch((error) => {
        console.log('upload error', error);
      });
  };

  return (
    <View>
      {photo !== null && (
        <>
          <Image source={{ uri: photo.uri }} style={{ width: 300, height: 300 }} />
          <Button title="Upload Photo" onPress={handleUploadPhoto} />
        </>
      )}

      <Button title="Choose Photo" onPress={handleChoosePhoto} />
      <Button title="check status of photo state" onPress={() => console.log('photo setstate ', photo)}></Button>
    </View>
  );
}
