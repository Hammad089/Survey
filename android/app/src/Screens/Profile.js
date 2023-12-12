import { View, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import { Box, Heading, Menu, AspectRatio, Text, Center, HStack, Stack, NativeBaseProvider, Pressable } from "native-base";
import React, { useState, useEffect } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather'
import ProjectIcon from 'react-native-vector-icons/Octicons'
import MessageIcon from 'react-native-vector-icons/AntDesign'
import PerformanceIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ProfileIcon from 'react-native-vector-icons/FontAwesome';
import EditProfileIcon from 'react-native-vector-icons/FontAwesome5'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PlusIcon from 'react-native-vector-icons/AntDesign';
import { launchImageLibrary } from 'react-native-image-picker';
import { useToast } from "react-native-toast-notifications";
import { useRoute } from '@react-navigation/native';
export default function Profile({ navigation }) {
  const [ImgUrl, setImgUrl] = useState(null);
  const [data, setData] = useState({})
  const toast = useToast();
  // profile api
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

  //update image
  const updateImage = async () => {
    try {
      console.log('=====> press');
      const options = {
        mediaType: 'photo',
      };
      const result = await launchImageLibrary(options);
      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        uploadImage(imageUri);
        setImgUrl(imageUri);
      }
  
      console.log('click the Image Gallery ', result);
    } catch (error) {
      console.log('Error in Launching gallery', error);
    }
  };
  
  const uploadImage = async (imageUri) => {
    const token = await AsyncStorage.getItem('token'); 
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
  
      const response = await axios.post('https://coralr.com/api/upload-image', formData, config);
      if (response.status === 200) {
        toast.show('Image uploaded successfully.', {
          type:'success',
          placement:'top',
          duration:4000,
          offset: 30,
          animationType: "slide-in",                            
        });
        // Handle success, e.g., show a success message or update your UI.
      } else {
        console.log('Image upload failed.');
        // Handle error cases here.
      }
    } catch (error) {
      toast.show('Failed to upload the image',{
        type:'danger',
        placement:'top',
        duration:4000,
        offset:30,
        animationType:'zoom-in'
      }, error.message);
    }
  };
  const LogoutapiURL = 'https://coralr.com/api/logout';
  const LogoutHandling = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token received in Dashboard logout functionality', token);
      if (token) {
        const response = await axios.post(LogoutapiURL, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
        if (response.data.status === 'success') {
          await AsyncStorage.removeItem('token');
          console.log('Logout successful');
          navigation.navigate('Login')
        } else {
          console.log('Logout failed');
        }
      } else {
        console.log('Token not found, cannot logout');
      }
    } catch (error) {
      console.log('API response Error', error);
    }
  }
  return (
    // navbar start
    <>
      <View style={style.subContainer}>
        <NativeBaseProvider>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <View>
              <Box>
                <Menu trigger={triggerProps => {
                  return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                    <FeatherIcon name='menu' size={33} color='white' style={style.MenuIcon} />
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
              <Text style={{ fontSize: 18, color: 'white', fontWeight: '700' }}>Profile</Text>
            </View>
            <View>
                <Box>
                  <Menu trigger={triggerProps => {
                    return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                     <Image source={{ uri: `https://coralr.com/${data.image}` }} style={{ width: 35, height: 35, borderRadius: 50, backgroundColor: '#1e76ba' }} />
                    </Pressable>;
                  }}>
                    <Menu.Item  onPress={()=>navigation.navigate('DashboardScreen', {profileImage:data.image})}>
                      <ProfileIcon name='dashboard' size={20} />
                      <Text style={{ alignItems: 'center' }}>Dashboard</Text>
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
      {/* navbar end */}
      <View style={style.container}>
        <NativeBaseProvider>
          <SafeAreaView style={{ backgroundColor: 'f6f6f6', }}>
            <View style={style.containers}>
              <View style={style.Profile}>
                <Image source={{ uri: `https://coralr.com/${data.image}` }} alt='Profie Picture' style={style.ProfileAvatar} />
                <TouchableOpacity onPress={updateImage}>
                <View style={{position:'relative', bottom:15,left:20}}>
                <PlusIcon name='plus' size={30} />
                </View>
                </TouchableOpacity>
                <Text style={style.ProfileText}>{data.name}</Text>
                <Text style={style.ProfileEmail}>{data.email}</Text>
                <Text>Aud-0000{data.id}</Text>
                <Text style={{ color: 'blue' }}>Operational Since{data.operational}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                  <View style={style.ProfileAction}>
                    <Text style={style.EditProfile}>Update password</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </NativeBaseProvider>
      </View>

    </>

  )
}

const style = StyleSheet.create({
  containers: {
    flex: 0,
    paddingVertical: 48,
    justifyContent: 'center',
    margin: 25,
  },
  ProfileAvatar: {
    height: 60,
    width: 60,
    borderRadius: 9999
  },
  Profile: {
    padding: 16,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  ProfileText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 13,
    color: '#090909',

  },
  ProfileEmail: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '400',
    color: '#848484'
  },
  ProfileAction: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 10,
  },
  IconStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    rowGap: 10
  },
  EditProfile: {
    marginRight: 10,
    fontWeight: '400',
    fontSize: 15,
    color: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,

  },
  ImageAvatar: {
    height: 40,
    width: 40,
    borderRadius: 5,
  },
  MenuIcon: {
    position: 'relative',
    bottom: 2
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
  }
})