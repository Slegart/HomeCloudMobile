import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Image, StyleSheet, Text, ActivityIndicator, Dimensions } from 'react-native';
import { ImageGallery } from '@georstat/react-native-image-gallery';
import { AuthUtils } from '../../Utils/AuthUtils';
import axios from 'axios';
import { UrlParser } from '../../Utils/UrlParser';

const ImagesGalleryView = ({ route }: any) => {
  const { totalImages, totalVideos, totalOther } = route.params;
  const [imagesLinks, setImagesLinks] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const PageSize = 10;
  const [LastPageLoaded, setLastPageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialIndex, setInitialIndex] = useState<number | null>(null);

  const getImages = async (currentPage: number) => {
    try {
      if (LastPageLoaded || loading) {
        //console.log("Last Page Loaded returning or loading");
        return;
      }

      setLoading(true);

      const imageNamesRes = await axios.get(UrlParser(`/media/GetFileNames`), {
        params: {
          fileType: 'images',
          PageNo: currentPage,
          PageSize: PageSize,
        },
        headers: {
          Authorization: 'Bearer ' + await AuthUtils.GetJWT()
        }
      });

      if (page * PageSize >= totalImages) {
        setLastPageLoaded(true);
      }

      const Token = await AuthUtils.GetJWT();
      const fileType = 'images';
      const domain = await UrlParser('/media/serveFile');
      const imageLinks = imageNamesRes.data.map((image: string, index: number) => ({
        id: index + 1,
        url: `${domain}?fileName=${image}&fileType=${fileType}&Bearer${Token}`,
        
      }));

      setImagesLinks((prevImages) => [...prevImages, ...imageLinks]);
    } catch (error) {
      //console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (totalImages !== undefined && totalImages > 0) {
      getImages(page);
    }
  }, [totalImages, page]);

  useEffect(() => {
    const formattedImages = imagesLinks.map((image, index) => ({
      id: `${index + 1}`,
      url: image.url,
    }));
    setGalleryImages(formattedImages);
  }, [imagesLinks]);

  const openGallery = (index: number) => {
    setInitialIndex(index);

    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const GridItem = React.memo(({ item, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri: item.url }} style={styles.gridItem} />
    </TouchableOpacity>
  ));
  
  const renderGridItem = ({ item, index }: any) => (
    <GridItem item={item} onPress={() => openGallery(index)} />
  );

  const handleEndReached = useCallback(() => {
    if (LastPageLoaded || loading) {
      return;
    }

    setPage((prevPage) => prevPage + 1);
    getImages(page + 1);
  }, [LastPageLoaded, loading, page]);

  useEffect(() => {

    if(initialIndex===null){ return; }
    if(galleryImages.length<0){ return; }
    if(initialIndex%10===9 && !LastPageLoaded && totalImages>initialIndex+1)
    {
      //console.log("loading next page")
      setPage((prevPage) => prevPage + 1);
      getImages(page + 1);
    }

  }, [initialIndex]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{totalImages} Images Found</Text>
      <FlatList
        data={galleryImages}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
      />
      {/* spinner test edilmedi sorun cıkarabilir  */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <ImageGallery
        close={closeGallery}
        isOpen={isOpen}
        images={galleryImages}
        initialIndex={initialIndex|| undefined}
        onIndexChange={(index: number) => setInitialIndex(index)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridItem: {
    width: Dimensions.get('window').width / 2 - 10,
    height: Dimensions.get('window').width / 2 - 10,
    margin: 5,
    resizeMode: 'cover',
  },
  headerText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
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

export default ImagesGalleryView;
