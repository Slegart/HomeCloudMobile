import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import * as mime from 'react-native-mime-types';
import AntIcon from 'react-native-vector-icons/AntDesign';
import BlobUtil from 'react-native-blob-util';
import axiosInstance from './axiosInstance';
import { AuthUtils } from './AuthUtils';

interface FileItemProps {
  fileName: string;

  onPress: () => void;
}

const VideoItem: React.FC<FileItemProps> = ({ fileName, onPress }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [imageData, setImageData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const checkFileExists = async () => {
      const path = BlobUtil.fs.dirs.DownloadDir + `/${fileName}`;
      const exists = await BlobUtil.fs.exists(path);
      setIsDownloaded(exists);
    };
    checkFileExists();
  }, [fileName,onPress]);
  useEffect(()=>{
    GetVideoThumbnails(fileName);
  },[]);

  const GetVideoThumbnails = async (fileName:string) => {
    try {
      const response = await axiosInstance.get(`/media/videothumbnails`, {
        params: {
          fileType: 'videos',
          fileName: fileName,
        },
        headers: {
          Authorization: 'Bearer ' + await AuthUtils.GetJWT(),
        },
      });
    
      const imageDataObject: { [key: string]: any } = {};
      
      imageDataObject[fileName] = response.data
      setImageData(imageDataObject);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  };

  const fileType = mime.lookup(fileName);
  const fileExtension = typeof fileType === 'string' ? fileType.split('/')[1] : null;

  const renderIcon = () => {
    switch (fileExtension) {
      case 'mp4':
        return <AntIcon name="videocamera" size={30} color="black" />;
      case 'avi':
        return <AntIcon name="videocamera" size={30} color="black" />;
      case 'mov':
        return <AntIcon name="videocamera" size={30} color="black" />;
      case 'wmv':
        return <AntIcon name="videocamera" size={30} color="black" />;
      case 'flv':
        return <AntIcon name="videocamera" size={30} color="black" />;
      case 'mkv':
        return <AntIcon name="videocamera" size={30} color="black" />;
      case 'webm':
        return <AntIcon name="videocamera" size={30} color="black" />;
    }
  };

  return (
    <TouchableOpacity onPress={onPress }>
      <View style={isDownloaded ? styles.containerDownloaded : styles.container}>
        <View style={styles.iconContainer}>{renderIcon()}</View>
        <View>
          <Text numberOfLines={1} style={styles.fileNameText}>
            {fileName.length > 20
              ? fileName.substring(0, 15) + '...' + fileName.substring(fileName.length - 15, fileName.length)
              : fileName}
          </Text>
          {imageData ? (
            <Image
              source={{ uri: `data:image/png;base64,${imageData[fileName]}` }}
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
  },
  containerDownloaded: {
    alignItems: 'center',
    margin: 10,
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
  },

  iconContainer: {
    marginRight: 10,
  },
  fileNameText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
});

export default VideoItem;
