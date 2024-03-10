import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { UrlParser } from '../../Utils/UrlParser';
import { AuthUtils } from '../../Utils/AuthUtils';
import FileItem from '../../Utils/FileItem';
import RNFetchBlob from 'rn-fetch-blob';

const DocumentsView = ({ route }: any) => {
  const [documents, setDocuments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 10;

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
    try {
      const response = await axios.get(UrlParser(`/media/serveFile`), {
        params: {
          fileName: fileName,
          fileType: 'other',
        },
        headers: {
          Authorization: 'Bearer ' + await AuthUtils.GetJWT(),
        },
        responseType: 'blob',
      });

      const blobData = response.data._data;

      const base64Data = RNFetchBlob.base64.encode(blobData);

      const filePath = RNFetchBlob.fs.dirs.DownloadDir + `/${fileName}`;
  
      await RNFetchBlob.fs.writeFile(filePath, base64Data, 'base64');
      console.log('File downloaded:');
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const renderDocumentItem = ({ item }: { item: string }) => (
    <FileItem fileName={item} onPress={() => handleDocumentClick(item)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={documents}
        renderItem={renderDocumentItem}
        keyExtractor={(item) => item}
        numColumns={2}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default DocumentsView;
