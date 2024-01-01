import { View, Text, StyleSheet, TouchableOpacity, Button, ScrollView, Image,ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import LocationIcon from 'react-native-vector-icons/Ionicons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native'
const Tab = createMaterialTopTabNavigator();
import Published from './Published';
import Draft from './Draft';
import { Box, Heading, Menu, AspectRatio, Center, HStack, Stack, NativeBaseProvider, Pressable } from "native-base";
import FeatherIcon from 'react-native-vector-icons/Feather';
import ProjectIcon from 'react-native-vector-icons/Octicons'
import MessageIcon from 'react-native-vector-icons/AntDesign'
import PerformanceIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ProfileIcon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
export default function Circle104({ navigation }) {
  const [assignmentCircle, setAssignmentCircle] = useState([])
  const [assignment_moodifiedID, setAssignmentMoodifiedID] = useState(null);
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [tehsil, setTehsil] = useState(null);
  const [district, setDistrict] = useState(null);
  const [districtCode , setDistrictCode]= useState(null);
  const [locationName, setLocationName] = useState(null);
  const [tehsilCode, setTehsilCode] = useState(null);
  const [chargeCode, setChargeCode] = useState(null);
  const [latitude,setLatitude] = useState(null);
  const [longitude,setLongitude] = useState(null);
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
  const itemID = route.params?.itemID;
  const assignmentID = route.params?.asignmentID;
  console.log('assignmentID in circle 104', assignmentID)
  console.log('item id in circle 104', itemID);

  //////////
  const assignment_circleApiURL = `https://coralr.com/api/assignment-circles?assignment_id=${assignmentID}&task_id=${itemID}`;
  const fetchAssignmentCircle = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log('token in assignment circle', token)
    if (token) {
      try {
        const response = await axios.get(assignment_circleApiURL, {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          params: {
            assignment_id: assignmentID,
            task_id: itemID
          }
        })
        console.log(response.data)
        setAssignmentMoodifiedID(response.data?.assignment_modified_id);
        setAssignmentCircle(response.data?.multi_circles);
        const firstCircle = response.data?.multi_circles[0];
        if (firstCircle) {
          setProvince(firstCircle.province);
          setCity(firstCircle.city);
          setTehsil(firstCircle.tehsil);
          setDistrict(firstCircle.district)
          setDistrictCode(firstCircle.district_code)
          setLocationName(firstCircle.location_name)
          setTehsilCode(firstCircle.tehsil_code)
          setChargeCode(firstCircle.charge_code);
          setLatitude(firstCircle.lat);
          setLongitude(firstCircle.lng)
          navigation.navigate('Draft', { itemID: itemID, province: firstCircle.province, city: firstCircle.city, tehsil: firstCircle.tehsil, district:firstCircle.district, districtCode:firstCircle.district_code, locationName:firstCircle.location_name, tehsilCode:firstCircle.tehsil_code, chargeCode:firstCircle.charge_code,AssignID:assignmentID,latitude:firstCircle.lat,longitude:firstCircle.lng});
          navigation.navigate('Published', { itemID: itemID, province: firstCircle.province, city: firstCircle.city, tehsil: firstCircle.tehsil, district:firstCircle.district, districtCode:firstCircle.district_code, locationName:firstCircle.location_name, tehsilCode:firstCircle.tehsil_code, chargeCode:firstCircle.charge_code,AssignID:assignmentID,latitude:firstCircle.lat,longitude:firstCircle.lng});
        }
      } catch (error) {
        console.log('ERROR in cicle Assignment API', error.message)
      }

    }
  }
  useEffect(() => {
    fetchAssignmentCircle();
  }, [])
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
              <Text style={{ fontSize: 18, color: 'white', fontWeight: '700' }}>{assignment_moodifiedID}</Text>
            </View>
            <View>
              <Box>
                <Menu trigger={triggerProps => {
                  return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                    <Image source={{uri: `https://coralr.com/${data.image}`}} style={{ width: 35, height: 35, borderRadius: 50, backgroundColor: '#1e76ba' }} />
                  </Pressable>
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
      {
       assignmentCircle.length > 0 ? ( assignmentCircle.map((item) => {
          return (
            <View style={styles.Cards} key={item.id}>
              <TouchableOpacity onPress={() => navigation.navigate('ASN00016',)}>
                <Text style={{ fontSize: 20, color: 'white', fontWeight: '600' }}>{item.location_type}</Text>
              </TouchableOpacity>
              <View>
              </View>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '500', marginTop: 10, borderBottomWidth: 0.2, color: 'white' }}>{item.Location_path}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                <View>
                  <Text style={{ color: 'white', fontWeight: '500' }}>Total Outlet:{item.total_outlets}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <View>
                  <Text style={{ color: 'white', fontWeight: '500' }}>Outlets Completed:{item.completed_outlets}</Text>
                </View>
                <View>
                  <Text style={{ color: 'white', fontWeight: '500' }}>Outlets Terminated:0</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <View>
                  <Text style={{ color: 'white', fontWeight: '500' }}>Outlets Draft:<Text style={{ color: 'red', marginBottom: 15, fontWeight: '500', fontSize: 14 }}>0</Text></Text>
                </View>
                <View>
                  <Text style={{ color: 'white', fontWeight: '500' }}>Outlets Re-Assigned:<Text style={{ color: 'green', marginBottom: 15, fontWeight: '500', fontSize: 14 }}>{item.reassigned_outlets}</Text></Text>
                </View>
              </View>
            </View>
          )
        })
       ) : (
        <ActivityIndicator size="large" style={{marginTop:200, alignSelf:'center'}} />
       )
      }
      <Tab.Navigator
      >
        <Tab.Screen
          name='Draft'
          component={Draft}
          initialParams={{ itemID: itemID, assignment_moodifiedID:assignment_moodifiedID}}
          options={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: '500', color: 'red' }
          }}
        />
        <Tab.Screen
          name='Published'
          component={Published}
          initialParams={{ itemID: itemID, assignment_moodifiedID:assignment_moodifiedID}}
          options={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: '500', color: 'green' }
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e76ba',
    alignItems: 'center',
    width: '100%',
    height: '6%',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  Cards: {
    backgroundColor: '#6699CC',
    padding: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  CardsContainer: {
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
