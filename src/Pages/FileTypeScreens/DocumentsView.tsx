import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Dimensions, ToastAndroid, Platform } from 'react-native';
import axios from 'axios';
import { UrlParser } from '../../Utils/UrlParser';
import { AuthUtils } from '../../Utils/AuthUtils';
import FileItem from '../../Utils/FileItem';
import RNFS from 'react-native-fs';
//import RNFetchBlob from 'rn-fetch-blob';
import BlobUtil from 'react-native-blob-util';
import { Alert, Modal, Text, Pressable } from 'react-native';
const DocumentsView = ({ route }: any) => {
  const [documents, setDocuments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFileName, setselectedFileName] = useState('');
  const PageSize = 10;
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(UrlParser(`/media/GetFileNames`), {
          params: {
            fileType: 'other',
            PageNo: currentPage,
            PageSize: PageSize,
          },
          headers: {
            Authorization: 'Bearer ' + await AuthUtils.GetJWT(),
          },
        });
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDocumentClick = async (fileName: string) => {
    console.log('Document clicked:', fileName);
    if (fileName) {
      const downloadsDirectory =RNFS.DownloadDirectoryPath;
      const filePath = `${downloadsDirectory}/${fileName}`;
      const exists = await RNFS.exists(filePath);
      if(exists){
        console.log('File exists:', filePath);
       BlobUtil.android.actionViewIntent(filePath, 'application/*');
      }
      else
      {
        console.log('File does not exist:', filePath);
        setModalVisible(true);
      }
      setselectedFileName(fileName);

    }
  };

  const DownloadFile = async (fileName: string) => {
    try {
      console.log('Downloading file:', fileName);
      const response = await axios.get(UrlParser(`/media/serveFile`), {
        params: {
          fileName: fileName,
          fileType: 'other',
        },
        headers: {
          Authorization: 'Bearer ' + await AuthUtils.GetJWT(),
        },
      });
      console.log('Response:', response.request.responseURL);

      const downloadsDirectory =RNFS.DownloadDirectoryPath;
      console.log('downloadsDirectory:', downloadsDirectory);

      const filePath = `${downloadsDirectory}/${fileName}`;
      console.log('filePath:', filePath);
      const options = {
        fromUrl: response.request.responseURL,
        toFile: filePath,
      };
      const download = RNFS.downloadFile(options);
      download.promise.then((response) => {
        console.log('File downloaded successfully:', response);
      });
      
      /*
      BlobUtil
      .config({
        fileCache: true,
        path: downloadsDirectory,
        
      })
      .fetch('GET', response.request.responseURL)
      
      .then((res) => {
        console.log('The file saved to ', res.path());
      })
      */


      showToast('File downloaded successfully');
      setModalVisible(!modalVisible);
      setselectedFileName('');
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };


  const showToast = (Message:string) => {
    ToastAndroid.show(Message, ToastAndroid.SHORT);
  };
  
  const renderDocumentItem = ({ item }: { item: string }) => (
    <FileItem fileName={item} onPress={() => handleDocumentClick(item)} />
  );

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={documents}
          renderItem={renderDocumentItem}
          keyExtractor={(item) => item}
          numColumns={1}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
      { modalVisible && <View style={styles.centeredView}>
        <Modal
     transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{selectedFileName}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => DownloadFile(selectedFileName)}>
                <Text style={styles.textStyle}>Download</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default DocumentsView;
