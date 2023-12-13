import { View, StyleSheet, Image, Text, TextInput, Button, TouchableOpacity, Alert } from 'react-native'
import React, { useState,useEffect } from 'react'
import { Box, Heading, Menu, AspectRatio, Center, HStack, Stack, NativeBaseProvider, Pressable } from "native-base";
import FeatherIcon from 'react-native-vector-icons/Feather'
import ProjectIcon from 'react-native-vector-icons/Octicons'
import MessageIcon from 'react-native-vector-icons/AntDesign'
import PerformanceIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ProfileIcon from 'react-native-vector-icons/FontAwesome';
import EditProfileIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from "react-native-toast-notifications";
import axios from 'axios';
export default function Setting({ navigation }) {
  const [oldPassword, setOldPassword] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [updatePassword, setUpdatePassword] = useState('')
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
  ////logout api
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

//////// password reset api
  const updatePasswordapiURL = 'https://coralr.com/api/password-reset';

  const updatePasswordHandling = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log(token);

    if (token) {
      try {
        const formData = new FormData();
        formData.append('old_password', oldPassword);
        formData.append('new_password', new_password);

        const response = await axios.post(updatePasswordapiURL, formData, {
          headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });

        if (response.data, status === 'success') {
          console.log('Response data:', response.data);
          setUpdatePassword(response.data);
          toast.show('Your password has been successfully update',{
            type:'success',
            placement: "top",
            duration: 4000,
            offset: 70,
            animationType: "zoom-in",
          });
        }
      } catch (error) {
        toast.show('Error in update password',{
          type:'danger',
          duration:4000,
          placement:'top',
          offset:70,
          animationType:'zoom-in'
        })
        if (error.response) {
          console.log('Response status:', error.response.status);
          console.log('Response data:', error.response.data);
        }
      }
    }
  };


  return (
    // navbar start
    <>
      <NativeBaseProvider>
        <View style={style.subContainer}>
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
              <Text style={{ fontSize: 18, color: 'white', fontWeight: '700' }}>Setting</Text>
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
        </View>
      {/* navbar end */}
        <View style={style.container}>
          <View style={style.formContainer}>
            <View style={style.formContent}>
            <Image source={{ uri: `https://coralr.com/${data.image}` }} style={style.IconAvatar} />
              <Text style={style.Label}>Old Password</Text>
              <TextInput
                style={style.input}
                placeholder='old password'
                secureTextEntry={true}
                value={oldPassword}
                onChangeText={(text) => setOldPassword(text)}
              />
              <Text style={style.Label}>New Password</Text>
              <TextInput
                style={style.input}
                placeholder='Change Password'
                secureTextEntry={true}
                value={new_password}
                onChangeText={(text) => setNewPassword(text)}
              />
              <Button title='Update' color='#1e76ba' onPress={updatePasswordHandling} />
            </View>
          </View>
        </View>
      </NativeBaseProvider>
    </>
  )
}



const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',

  },
  formContent: {

    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.30,
    elevation: 7,
    shadowRadius: 4,
  },
  IconAvatar: {
    alignSelf: 'center',
    height: 60,
    width: 60,
    borderRadius: 9999,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5
  },
  Label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold'
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
});