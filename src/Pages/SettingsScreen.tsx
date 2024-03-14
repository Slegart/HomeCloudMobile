import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ToastAndroid } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { AuthUtils } from '../Utils/AuthUtils';
import { UrlParser } from '../Utils/UrlParser';
import DocSize from '../Utils/DocSize';
const SettingsScreen = ({ navigation }: any) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const [isCancelAvailable, setCancelAvailable] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [itemStatsVisible, setItemStatsVisible] = useState(false);
    const [documents, setDocuments] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const [ImagesSize, setImagesSize] = useState("");
    const [VideosSize, setVideosSize] = useState("");
    const [DocumentsSize, setDocumentsSize] = useState("");

    useEffect(() => {
        const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(UrlParser(`/media/GetAllFilesStats`), {
                headers: {
                    Authorization: 'Bearer ' + await AuthUtils.GetJWT(),
                },
            });
            console.log('Response:', response.data);
            setImagesSize(DocSize(response.data.Images));
            setVideosSize(DocSize(response.data.Videos));
            setDocumentsSize(DocSize(response.data.Other));
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
        };
    
        fetchDocuments();
      }, []);

    const dropdownOptions = ['Images', 'Videos', 'Documents', 'All'];

    const handleDropdownPress = () => {
        setDropdownVisible(true);
        setItemStatsVisible(true);
        setCancelAvailable(true);
    };

    const OptionPress = (option) => {
        setSelectedValue(option);
        setDropdownVisible(false);
        if (dropdownOptions.includes(option)) {
            setShowDeleteButton(true);
        }
    };

    const showToast = (Message:string) => {
        ToastAndroid.show(Message, ToastAndroid.SHORT);
      };
    const DeleteItems = async() => {
        setLoading(true);
        try {
            const response = await axios.get(UrlParser('/media/deleteAllFiles'), {
                params: {
                    fileType: selectedValue.toLowerCase()
                },
                headers: {
                    "Authorization" : "Bearer " + await AuthUtils.GetJWT()
                }
            });
            console.log('Response:', response.data);
            if(response.data === 'Success') {
            setSelectedValue(null);
            setShowDeleteButton(false);
            showToast('Files deleted successfully');
            
            }
        } catch (error) {
            console.error('Error deleting documents:', error);
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <View style={styles.container}>
                <Text>Delete Files</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={handleDropdownPress}>
                    <Text>{selectedValue || 'Select a directory'}</Text>
                </TouchableOpacity>

                {itemStatsVisible && (
                <>
               
                {selectedValue === 'Images' && (
                    <View style={styles.horizontalContainer}>
                        <Text>Images: {ImagesSize}</Text>
                    </View>
                )}
                {selectedValue === 'Videos' && (
                    <View style={styles.horizontalContainer}>
                        <Text>Videos: {VideosSize}</Text>
                    </View>
                )}
                {selectedValue === 'Documents' && (
                    <View style={styles.horizontalContainer}>
                        <Text>Documents: {DocumentsSize}</Text>
                    </View>
                )}
                {selectedValue === 'All' && (
                    <View style={styles.container}>
                        <Text>Images: {ImagesSize}</Text>
                        <Text>Videos: {VideosSize}</Text>
                        <Text>Documents: {DocumentsSize}</Text>
                    </View>
                )}
                </>
            )}
            </View>


            {showDeleteButton && (
                <View style={styles.FooterButtons}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: 'red' }]}
                        onPress={() => {
                            DeleteItems();
                        }}
                    >
                        <View style={styles.verticalContainer}>
                            <AntIcon name="delete" size={50} color="white" />
                            <Text style={styles.buttonText}>Delete Files</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: 'grey' }]}
                        onPress={() => {
                            setShowDeleteButton(false);
                            setSelectedValue(null);
                        }}
                    >
                        <View style={styles.verticalContainer}>
                            <AntIcon name="close" size={50} color="white" />
                            <Text style={styles.buttonText}>Cancel</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}

          

            <Modal visible={isDropdownVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    {dropdownOptions.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={styles.modalOption}
                            onPress={() => OptionPress(option)}
                        >
                            <Text style={{ fontSize: 25 }}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                    {isCancelAvailable && (
                        <TouchableOpacity
                            style={styles.CancelButton}
                            onPress={() => setDropdownVisible(false)}
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Modal>

            <View>
            <TouchableOpacity style={styles.dropdownButton} onPress={navigation.navigate('Preferences')}>
                    <Text>Edit Preferences</Text>
                </TouchableOpacity>
            </View>

        </>

    );
};


const styles = StyleSheet.create({
    container: {
        padding: 50,
    },
    FooterButtons: {
        backgroundColor: 'white',
        paddingVertical: 10,
       
        flexDirection: 'row',
        paddingHorizontal: 20, 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
    
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        bottom: '20%',
        width: '100%',
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
    buttonText: {
        color: 'white',
        marginLeft: 10,
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginTop: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalOption: {
        backgroundColor: 'red',
        padding: 15,
        marginVertical: 5,
        width: 200,
        alignItems: 'center',
    },
    CancelButton: {
        backgroundColor: 'white',
        padding: 15,
        marginVertical: 15,
        width: 200,
        alignItems: 'center',
    },
});

export default SettingsScreen;
