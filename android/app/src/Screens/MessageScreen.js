import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Button } from 'react-native';
import { Box, Heading, Menu, AspectRatio, Center, HStack, Stack, NativeBaseProvider, Pressable } from "native-base";
import React, { useState, useEffect } from 'react'
import FeatherIcon from 'react-native-vector-icons/Feather';
import ProjectIcon from 'react-native-vector-icons/Octicons'
import MessageIcon from 'react-native-vector-icons/AntDesign'
import PerformanceIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ProfileIcon from 'react-native-vector-icons/FontAwesome';
import EditProfileIcon from 'react-native-vector-icons/FontAwesome5';
import AttachmentIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function MessageScreen({ navigation }) {
  const [message, setMessage] = useState('');
  const [isFoucesed, setIsFoucesed] = useState(false);
  const [ImgUrl, setImgUrl] = useState(null);
  const [data, setData] = useState({})
  const apiURL = 'https://coralr.com/api/profile';
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.post(apiURL, {}, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        console.log('API Response', response.data)
        setData(response.data.data);
        console.log(response.data.data.name)
           
      }
    } catch (error) {
      console.log('API Response Error', error);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  const LogoutapiURL = 'https://coralr.com/api/logout';
  
  const LogoutHandling = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token received in Dashboard logout functionality', token);
  
      if (token) {
        const response = await axios.post(
          LogoutapiURL,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
  
        console.log(response.data);
  
        if (response.data.status === 'success') {
          await AsyncStorage.removeItem('token');
          console.log('Logout successful');
          navigation.navigate('Login');
        } else {
          console.log('Logout failed');
        }
      } else {
        console.log('Token not found, cannot logout');
      }
    } catch (error) {
      console.log('Error during logout:', error.message);
    }
  };
  // const AttachementFiles = async() => {
  //   try {
  //     console.log('PRESS ====>')
  //     const result = await launchCamera({saveToPhotos:true});
  //     setImgUrl(result?.assets[0]?.uri);
  //     console.log('click the camera ', result)
  //   } catch (error) {
  //       console.log('Error in Launching camera', error)
  //   }
  // }
  const AttachementGallery = async () => {
    try {
      console.log('PRESS ====>')
      const result = await launchImageLibrary();
      setImgUrl(result?.assets[0]?.uri);
      console.log('click the Image Gallery ', result)
    } catch (error) {
      console.log('Error in Launching gallery', error)
    }
  }
  return (
    <>
      <View style={styles.subContainer}>
        <NativeBaseProvider>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <View>
              <Box>
                <Menu trigger={triggerProps => {
                  return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                    <FeatherIcon name='menu' size={33} color='white' style={styles.MenuIcon} />
                  </Pressable>;
                }}>
                  <Menu.Item onPress={() => navigation.navigate('DashboardScreen')} style={{ width: '100%', height: '30%', borderRadius: 5, marginBottom: 10 }}>
                    <ProjectIcon name='project' size={20} />
                    <Text style={{ fontSize: 15, fontWeight: '500' }}> Project</Text>
                  </Menu.Item>
                  <Menu.Item onPress={() => navigation.navigate('Performance')} style={{ width: '100%', height: '25%', borderRadius: 5, marginBottom: 10, }}>
                    <PerformanceIcon name='presentation' size={20} />
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>Performance</Text>
                  </Menu.Item>
                  <Menu.Item onPress={() => navigation.navigate('Message')} style={{ width: '100%', height: '25%', borderRadius: 5, marginBottom: 10 }}>
                    <MessageIcon name='message1' size={20} />
                    <Text style={{ fontSize: 15, fontWeight: '500' }}> Message</Text>
                  </Menu.Item>
                </Menu>
              </Box>
            </View>
            <View>
              <Text style={{ fontSize: 18, color: 'white', fontWeight: '700' }}>Feedback</Text>
            </View>
            <View>
                <Box>
                  <Menu trigger={triggerProps => {
                    return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                       <Image source={{ uri: `https://coralr.com/${data.image}` }} style={{ width: 35, height: 35, borderRadius: 50, backgroundColor: '#1e76ba' }} />
                    </Pressable>;
                  }}>
                    <Menu.Item onPress={() => navigation.navigate('Profile')}>
                      <ProfileIcon name='user' size={20} />
                      <Text style={{ alignItems: 'center' }}>Profile</Text>
                      {/* <Text style={{ fontSize:15, fontWeight:'500'}}> Profile</Text> */}
                    </Menu.Item>
                    <Menu.Item>
                      <FeatherIcon name='power' size={20} />
                      <TouchableOpacity onPress={LogoutHandling}>
                        <Text style={{ alignItems: 'center' }}>Logout</Text>
                      </TouchableOpacity>
                    </Menu.Item>
                  </Menu>
                </Box>
              </View>
          </View>
        </NativeBaseProvider>
      </View>
      <View style={styles.container}>
        <View style={styles.Container1}>
          <Text style={{ padding: 10, fontWeight: '700' }}>If you are encountering any problems or issues while using the app please send a message to our support team and we will contact you</Text>
          <TextInput
            style={{
              height: 200,
              textAlignVertical: 'top',
              borderColor: 'black',
              borderWidth: 0.5,
              marginBottom: 15,
              padding: 8,
              borderRadius: 5,
              borderColor: isFoucesed ? 'green' : 'blue',
            }}
            onFocus={() => setIsFoucesed(true)}
            onBlur={() => setIsFoucesed(false)}
            multiline={true}
            numberOfLines={500}
            placeholder='Send your feedback'
            value={message}
            autoFocus={true}
            onChangeText={(text) => setMessage(text)}
          />
        </View>
        <View style={styles.DocumentPickers}>
          {/* <TouchableOpacity onPress={AttachementFiles} style={{backgroundColor:'grey', width:'50%',}}>
           <View style={{flexDirection:'row',width:'100%', margin:10, gap:10,}}>
           <AttachmentIcon  name='camera' size={20} color='#fff'/>
            <Text style={{color:'white'}}>Open Camera</Text>
           </View>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={AttachementGallery} style={{ backgroundColor: '#1e76ba', width: '47%', borderRadius: 5 }}>
            <View style={{ flexDirection: 'row', width: '100%', padding: 5 }}>
              <AttachmentIcon name='attachment' size={20} color='#fff' style={styles.attachment} />
              <Text style={{ color: 'white', fontSize: 20 }}>Attachment</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <Button title='Submit' color='#1e76ba' onPress={() => { }} />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subContainer: {
    backgroundColor: '#1e76ba',
    height: 60,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  Container1: {
    width: '100%',
    padding: 20,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    minHeight: 100
  },
  DocumentPickers: {
    width: '100%',
    height: '6%',
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    columnGap: 10
  },
  attachment: {
    marginTop: 4
  }
})