import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Box, Heading, Menu, AspectRatio, Center, HStack, Stack, NativeBaseProvider, Pressable } from "native-base";
import React, { useState,useEffect } from 'react'
import FeatherIcon from 'react-native-vector-icons/Feather';
import ProjectIcon from 'react-native-vector-icons/Octicons'
import MessageIcon from 'react-native-vector-icons/AntDesign'
import PerformanceIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ProfileIcon from 'react-native-vector-icons/FontAwesome';
import EditProfileIcon from 'react-native-vector-icons/FontAwesome5'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function PerfomanceScreen({ navigation }) {
    const [isActiveMonth, setIsActiveMonth] = useState(true);
    const [value, setValue] = useState(0);
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

    const handleMonthClick = () => {
        setIsActiveMonth(true)
        setValue(0)
    }
    const handleYearClick = () => {
        setIsActiveMonth(false)
        setValue(1)
    }
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
                            <Text style={{ fontSize: 18, color: 'white', fontWeight: '700' }}>Performance</Text>
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
                <View style={styles.container1}>
                    <View style={styles.rectangle}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                            <TouchableOpacity onPress={handleMonthClick} style={{ width: '50%', backgroundColor: isActiveMonth ? 'blue' : 'white', }}>
                                <View>
                                    <Text style={{ color: isActiveMonth ? 'white' : 'black', textAlign: 'center' }}>Month</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleYearClick} style={{ width: '50%', backgroundColor: isActiveMonth ? 'white' : 'blue', }}>
                                <View>
                                    <Text style={{ color: isActiveMonth ? 'black' : 'white', textAlign: 'center' }}>Year</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View>
                            <Text>Outlets Complete {'\n'} this Month</Text>
                        </View>
                        <View style={styles.verticalLine}></View>
                        <View>
                            <Text style={{ textAlign: 'left' }}>Time spent on {'\n'} the Outlets</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                        <View>
                            <Text style={{ fontSize: 15, color: 'green', fontWeight: '700' }}>{value}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 15, color: 'blue', fontWeight: '700' }}>00 hrs 00 mins</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.container2}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 6 }}>
                        <View>
                            <Text>Reassigned</Text>
                        </View>
                        <View>
                            <Text style={{ alignSelf: 'center', paddingLeft: 22 }}>Draft</Text>
                        </View>
                        <View>
                            <Text>Non-Cooperative</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View>
                            <Text>0</Text>
                        </View>
                        <View>
                            <Text>0</Text>
                        </View>
                        <View>
                            <Text>{value}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.container3}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 0.2 }}>
                        <View>
                            <Text style={{ color: 'blue', fontWeight: '700' }}>Month</Text>
                        </View>
                        <View>
                            <Text style={{ color: 'blue', fontWeight: '700' }}>Outlets</Text>
                        </View>
                        <View>
                            <Text style={{ color: 'blue', fontWeight: '700' }}>Time Spent</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 0.2 }}>
                        <View>
                            <Text>May 2020</Text>
                        </View>
                        <View>
                            <Text>1</Text>
                        </View>
                        <View>
                            <Text>00 hrs 01 mins</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 0.2 }}>
                        <View>
                            <Text>May 2020</Text>
                        </View>
                        <View>
                            <Text>1</Text>
                        </View>
                        <View>
                            <Text>00 hrs 01 mins</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 0.2 }}>
                        <View>
                            <Text>May 2020</Text>
                        </View>
                        <View>
                            <Text>1</Text>
                        </View>
                        <View>
                            <Text>00 hrs 01 mins</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 0.2 }}>
                        <View>
                            <Text>May 2020</Text>
                        </View>
                        <View>
                            <Text>1</Text>
                        </View>
                        <View>
                            <Text>00 hrs 01 mins</Text>
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20
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
    container1: {
        width: '100%',
        height: '30%',
        marginTop: 20,
        padding: 20,
        backgroundColor: 'white',
        shadowColor: 'black',
        borderRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5
    },
    verticalLine: {
        height: '350%',
        width: 1,
        backgroundColor: '#909090',
    },
    container2: {
        width: '100%',
        height: '10%',
        marginTop: 10,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5
    },
    container3: {
        width: '100%',
        height: '40%',
        marginTop: 20,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5
    },
    rectangle: {
        width: 70 * 2,
        height: 20,
        borderLeftWidth: 0.2,
        borderRightWidth: 0.2,
        borderBottomWidth: 0.2,
        borderTopWidth: 0.2,
        alignSelf: 'center',
        marginBottom: 10
    }
})