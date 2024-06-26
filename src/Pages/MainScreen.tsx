import axiosInstance from '../Utils/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthUtils } from '../Utils/AuthUtils';
import { UrlParser } from '../Utils/UrlParser';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MainScreen({ navigation }: any) {
  const [TotalImages, setTotalImages] = useState(0);
  const [TotalVideos, setTotalVideos] = useState(0);
  const [TotalOther, setTotalOther] = useState(0);
  

  async function GetStorageSpace() {
    try {
      const url = await UrlParser();
      console.log('Getting storage space:', url);
      const response = await axiosInstance.get('/media/getstoragespace', 
      { 
        baseURL: url,
      responseType: 'json' 
      });
      const storageSpaceData = response.data;
      console.log('Storage space:', response);
      // Store each item in AsyncStorage
      await AsyncStorage.setItem('totalSpace', (response.data.TotalSpace*1000).toString());
      await AsyncStorage.setItem('usedSpace', (response.data.UsedSpace*1000).toString());
      await AsyncStorage.setItem('freeSpace', (response.data.FreeSpace*1000).toString());
    } catch (error) {
      console.error('Error getting storage space:', error);
    }
  }
  const GetDocumentsSize = async () => {
    try {
      const token = await AuthUtils.GetJWT();
      if (token === null) return;
      const url = await UrlParser()
      const response = await axiosInstance.get(`/media/FilesLength`,
        {
          headers:
          {
            Authorization: 'Bearer ' + token
          },
          baseURL: url
        });
      //Images: 0, Videos: 0, Other: 0
      setTotalImages(response.data.Images);
      setTotalVideos(response.data.Videos);
      setTotalOther(response.data.Other);
    }
    catch (error) { console.log(error) }
  }

  const GetAllFileStats = async () => {
    try
    {
    const url = await UrlParser();
      const responsefilestats = await axiosInstance.get(`/media/GetAllFilesStats`, { 
        headers: {
            Authorization: 'Bearer ' + await AuthUtils.GetJWT(),
        },
        responseType: 'json',
        baseURL: url
    });
    console.log("GetAllFilesStats ",responsefilestats.data)
    AsyncStorage.setItem('Images', responsefilestats.data.Images.toString());
    AsyncStorage.setItem('Videos', responsefilestats.data.Videos.toString());
    AsyncStorage.setItem('Other', responsefilestats.data.Other.toString());

    }
    catch (error) {
      console.error('Error getting all file stats:', error);
    }
  }

  const Start = async () => {
    await GetDocumentsSize();
  }

  useFocusEffect(
    React.useCallback(() => {
      Start();
      GetStorageSpace();
      GetAllFileStats();
      return () => {
      };
    }, [])
  );

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
      <View style={styles.galleryVideoContainer}>
        {/* Gallery */}
        <TouchableOpacity
          style={[styles.button, { flex: 1 }]}
          onPress={() => navigation.navigate('ImagesGallery', { totalImages: TotalImages })}
        >
          <View style={styles.buttonContainer}>
            <MaterialCommunityIcons name="view-gallery-outline" size={50} color="white" />
            <Text style={styles.buttonText}>Cloud Gallery</Text>
          </View>
        </TouchableOpacity>

        {/* Video */}
        <TouchableOpacity
          style={[styles.button, { flex: 1 }]}
          onPress={() => navigation.navigate('Video', { totalVideos: TotalVideos })}
        >
          <View style={styles.buttonContainer}>
            <AntIcon name="videocamera" size={50} color="white" />
            <Text style={styles.buttonText}>Video</Text>
          </View>
        </TouchableOpacity>
      </View>


      {/* Documents */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Documents', { totalOther: TotalOther })}
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryVideoContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
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
