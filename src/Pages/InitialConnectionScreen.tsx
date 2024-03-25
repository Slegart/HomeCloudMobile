import React from 'react';
import PreferencesScreen from './PreferencesScreen';

const InitialConnectionScreen = ({ route }: any) => {
    const { initialConnection } = route.params || {}; 
    console.log('InitialConnection:', initialConnection)

    return (
        <PreferencesScreen />
    );
} 

export default InitialConnectionScreen;
