import axiosInstance from '../Utils/axiosInstance';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ToastAndroid, Button, Alert } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { AuthUtils } from '../Utils/AuthUtils';
import DocSize from '../Utils/DocSize';
import { UrlParser } from '../Utils/UrlParser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PieChartComp from '../Utils/PieChartComp';
export default function SettingsScreen({ navigation }: any) {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [isCancelAvailable, setCancelAvailable] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [itemStatsVisible, setItemStatsVisible] = useState(false);
    const [EditPreferencesVisible, setEditPreferencesVisible] = useState(true);
    const [loading, setLoading] = useState(false);

    const [ImagesSize, setImagesSize] = useState("");
    const [VideosSize, setVideosSize] = useState("");
    const [DocumentsSize, setDocumentsSize] = useState("");

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                setImagesSize(await AsyncStorage.getItem('Images') || "");
                setVideosSize(await AsyncStorage.getItem('Videos') || "");
                setDocumentsSize(await AsyncStorage.getItem('Other') || "");
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
        setCancelAvailable(true);
        setEditPreferencesVisible(false);
    };

    const OptionPress = (option: string) => {
        setSelectedValue(option);
        setItemStatsVisible(true);
        setDropdownVisible(false);
        if (dropdownOptions.includes(option)) {
            setShowDeleteButton(true);
        }
    };

    const showToast = (Message: string) => {
        ToastAndroid.show(Message, ToastAndroid.SHORT);
    };
    const DeleteItems = async () => {
        setLoading(true);
        try {
            if (selectedValue) {
                const url = await UrlParser()
                const response = await axiosInstance.get('/media/deleteAllFiles', {
                    params: {
                        fileType: (selectedValue as string).toLowerCase()
                    },
                    headers: {
                        "Authorization": "Bearer " + await AuthUtils.GetJWT()
                    },
                    baseURL: url
                });
                if (response.data === 'Success') {
                    setSelectedValue(null);
                    setShowDeleteButton(false);
                    showToast('Files deleted successfully');
                }
            }
        } catch (error) {
            console.error('Error deleting documents:', error);
        } finally {
            setLoading(false);
        }
    }
    const Shutdown = async () => {
        try {
            Alert.alert(
                'Confirmation',
                'Are you sure you want to shut down?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Shut Down',
                        onPress: async () => {
                            try {
                                const url = await UrlParser()
                                await axiosInstance.get('/ssh/shutdown', {
                                    headers: {
                                        "Authorization": "Bearer " + await AuthUtils.GetJWT()
                                    }
                                    , baseURL: url
                                });
                                navigation.navigate('Home');
                            } catch (error) {
                                console.error('Error shutting down:', error);
                            }
                        },
                        style: 'destructive'
                    }
                ]
            );
        } catch (error) {
            console.error('Error shutting down:', error);
        }
    }

    const DeleteToken = async () => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to end session?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'End',
                    onPress: async () => {
                        await AsyncStorage.removeItem('token');
                        navigation.navigate('Home');
                    },
                    style: 'destructive'
                }
            ]
        );
    }

    return (
        <>
          <PieChartComp />
        
            <View style={styles.container}>
                <Text style={{fontStyle: 'italic', color: 'black'}}>Delete Files</Text>
                <TouchableOpacity style={styles.dropdownButton} onPress={handleDropdownPress}>
                    <Text style={{fontStyle: 'italic', color: 'black'}}> {selectedValue || 'Select a directory'}</Text>
                </TouchableOpacity>

                {itemStatsVisible && (
                    <>

                        {selectedValue === 'Images' && (
                            <View style={styles.verticalContainer}>
                                <Text>Images: {DocSize(parseInt(ImagesSize))}</Text>
                            </View>
                        )}
                        {selectedValue === 'Videos' && (
                            <View style={styles.verticalContainer}>
                                <Text>Videos: {DocSize(parseInt(VideosSize))}</Text>
                            </View>
                        )}
                        {selectedValue === 'Documents' && (
                            <View style={styles.verticalContainer}>
                                <Text>Documents: {DocSize(parseInt(DocumentsSize))}</Text>
                            </View>
                        )}
                        {selectedValue === 'All' && (
                            <View style={styles.verticalContainer}>
                                <Text>Images: {DocSize(parseInt(ImagesSize))}</Text>
                                <Text>Videos: {DocSize(parseInt(VideosSize))}</Text>
                                <Text>Documents: {DocSize(parseInt(DocumentsSize))}</Text>
                            </View>
                        )}
                    </>
                )}
            </View>
            { EditPreferencesVisible&&<View style={styles.FooterButtons}>
                <View style={styles.container}>
                    <Text>Shut Down</Text>
                    <TouchableOpacity onPress={Shutdown}>
                        <AntIcon name="poweroff" size={65}  color={"black"} />
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <Text>End Session</Text>
                    <TouchableOpacity onPress={DeleteToken}>
                        <AntIcon name="logout" size={65}  color={"black"} />
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <Text>Back</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntIcon name="back" size={65} color={"black"} />
                    </TouchableOpacity>
                </View>
            </View>}

            {showDeleteButton && (
                <View style={styles.FooterButtons}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: 'red' }]}
                        onPress={() => {
                            DeleteItems();
                            setEditPreferencesVisible(true);
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
                            setEditPreferencesVisible(true);
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
                            style={styles.modalOption}
                            onPress={() => { setDropdownVisible(false); setItemStatsVisible(false); setCancelAvailable(false); setEditPreferencesVisible(true); }}
                        >
                            <Text style={{ fontSize: 25 }}>Cancel</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Modal>

            {EditPreferencesVisible && <View style = {{padding:10, width: '50%', alignSelf: 'center'}}>
                <Button title="Edit Preferences" onPress={() => navigation.navigate('Preferences')} />
            </View>}

              
        </>

    );
};


const styles = StyleSheet.create({
    container: {
   
        paddingHorizontal: 20,
    },
    FooterButtons: {
        backgroundColor: 'white',
 
        flexDirection: 'row',
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
        padding: 50,
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
        color: 'black',
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
        borderRadius: 10,
    },
    CancelButton: {
        backgroundColor: 'white',
        padding: 15,
        marginVertical: 15,
        width: 200,
        alignItems: 'center',
    },
});

