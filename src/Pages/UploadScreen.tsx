import React, { useEffect } from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Button, ToastAndroid } from 'react-native';
import { launchImageLibrary, launchCamera, ImageLibraryOptions } from 'react-native-image-picker';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { AuthUtils } from '../Utils/AuthUtils';
import axiosInstance from '../Utils/axiosInstance';
import Entypo from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import DocSize from '../Utils/DocSize';
import { UrlParser } from '../Utils/UrlParser';
const createFormData = async (file: any, type: string) => {
  const data = new FormData();
  console.log('File:', file);
  console.log('Type:', type);
  if (file) {
    if (type === "image") {
      data.append('file', {
        name: file.fileName || ("Unresolved_Name"+ (Math.random() + 1).toString(36).substring(7)),
        type: file.type,
        uri: file.uri,
      });
    }
    else if(type === "document"){
      data.append('file', {
        name: file.name || ("Unresolved_Name"+ (Math.random() + 1).toString(36).substring(7)),
        type: file.type,
        uri: file.uri,
      });
    }

  }

  return data;
};

const handleImagePickerResponse = async (response: any, setFile: any) => {
  if (response && response.assets && response.assets.length > 0 && response.assets[0].uri) {
    console.log('Assets response:', response.assets[0]);
    await setFile(response.assets[0])
  }
};

const showToast = (Message: string) => {
  ToastAndroid.show(Message, ToastAndroid.SHORT);
};


const handleUpload = async (file: any, setFile: any, type: string) => {
  if (!file) {
    return;
  }

  try {
    const token = await AuthUtils.GetJWT();
    const data = await createFormData(file, type);
    const url = await UrlParser()
    const response = await axiosInstance.post('/media/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      baseURL:url
    });

    if (response.data === "Success") {
      console.log('Upload success:');
      showToast('Upload success');
      setFile(null);
    }

  } catch (error) {
    console.log('Upload error', error);
  }
};

const DocType = (type: string) => {
  if (type.includes('image')) {
    return 'Image';
  }
  if (type.includes('video')) {
    return 'Video';
  }
  if (type.includes('pdf')) {
    return 'PDF';
  }
  return 'Other';
}

export default function UploadScreen({ navigation }: any) {
  const [photo, setPhoto] = useState(null);
  const [document, setDocument] = useState<DocumentPickerResponse | null>(null);
  const [DocumentUploadReady, setDocumentUploadReady] = useState(false);

  const options: ImageLibraryOptions = {
    mediaType: 'photo', 
};
  const handleChoosePhoto = () => {
    // launchImageLibrary({ noData: true }, (response) => {
    launchImageLibrary(options, (response) => {
      handleImagePickerResponse(response, setPhoto).then(() => {
        setDocumentUploadReady(true);
      });
    });
  };

  const handleTakePhoto = () => {
    console.log('Take photo');
    launchCamera(options, (response) => {
      handleImagePickerResponse(response, setPhoto).then(() => {
        setDocumentUploadReady(true);
      });
    });
  };




  const handleChooseDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const loading = DocumentPicker.isInProgress;
      console.log('Document loading:', loading);
      console.log('Document selected:', result);
      setDocument(result[0] || null);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('Error picking document:', err);
      }
    }
  };


  const handleUploadDocument = () => handleUpload(document, setDocument, "document");
  const handleUploadPhoto = () => handleUpload(photo, setPhoto, "image");

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: '80%' }}>
        {photo !== null && (
          <>
            <Image source={{ uri: (photo as any).uri }} style={styles.previewImage} />
            <View style={styles.docInfoContainer}>
              <Text style={[styles.buttonText, styles.docName]}>{(photo as any).fileName}</Text>
              <Text style={[styles.buttonText, styles.docDetails]}>{DocType((photo as any).type ?? '')}</Text>
              <Text style={[styles.buttonText, styles.docDetails]}>{DocSize((photo as any).fileSize ?? 0)}</Text>
            </View>
            <View style={styles.horizontalContainer}>
              <TouchableOpacity style={styles.button} onPress={handleUploadPhoto}>
                <View style={styles.verticalContainer}>
                  <AntIcon name="clouduploado" size={50} color="white" />
                  <Text style={styles.buttonText}>{!DocumentUploadReady ? ("Loading") : ("Upload")}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => {
                setPhoto(null);
              }}>
                <View style={styles.verticalContainer}>
                  <AntIcon name="delete" size={50} color="white" />
                  <Text style={styles.buttonText}>Clear</Text>
                </View>
              </TouchableOpacity>
            </View>

          </>
        )}
        {document !== null && (
          <>
            <TouchableOpacity style={styles.button} onPress={handleUploadDocument}>
              <View style={styles.docInfoContainer}>
                <Text style={[styles.buttonText, styles.docName]}>{document.name}</Text>
                <Text style={[styles.buttonText, styles.docDetails]}>{DocType(document.type ?? '')}</Text>
                <Text style={[styles.buttonText, styles.docDetails]}>{DocSize(document.size ?? 0)}</Text>
              </View>
              <View style={styles.uploadIconContainer}>
                <AntIcon name="clouduploado" size={50} color="white" />
                <Text style={styles.buttonText}>Upload</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => {
              setDocument(null);
            }}>
              <View style={styles.verticalContainer}>
                <AntIcon name="delete" size={50} color="white" />
                <Text style={styles.buttonText}>Clear</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
          <View style={styles.verticalContainer}>
            <Entypo name="images" size={50} color="white" />
            <Text style={styles.buttonText}>Choose Photo</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
          <View style={styles.verticalContainer}>
            <AntIcon name="camera" size={50} color="white" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleChooseDocument}>
          <View style={styles.verticalContainer}>
            <AntIcon name="addfile" size={50} color="white" />
            <Text style={styles.buttonText}>Choose Document</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ecf0f1',
  },
  previewImage: {
    width: '100%',
    height: '50%',
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
  verticalContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: '20%',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
  },
  docInfoContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  docName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  docDetails: {
    fontSize: 12,
    color: 'black',
  },
  uploadIconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
