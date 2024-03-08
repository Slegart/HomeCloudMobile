import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthUtils = {
  GetJWT: async () => {
    try {
      const value = await AsyncStorage.getItem('jwtToken');
      return value; 
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null; 
    }
  },
};
