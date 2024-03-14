import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import * as mime from 'react-native-mime-types';
import AntIcon from 'react-native-vector-icons/AntDesign';
import BlobUtil from 'react-native-blob-util';

interface FileItemProps {
  fileName: string;
  onPress: () => void;
}

const VideoItem: React.FC<FileItemProps> = ({ fileName, onPress }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    const checkFileExists = async () => {
      const path = BlobUtil.fs.dirs.DownloadDir + `/${fileName}`;
      const exists = await BlobUtil.fs.exists(path);
      setIsDownloaded(exists);
    };

    checkFileExists();
  }, [fileName,onPress]);

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
