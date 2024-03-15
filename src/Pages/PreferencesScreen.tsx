import axiosInstance from '../Utils/axiosInstance';
import { UrlParser } from '../Utils/UrlParser';
import { AuthUtils } from '../Utils/AuthUtils';
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Button, StyleSheet, TouchableHighlight, ToastAndroid } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import Tooltip from 'react-native-walkthrough-tooltip';

const PreferencesScreen = ({ navigation }: any) => {
  const [isThumbnailEnabled, setIsThumbnailEnabled] = useState(true);
  const [isFullSizeImagesEnabled, setIsFullSizeImagesEnabled] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(1);
  const [SessionDurationSeconds, setSessionDurationSeconds] = useState(600);
  const [toolTipVisible, setToolTipVisible] = useState([{ visible: false }, { visible: false }, { visible: false }]);
  const [SettingsLoading, setSettingsLoading] = useState(true);
  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  async function LoadSettings() {
    setSettingsLoading(true);
    try {
      const response = await axiosInstance.get(UrlParser('/settings/GetSettings'), {
        headers: {
          Authorization: 'Bearer ' + await AuthUtils.GetJWT(),
        },
      });
      console.log('Response:', response.data);
      setIsThumbnailEnabled(response.data.IsThumbnailEnabled);
      setIsFullSizeImagesEnabled(response.data.isFullSizeImagesEnabled);
      setSessionDuration(response.data.sessionDuration);
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
        sessionDuration: SessionDurationSeconds
      };

      console.log('Settings data:', settingsData);

      const response = await axiosInstance.post(('/settings/SetSettings'), settingsData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data === 'Success') {
        showToast('Preferences saved');
      }

    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const ChangeTokenDuration = (value: number) => {
    setSessionDuration(parseInt(value));
    let duration = 600;
    switch (parseInt(value)) {
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

  return (
    <View style={styles.container}>

      {SettingsLoading ? <Text>Loading...</Text> : (
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
                content={<Text>Save image thumbnails in disk or process at runtime.</Text>}
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
                content={<Text>Whether you want to display full size images in gallery view or not.
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

          <View style={styles.Slidercontainer}>
  <Text style={styles.label}>Session Duration</Text>
  <Slider
    minimumValue={1}
    maximumValue={6}
    step={1}
    value={sessionDuration}
    onValueChange={(value) => { ChangeTokenDuration(value); }}
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
          <View>
            <View style={{ marginBottom: 20 }}>
              <Button title="Save" onPress={handleSavePreferences} />
            </View>
            <View style={{ marginBottom: 20 }}>
              <Button title="Back" onPress={() => navigation.goBack()} />
            </View>
          </View>
        </>)}
    </View>
  );
};
const styles = StyleSheet.create({

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
