import { View, Text, StyleSheet, TouchableOpacity, Button, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native'
import Inprogress from './Inprogress';
import NotStarted from './NotStarted';
import Completed from './Completed';
import { Box, Heading, Menu, AspectRatio, Center, HStack, Stack, NativeBaseProvider, Pressable } from "native-base";
import FeatherIcon from 'react-native-vector-icons/Feather';
import ProjectIcon from 'react-native-vector-icons/Octicons'
import MessageIcon from 'react-native-vector-icons/AntDesign'
import PerformanceIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ProfileIcon from 'react-native-vector-icons/FontAwesome';
import EditProfileIcon from 'react-native-vector-icons/FontAwesome5'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
const Tab = createMaterialTopTabNavigator();
export default function TestPunjab({ navigation }) {
  const [AssignmentData, setAssignmetData] = useState([]);
  const [data, setData] = useState({})
  const route = useRoute();
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
  const Itemid = route.params?.itemId;
  const Pid = route.params?.ProjectId;
  const totalAssignment = route.params?.Assignment;
  const totalOutlet = route.params?.TotalOutlet;
  const OutletsCompleted = route.params?.OutletCompleted;
  const OutletsTerminated = route.params?.outletTerminated
  console.log('outlet completed',OutletsCompleted)
  console.log('total outlet',totalOutlet);
  console.log('total assignment id',totalAssignment);
  console.log('project id',Pid);
  console.log('task id',Itemid);
  const AssignmentapiURL = `https://coralr.com/api/assignments?task_id=${Itemid}`
  const AssignmentHandling = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('token received in Assignment', token)
      const response = await axios.get(AssignmentapiURL, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        params: {
          task_id: Itemid
        },
      })
      const Assignments = response.data?.data?.assignments;
      const assignment_id = Assignments[0]?.assignment_id;
      console.log('assignment ID',assignment_id)
      console.log(Assignments[0]?.status);
      setAssignmetData(Assignments)
    } catch (error) {
      console.log('Error in API response Assignments', error.message);
    }
  }

  useEffect(() => {
    AssignmentHandling();
  }, [])


  //// logout api
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
              <Text style={{ fontSize: 18, color: 'white', fontWeight: '700' }}>{Pid}</Text>
            </View>

            <View>
              <Box>
                <Menu trigger={triggerProps => {
                  return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                    <Image source={{uri: `https://coralr.com/${data.image}`}} style={{ width: 35, height: 35, borderRadius: 50, backgroundColor: '#1e76ba' }} />
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
      {/* <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 5, color: 'white', fontSize: 18, fontWeight:'700' }}>TestPunjab</Text>
      </View> */}
      <View style={styles.cardContainer}>
        <View>
          <Text style={{ fontWeight: '700', borderBottomWidth: 0.5, borderColor: 'lightgrey', marginBottom: 10, fontSize: 14, color: 'white' }}>
            Assignment:{totalAssignment}
          </Text>
          <Text style={{ fontWeight: '500', fontSize: 14, color: 'white' }}>Total Outlet:{totalOutlet} </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <View>
              <Text style={{ color: 'white', fontWeight: '500' }}>Outlets Completed:{OutletsCompleted}</Text>
            </View>
            <View>
              <Text style={{ color: 'white', fontWeight: '500' }}>Outlets Terminated:{OutletsTerminated}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, }}>
            <View>
              <TouchableOpacity>
                <Text style={{ color: 'white', fontWeight: '500' }}>Draft:<Text style={{ color: 'red', marginBottom: 15, fontSize: 14, fontWeight: '500' }}>0</Text></Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={{ color: 'white', fontWeight: '500' }}>Published:<Text style={{ color: 'green', marginBottom: 15, fontSize: 14, fontWeight: '500' }}>0</Text></Text>
            </View>
          </View>
        </View>
      </View>
      <Tab.Navigator>
      <Tab.Screen
        name='Inprogress'
        options={{
          tabBarLabelStyle: { fontSize: 12, color:'#FFA500' },
        }}
      >
        {()=> <Inprogress AssignmentData={AssignmentData} navigation={navigation} Itemid={Itemid}  />}
        </Tab.Screen>
      <Tab.Screen
        name='NotStarted'
        options={{
          tabBarLabelStyle: { fontSize: 12, color: 'red' },
        }}
      >
        {() => <NotStarted AssignmentData={AssignmentData} navigation={navigation} Itemid={Itemid}   />}
      </Tab.Screen>
      <Tab.Screen
        name='Completed'
        options={{
          tabBarLabelStyle: { fontSize: 12, color: 'green' },
        }}
      >
        {()=> <Completed AssignmentData={AssignmentData} navigation={navigation} Itemid={Itemid}  />}
        </Tab.Screen>
    </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e76ba',
    alignItems: 'center',
    width: '100%',
    height: '5%',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  cardContainer: {
    backgroundColor: '#6699CC',
    padding: 35,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  Cards: {
    backgroundColor: 'white',
    padding: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 100 / 2,
    backgroundColor: 'darkred',
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