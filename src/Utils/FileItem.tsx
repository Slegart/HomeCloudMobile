import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import * as mime from 'react-native-mime-types';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface FileItemProps {
  fileName: string;
  onPress: () => void;
}

const FileItem: React.FC<FileItemProps> = ({ fileName, onPress }) => {
  const fileType = mime.lookup(fileName);
  const fileExtension = typeof fileType === 'string' ? fileType.split('/')[1] : null;

  const renderIcon = () => {
    switch (fileExtension) {
      case 'pdf':
        return <AntIcon name="pdffile1" size={30} color="red" />;
      case 'docx':
        return <AntIcon name="text-document" size={30} color="blue" />;
      case 'txt':
        return <AntIcon name="filetext1" size={30} color="green" />;
      case 'xlsx':
        return <FontAwesome5Icons name="file-excel" size={30} color="green" />;
      case 'pptx':
        return <FontAwesome5Icons name="file-powerpoint" size={30} color="orange" />;
      case 'csv':
        return <FontAwesome5Icons name="file-csv" size={30} color="green" />;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
      case 'bz2':
      case 'xz':
        return <FontAwesomeIcons name="file-zip-o" size={30} color="purple" />;
      case 'xml':
        return <MaterialCommunityIcons name="xml" size={30} color="brown" />;
      default:
        return <MaterialCommunityIcons name="file-outline" size={30} color="black" />;
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>{renderIcon()}</View>
        <View >
          <Text numberOfLines={1} style={styles.fileNameText}>
            {fileName}
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
  iconContainer: {
    marginRight: 10,
  },
  fileNameText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
});

export default FileItem;
