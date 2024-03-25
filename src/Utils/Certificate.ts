import RNFS from 'react-native-fs';

export const Certificate = {
  async storeCertificate(cert: string) {
    try {
      console.log('Storing certificate:', cert);
      const downloadsDirectory =RNFS.DownloadDirectoryPath;
      const certificatePath = `${downloadsDirectory}/certificate1.pem`;
      await RNFS.writeFile(certificatePath, cert, 'utf8'); 
      console.log('Certificate stored securely at:', certificatePath);
    } catch (error) {
      console.error('Failed to store certificate:', error);
    }
  },


  // async retrieveCertificate() {
  //   try {
  //     const credentials = await EncryptedStorage.getItem('certificate');
  //     if (credentials) {
  //       const storedCertificate = credentials;
  //       console.log('Retrieved certificate:', storedCertificate);
  //       return storedCertificate;
  //     } else {
  //       console.log('No certificate stored');
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error('Failed to retrieve certificate:', error);
  //     return null;
  //   }
  // },
};
