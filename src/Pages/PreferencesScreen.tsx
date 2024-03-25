import axiosInstance from '../Utils/axiosInstance';
import { UrlParser } from '../Utils/UrlParser';
import { AuthUtils } from '../Utils/AuthUtils';
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Button, StyleSheet, TouchableHighlight, ToastAndroid, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Certificate } from '../Utils/Certificate';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PreferencesScreen = ({ navigation }: any) => {

  const [isThumbnailEnabled, setIsThumbnailEnabled] = useState(true);
  const [isFullSizeImagesEnabled, setIsFullSizeImagesEnabled] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(1);
  const [SessionDurationSeconds, setSessionDurationSeconds] = useState(600);
  const [toolTipVisible, setToolTipVisible] = useState([{ visible: false }, { visible: false }, { visible: false }]);
  const [SettingsLoading, setSettingsLoading] = useState(true);
  const [IsinitialConnection, setIsinitialConnection] = useState<boolean>(true);
  const [HTTPSEnabled, setHTTPSEnabled] = useState(false);
  const [Port, setPort] = useState<string>("5000");
  const [InitialPort, SetInitialPort] = useState<string>("5000");
  const [PortChanged, SetPortChanged] = useState<boolean>(false);
  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const ChangeTokenDurationSlider = (value: number) => {
    let updatedValue = 1;
    switch (value) {
      case 600:
        updatedValue = 1;
        break;
      case 1800:
        updatedValue = 2;
        break;
      case 3600:
        updatedValue = 3;
        break;
      case 28800:
        updatedValue = 4;
        break;
      case 86400:
        updatedValue = 5;
        break;
      case 3153600000:
        updatedValue = 6;
        break;
      default:
        updatedValue = 1;
        break;
    }
    return updatedValue;
  }

  const ChangeTokenDuration = (value: number) => {
    setSessionDuration(parseInt(value.toString()));
    let duration = 600;
    switch (parseInt(value.toString())) {
      case 1:
        duration = 600;
        break;
      case 2:
        duration = 1800;
        break;
      case 3:
        duration = 3600;
        break;
      case 4:
        duration = 28800;
        break;
      case 5:
        duration = 86400;
        break;
      case 6:
        duration = 3153600000;
        break;
      default:
        duration = 600;
        break;
    }
    setSessionDurationSeconds(duration);
  };

  async function LoadSettings() {
    setSettingsLoading(true);
    try {
      const url = await UrlParser()
      const response = await axiosInstance.get('/settings/GetSettings', {
        headers: {
          Authorization: 'Bearer ' + await AuthUtils.GetJWT(),
        },
        baseURL: url
      });
      console.log('Response: get settings', response.data);
      setIsThumbnailEnabled(response.data.IsThumbnailEnabled);
      setIsFullSizeImagesEnabled(response.data.isFullSizeImagesEnabled);
      const sessionSlider = ChangeTokenDurationSlider(response.data.sessionDuration)
      setSessionDuration(sessionSlider);
      console.log('Session Duration:', response.data.sessionDuration);
      setHTTPSEnabled(response.data.HTTPSEnabled);
      setPort(response.data.Port);
      console.log('Initial Port:', response.data.Port);
      setIsinitialConnection(response.data.InitialConnectionFinished)
      SetInitialPort(response.data.Port)
      setSettingsLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }
  useEffect(() => {
    LoadSettings();
  }, []);

  const handleSavePreferences = async () => {
    try {
      const settingsData = {
        IsThumbnailEnabled: isThumbnailEnabled,
        isFullSizeImagesEnabled: isFullSizeImagesEnabled,
        sessionDuration: SessionDurationSeconds,
        HTTPSEnabled: HTTPSEnabled,
        Port: Port,
        InitialConnectionFinished: true
      };

      console.log('Settings data:', settingsData);
      const url = await UrlParser()
      const response = await axiosInstance.post(('/settings/SetSettings'), settingsData, {
        headers: {
          'Content-Type': 'application/json'
        },
        baseURL: url
      });
      if (response.data === 'Success') {
        showToast('Preferences saved');
        navigation.navigate('Main');
      }

    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const MakeInitialConnection = async () => {
    try {
      const settingsData = {
        IsThumbnailEnabled: isThumbnailEnabled,
        isFullSizeImagesEnabled: isFullSizeImagesEnabled,
        sessionDuration: SessionDurationSeconds,
        HTTPSEnabled: HTTPSEnabled,
        Port: Port,
        InitialConnectionFinished: true
      };

      console.log('Settings data:', settingsData);
      const url = await UrlParser()
      const savesettings = await axiosInstance.post(('/settings/SetSettings'), settingsData, {
        headers: {
          'Content-Type': 'application/json'
        },
        baseURL: url
      });

      console.log('Making initial connection');
      const response = await axiosInstance.get('/ssh/initialconnection', {
        headers: {
          Authorization: 'Bearer ' + await AuthUtils.GetJWT(),
        },
        baseURL: url
      });

      await Certificate.storeCertificate(response.data.certificate);
      //console.log(Certificate.retrieveCertificate());
      if (response.data === 'Initial Connection Finished') {
        showToast('Initial Connection Successful');
        { HTTPSEnabled ? navigation.navigate('Restart') : navigation.navigate('Main') }
      }

    } catch (error) {
      console.error('Error making initial connection:', error);
    }
  }
  const [PortValid, setPortValid] = useState(true);
  const [PortValidMessage, setPortValidMessage] = useState('');
  const PortInput = (text: string) => {
    if (text !== InitialPort) {
      setPort(text);
      SetPortChanged(true)
    }
    else if (text === InitialPort) {
      setPort(text);
      SetPortChanged(false)
    }


    if (!/^\d+$/.test(text)) {
      setPortValid(false);
      setPortValidMessage('Port must be a number');
      return;
    }
    else if (parseInt(text) < 1024 || parseInt(text) > 65535) {
      setPortValid(false);
      setPortValidMessage('Port must be between 1024 and 65535');
      return;
    }
    else {
      setPortValid(true);
      setPortValidMessage('');
    }
  }
  const RestartServer = async () => {
    try {
      const url = await UrlParser()
      const response = await axiosInstance.get(`/ssh/RestartServer`, {
        baseURL: url,
        headers: {
          Authorization: 'Bearer ' + await AuthUtils.GetJWT(),
        },
        params: {
          Port: Port,
        }
      });
      console.log('Server Restarted? ', response.data);
      AsyncStorage.setItem('Port', Port.toString());
      if (response.data === 'Server Restarted') {
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('Error restarting server:', error);
      Alert.alert('Error', 'Failed to restart the server. Please try again later.');
    }
  }
  return (
    <View style={styles.container}>

      {SettingsLoading ? <ActivityIndicator size="large" color="#0000ff" /> : (
        <>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Enable Thumbnails in storage  </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isThumbnailEnabled ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setIsThumbnailEnabled(!isThumbnailEnabled)}
              value={isThumbnailEnabled}
            />
            <View style={{ marginLeft: 25 }}>
              <Tooltip
                isVisible={toolTipVisible[0].visible}
                content={<Text style={{fontStyle: 'italic', color: 'black'}}>Save image thumbnails in disk or process at runtime.</Text>}
                placement='bottom'
                onClose={() => setToolTipVisible([{ visible: false }, { visible: false }, { visible: false }])}
              >
                <TouchableHighlight
                  onPress={() => setToolTipVisible([{ visible: true }, { visible: false }, { visible: false }])}
                  style={styles.touchable}>
                  <Text>?</Text>
                </TouchableHighlight>
              </Tooltip>
            </View>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Load full size images in gallery</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isFullSizeImagesEnabled ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setIsFullSizeImagesEnabled(!isFullSizeImagesEnabled)}
              value={isFullSizeImagesEnabled}
            />
            <View style={{ marginLeft: 25 }}>
              <Tooltip
                isVisible={toolTipVisible[1].visible}
                content={<Text style={{fontStyle: 'italic', color: 'black'}}>Whether you want to display full size images in gallery view or not.
                  Big images take time to load, downloading will still download original size.</Text>}
                placement='bottom'
                onClose={() => setToolTipVisible([{ visible: false }, { visible: false }, { visible: false }])}
              >
                <TouchableHighlight
                  onPress={() => setToolTipVisible([{ visible: false }, { visible: true }, { visible: false }])}
                  style={styles.touchable}>
                  <Text>?</Text>
                </TouchableHighlight>
              </Tooltip>
            </View>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>HTTPs Enabled                           </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={HTTPSEnabled ? "#f4f3f4" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setHTTPSEnabled(!HTTPSEnabled)}
              value={HTTPSEnabled}
            />
            <View style={{ marginLeft: 25 }}>
              <Tooltip
                isVisible={toolTipVisible[2].visible}
                content={<Text style={{fontStyle: 'italic', color: 'black'}}>In order to use HTTPS you must first import your CA provided SSL certificate to server.
                  In order for self signed certificate to work, you must import the certificate to your device's trusted credentials.
                </Text>}
                placement='bottom'
                onClose={() => setToolTipVisible([{ visible: false }, { visible: false }, { visible: false }])}
              >
                <TouchableHighlight
                  onPress={() => setToolTipVisible([{ visible: false }, { visible: false }, { visible: true }])}
                  style={styles.touchable}>
                  <Text>?</Text>
                </TouchableHighlight>
              </Tooltip>
            </View>
          </View>

          {/* <View style={styles.switchContainer}>
            <Text style={styles.label}>Port</Text>
           {!SettingsLoading&& <TextInput
              {...(PortValid ? { style: styles.NumberText } : { style: styles.InvalidNumberText })}
              placeholder='Port'
              keyboardType='numeric'
              onChangeText={(text) => PortInput(text)}
              value={Port}
            />}

          </View> */}
          {!PortValid && <Text style={styles.InvalidNumberText}>{PortValidMessage}</Text>}
          <View style={styles.Slidercontainer}>
            <Text style={styles.label}>Session Duration</Text>
            <Slider
              minimumValue={1}
              maximumValue={6}
              step={1}
              value={sessionDuration}
              onValueChange={(value) => { ChangeTokenDuration(value[0]); }}
            ></Slider>
            <Text style={styles.label}>
              {sessionDuration === 1 ? "10 minutes"
                : sessionDuration === 2 ? "30 minutes"
                  : sessionDuration === 3 ? "1 Hour"
                    : sessionDuration === 4 ? "8 hours"
                      : sessionDuration === 5 ? "1 Day"
                        : "1 Century"}
            </Text>
          </View>

          {IsinitialConnection && !PortChanged ? (<View>
            <View style={{ marginBottom: 20 }}>
              <Button title="Save" onPress={handleSavePreferences} />
            </View>
            <View style={{ marginBottom: 20 }}>
              <Button title="Back" onPress={() => navigation.goBack()} />
            </View>
          </View>) : (!PortChanged &&
            <View style={{ marginBottom: 20 }}>
              <Button title="Continue" onPress={() => MakeInitialConnection()} />
            </View>
          )}
          {
            PortChanged &&
            <View style={{ marginBottom: 20 }}>
              <Button title="Save and Restart" onPress={() => RestartServer()} />
            </View>
          }

        </>)}
    </View>
  );
};
const styles = StyleSheet.create({
  InvalidNumberText:
  {
    alignSelf: 'center',
    fontSize: 18,
    color: 'red',
    borderColor: 'red',
  },
  NumberText: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'black',
  },
  touchable: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 50,
  },
  Slidercontainer: {
    flex: 1,
    marginLeft: 50,
    marginRight: 50,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',

    margin: 20,
  },
  label: {
    alignSelf: 'center',
    marginRight: 10,
    fontSize: 18,
    color: 'black',
  },
});

export default PreferencesScreen;
