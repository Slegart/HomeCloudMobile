import axios from 'axios';
import { UrlParser } from '../Utils/UrlParser';
import { AuthUtils } from '../Utils/AuthUtils';
import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';


const PreferencesScreen = () => {
  const [isThumbnailEnabled, setIsThumbnailEnabled] = useState(true);
  const [isFullSizeImagesEnabled, setIsFullSizeImagesEnabled] = useState(false);

  const handleSavePreferences = async () => {
    try {
      const settingsData = {
        IsThumbnailEnabled: isThumbnailEnabled,
        isFullSizeImagesEnabled: isFullSizeImagesEnabled
      };
  
      console.log('Settings data:', settingsData);
      
      const response = await axios.post(UrlParser('/settings/SetSettings'), settingsData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(response.data); 
  
    } catch (error) {
      console.error('Error saving preferences:', error); 
    }
  };
  

  return ( 
    <View style={styles.container}>
      <Text style={styles.heading}>Preferences</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Enable Thumbnails</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isThumbnailEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setIsThumbnailEnabled(!isThumbnailEnabled)}
          value={isThumbnailEnabled}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Load full size images in gallery?</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isThumbnailEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={()=> setIsFullSizeImagesEnabled(!isFullSizeImagesEnabled)}
          value={isThumbnailEnabled}
        />
      </View>

      <Button title="Save" onPress={handleSavePreferences} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    marginRight: 10,
    fontSize: 18,
    color: 'black',
  },
});

export default PreferencesScreen;
