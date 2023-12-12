import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { NativeBaseProvider } from "native-base";
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { storage, db } from "../../../../firebase/config";
let options = {
  title: 'Select Image',
  customButtons: [
    { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const audioRecorderPlayer = new AudioRecorderPlayer();

export default function ShopDetailScreen() {
  const [shopName, setShopName] = useState(null);
  const [shopAddress, setShopAddress] = useState(null);
  const [avatarSource, setAvatarSource] = useState(null);
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');

  useEffect(()=>{
    const uploadImage = async() => {
      const BlobImage = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        }
        xhr.onerror = function() {
          reject(new TypeError('Network Request Failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', avatarSource, true);
        xhr.send(null);
      });
      // Create the file metadata
        /** @type {any} */
        const metadata = {
          contentType: 'image/jpeg'
        };
          // Upload file and metadata to the object 'images/mountains.jpg'
const storageRef = ref(storage, 'Imaged/' + Date.now());
const uploadTask = uploadBytesResumable(storageRef, BlobImage, metadata);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
    });
  }
);
    }
    if(avatarSource != null) {
      uploadImage()
      setAvatarSource(null)
    }
  }, [avatarSource])

  useEffect(() => {
    audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }, []);
  const onStartRecord = async () => {

    const path = RNFS.DocumentDirectoryPath + '/hello.m4a';
    // Create the file if it doesn't exist
    if (!(await RNFS.exists(path))) {
      await RNFS.writeFile(path, '', 'utf8');
    }

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const meteringEnabled = false;
    const uri = await audioRecorderPlayer.startRecorder(path, audioSet, meteringEnabled);
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordSecs(e.currentPosition);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    });
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
  };

  const onStartPlay = async () => {
    const path = RNFS.DocumentDirectoryPath + '/hello.m4a';
    const msg = await audioRecorderPlayer.startPlayer(path);
    audioRecorderPlayer.setVolume(1.0);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.currentPosition === e.duration) {
        console.log('finished');
        audioRecorderPlayer.stopPlayer();
      }
      setCurrentPositionSec(e.currentPosition);
      setCurrentDurationSec(e.duration);
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
    });
  };

  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  const onStopPlay = () => {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };
  const handleGalleryClick = () => {
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        setAvatarSource(source);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <NativeBaseProvider>
          <Text style={{ fontSize: 30, fontWeight: '600', textAlign: 'center', marginBottom: 30 }}>Shop detail</Text>
          <TextInput
            placeholder="Shop Name"
            style={styles.input}
            value={shopName}
            onChangeText={(text) => setShopName(text)}
          />
          <TextInput
            placeholder="Shop Address"
            style={styles.input}
            value={shopAddress}
            onChangeText={(text) => setShopAddress(text)}
          />
          <View>
            <TouchableOpacity style={{ backgroundColor: 'green', height: '30%', width: '100%', borderRadius: 5 }} onPress={handleGalleryClick}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 15, marginTop: 3 }}>Choose Photo/Video</Text>
            </TouchableOpacity>
            {avatarSource && <Image source={avatarSource} style={{ width: 100, height: 100 }} />}
          </View>
          <View style={styles.RecordContainer}>
            <Text style={{textAlign:'center'}}>{recordTime}</Text>
            <TouchableOpacity style={{ backgroundColor: 'green', height: '20%', width: '100%', borderRadius: 5 }} onPress={onStartRecord}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 15, marginTop: 3 }}>Start Recording</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'green', height: '20%', width: '100%', borderRadius: 5, marginTop:10 }} onPress={onStopRecord}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 15, marginTop: 3,}}>Stop Recording</Text>
            </TouchableOpacity>
            <Text style={{textAlign:'center'}}>{playTime} / {duration}</Text>
            <TouchableOpacity style={{ backgroundColor: 'green', height: '20%', width: '100%', borderRadius: 5, marginTop:10 }} onPress={onStartPlay}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 15, marginTop: 3,}}>Start Playback</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'green', height: '20%', width: '100%', borderRadius: 5, marginTop:10 }} onPress={onPausePlay}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 15, marginTop: 3,}}>Pause Playback</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'green', height: '20%', width: '100%', borderRadius: 5, marginTop:10 }} onPress={onStopPlay}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 15, marginTop: 3,}}>Stop Playback</Text>
            </TouchableOpacity>
          </View>
        </NativeBaseProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subContainer: {
    padding: 40,
    borderRadius: 10,
    width: '80%',
   height:'80%',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5
  },
  RecordContainer: {
    flex:1,
  minHeight:100,
  position:'relative',
  bottom:80
  }
});
