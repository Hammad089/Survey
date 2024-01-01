import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, BackHandler,ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
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
export default function DashboardScreen({ navigation }) {
  const [DashboardData, setDashboardData] = useState([]);
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
///Dashboard API
const apiURLDashboard = 'https://coralr.com/api/assigned-categories'
const DashboardHandling = async() =>{
    try {
      const DashboardToken= await AsyncStorage.getItem('token');
      // console.log('token received in Dashboard', DashboardToken);
      if(DashboardToken) {
        const response = await axios.get(apiURLDashboard,{
          headers:{
            "Authorization" :`Bearer ${DashboardToken}`
          }
        })
        const categories = response.data?.data?.categories
        
       if(categories) {
        setDashboardData(categories)
       }
       else {
        console.log('No categories found')
       }
      }
      else {
        console.log('Error Handling in Dashboard')
      }
    } catch (error) {
       console.log('Error in Dashboard API', error.message)
    }
}
useEffect(()=>{
  DashboardHandling();
},[])
const checkLoginStatus = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      navigation.navigate('DashboardScreen');
    }
  } catch (error) {
    console.error('Error checking login status:', error);
  }
};
useEffect(()=>{
  checkLoginStatus();
  const backHandler = BackHandler.addEventListener('hardwarePressBack' , ()=> {
    BackHandler.exitApp();
    return true
  })
},[])
///logout api
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
      <ScrollView showsVerticalScrollIndicator={false}>
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
                <Text style={{ fontSize: 18, color: 'white', fontWeight: '700' }}>Projects</Text>
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
        {DashboardData.length > 0 ?  ( DashboardData.map((item) => (
          <View style={styles.cardContainer} key={item.id}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Test-Punjab', { itemId: item.id,ProjectId: item.p_id,Assignment:item.total_assignments,TotalOutlet:item.total_outlets,OutletCompleted:item.completed_outlets, outletTerminated:item.noncooperative_outlets,});
              }}
            >
              <Text style={{color:'blue', fontSize:14,fontWeight:'700'}}>{item.p_id}</Text>
              <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 20 }}>{item.name}</Text>
            </TouchableOpacity>
            <View>
              <Text style={{ borderBottomWidth: 0.5, borderColor: 'lightgrey', fontWeight: '700', marginBottom: 10, fontSize: 14 }}>
                Start Date: {item.start_date}
              </Text>
              <Text style={{ fontWeight: '500', borderBottomWidth: 0.5, borderColor: 'lightgrey', marginBottom: 10, fontSize: 14 }}>
                Assignment: {item.total_assignments}
              </Text>
              <Text style={{ fontWeight: '500', fontSize: 14 }}>Total Outlet: {item.total_outlets}</Text>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <View>
                  <Text>Outlets Completed:<Text style={{ color: 'green', marginBottom: 15, fontWeight: '500', fontSize: 14 }}>{item.completed_outlets}</Text> </Text>
                </View>
                <View>
                  <Text>Outlets Terminated:<Text style={{ color: 'green', marginBottom: 15, fontWeight: '500', fontSize: 14 }} >{item.noncooperative_outlets}</Text></Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                <View>
                  <TouchableOpacity>
                    <Text>Draft:<Text style={{ color: 'red', marginBottom: 15, fontWeight: '500', fontSize: 14 }}>0</Text></Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text>Published:<Text style={{ color: 'green', marginBottom: 15, fontWeight: '500', fontSize: 14 }}>0</Text></Text>
                </View>
              </View>
            </View>
          </View>
        ))): <ActivityIndicator size="large" style={{marginTop:250, alignSelf:'center'}} />
      } 
      </ScrollView>

    </>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 0,
    backgroundColor: '#1e76ba',
    marginTop: 20,
    width: '100%',
    height: '8%',
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
    marginTop: 20,
    backgroundColor: 'white',
    padding: 35,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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