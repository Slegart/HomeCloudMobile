import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthUtils } from '../Utils/AuthUtils';
export default function MainScreen({ navigation }: any) {
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
    <View style={styles.verticalContainer}>
      {/* Upload */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Upload')}
      >
        <View style={styles.verticalContainer}>
          <AntIcon name="clouduploado" size={50} color="white" />
          <Text style={styles.buttonText}>Upload</Text>
        </View>
      </TouchableOpacity>

      {/* Gallery */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ImagesGallery', { totalImages: TotalImages, })}
      >
        <View style={styles.verticalContainer}>
          <MaterialCommunityIcons name="view-gallery-outline" size={50} color="white" />
          <Text style={styles.buttonText}>Cloud Gallery</Text>
        </View>

      </TouchableOpacity>

      {/* Documents */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Documents')}
      >
        <View style={styles.verticalContainer}>
          <AntIcon name="filetext1" size={50} color="white" />
          <Text style={styles.buttonText}>Documents</Text>
        </View>
      </TouchableOpacity>

      {/* Settings */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Settings')}
      >
        <View style={styles.verticalContainer}>
          <AntIcon name="setting" size={50} color="white" />
          <Text style={styles.buttonText}>Settings</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  verticalContainer:
  {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
  },
});
