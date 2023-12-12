import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, PermissionsAndroid, TouchableOpacity, Image, TextInput,ScrollView } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioButtonRN from 'radio-buttons-react-native';
import Geolocation from 'react-native-geolocation-service';
import { Box, Menu, NativeBaseProvider, Pressable } from "native-base";
import FeatherIcon from 'react-native-vector-icons/Feather';
import ProjectIcon from 'react-native-vector-icons/Octicons'
import MessageIcon from 'react-native-vector-icons/AntDesign'
import PerformanceIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ProfileIcon from 'react-native-vector-icons/FontAwesome';
import { db } from '../../../../firebase/config';
import {  addDoc, updateDoc, doc, getDoc, collection   } from "firebase/firestore";
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};
export default function Survey({ navigation }) {
  const route = useRoute();
  const Itemid = route.params?.itemId;
  const province = route.params?.Province;
  const city = route.params.City;
  const tehsil = route.params.Tehsil;
  const district = route.params.District;
  const districtCode = route.params?.DistrictCode;
  const locationName = route.params?.LocationName;
  const tehsilCode = route.params?.TehsilCode;
  const chargecode = route.params?.Chargecode;
  const assignment_moodifiedID = route.params?.assignment_moodifiedID
  console.log('data in Survey Form', province, city, tehsil, district, districtCode, locationName, tehsilCode, assignment_moodifiedID)
  const [questions, setQuestions] = useState([]);
  const [location, setLocation] = useState(null);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [data, setData] = useState({});
  const [selectedShopType,setSelectedShopType] = useState('');
  const [documentId, setDocumentId] = useState(null);
  const optiondata = [
    { label: 'Super Market', value:'Super Market' },
    { label: 'Boutique', value: 'Boutique'},
    { label: 'Hardware', value: 'Hardware'}
  ]

  const ProfileapiURL = 'https://coralr.com/api/profile';
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.post(ProfileapiURL, {}, {
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
  useEffect(() => {
    const getLocation = () => {
      const result = requestLocationPermission();
      result.then(res => {
        console.log('res is:', res);
        if (res) {
          Geolocation.getCurrentPosition(
            position => {
              console.log(position);
              setLocation(position);
            },
            error => {
              // See error code charts below.
              console.log(error.code, error.message);
              setLocation(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        }
      });
      console.log(location);
    };
    getLocation()
  }, [])
  const apiURL = `https://coralr.com/api/dynamic-fields?task_id=${Itemid}`;
  const fetchQuestion = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('token in survey form', token);
      const response = await axios.get(apiURL, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          task_id: Itemid,
        },
      });
      setQuestions(response.data?.data?.form);
    } catch (error) {
      console.log('Error in API response', error.message);
    }
  };
  useEffect(() => {
    fetchQuestion();
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
  const handleChangeAnswer = (index, text) => {
    const newAnswers = [...answers];
    newAnswers[index] = text;
    setAnswers(newAnswers);
  }
  const resetField = () => {
    setAnswers(Array(questions.length).fill(''));
  }
    const StoreDataApiURL = 'https://coralr.com/api/store-data';
  const PublishData = async() => {
    try {
      const token = await AsyncStorage.getItem('token');
      const data = new FormData();
      data.append('token', token);
    data.append('general_category_id', '1');
    data.append('form_number', '1');
    data.append('assigned_location_id', '1');
    data.append('geomap_id', '23');
    data.append('data', `${answers}`);
    data.append('start_date_time', '2023-11-27 14:54:16');
    data.append('end_date_time', '2023-11-27 15:15:16');
    data.append('latitude', '30.892846674000054');
    data.append('longitude', '74.05111545700004');
    data.append('status', 'Complete');
      questions.forEach((question, index) => {
        const questionText = question.label_text;
        const answer = answers[index];
        const field_name = question.field_name || `question_${index + 1}`; // Use field_name if available, otherwise create a default one
      const combined = `${field_name}:|${answer}`;
      console.log('combined answer', combined);
      data.append(field_name,questionText, combined);
      })
      resetField();
      const response = await axios.post(StoreDataApiURL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', 
        },
      });
      console.log('Response from API:', response.data);
    } catch (error) {
      console.log('Error in API call:', error.message);
    }
  }
  
  useEffect(() => {
    setAnswers(Array(questions.length).fill(''));
  }, [questions]);
  ///Draft Data 
  const DraftData = async () => {
    if (questions.length === 0) {
      console.error('Questions array is empty. Fetch or set questions before calling DraftData.');
      return;
    }

    // Check if answers array is properly initialized
    if (answers.some(answer => answer === undefined || answer === null)) {
      console.error('Answers array is not properly initialized.');
      return;
    }

    const surveyData = {
      Questions: questions,
      Location: location,
      Answer: answers,
      SelectedShopType: selectedShopType
    };

    if (!documentId) {
      const docRef = await addDoc(collection(db, "Survey-data"), surveyData);
      setDocumentId(docRef.id);
      console.log("Document written with ID: ", docRef.id);
    } else {
      const surveyDocRef = doc(db, "Survey-data", documentId);
      const docSnapshot = await getDoc(surveyDocRef);

      if (docSnapshot.exists()) {
        await updateDoc(surveyDocRef, surveyData);
        console.log("Document updated with ID: ", documentId);
      } else {
        console.error("Document does not exist with ID: ", documentId);
      }
    }
  };

  useEffect(() => {
    DraftData();
  }, [answers]);


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
                    <Image source={{ uri: `https://coralr.com/${data.image}` }} style={{ width: 35, height: 35, borderRadius: 50, backgroundColor: '#1e76ba' }} />
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
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', }}>
          <Text style={{ fontWeight: '700', fontSize: 20, color: 'blue' }}>Province:</Text>
          <Text style={{ marginLeft: 50, marginTop: 5 }}>{province}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontWeight: '700', fontSize: 20, color: 'blue' }}>Latitude:</Text>
          <Text style={{ marginLeft: 54 }}>{location ? location.coords.latitude : null}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontWeight: '700', fontSize: 20, color: 'blue' }}>Longitude:</Text>
          <Text style={{ marginLeft: 35 }}>{location ? location.coords.longitude : null}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontWeight: '700', fontSize: 20, color: 'blue' }}>District</Text>
          <Text style={{ marginLeft: 70 }}>{district}({districtCode})</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontWeight: '700', fontSize: 20, color: 'blue' }}>Interviewer</Text>
          <Text style={{ marginLeft: 40 }}>{data.name}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontWeight: '700', fontSize: 20, color: 'blue' }}>Tehsil:</Text>
          <Text style={{ marginLeft: 70 }}>{tehsil}({tehsilCode})</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontWeight: '700', fontSize: 20, color: 'blue' }}>Charge:</Text>
          <Text style={{ marginLeft: 75 }}>{chargecode}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontWeight: '700', fontSize: 20, color: 'blue' }}>Circle:</Text>
          <Text style={{ marginLeft: 85 }}>{locationName}</Text>
        </View>
      </View>
      <ScrollView style={{marginTop:15}} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
      {questions.map((item, index) => {
         if (item.label_text === 'Shop Name') {
          return (
            <View key={item.field_id}>
              <Text style={styles.label}>{item.label_text}</Text>
              <TextInput
                style={styles.input}
                value={answers[index]}
                onChangeText={(text) => handleChangeAnswer(index, text)}
              />
            </View>
          );
        }
        if (item.label_text === 'Shop Address') {
          return (
            <View key={item.field_id}>
              <Text style={styles.label}>{item.label_text}</Text>
              <TextInput
                style={styles.input}
                value={answers[index]}
                onChangeText={(text) => handleChangeAnswer(index, text)}
              />
            </View>
          );
        }
        if (item.label_text === 'Shop Owner Name') {
          return (
            <View key={item.field_id}>
              <Text style={styles.label}>{item.label_text}</Text>
              <TextInput
                style={styles.input}
                value={answers[index]}
                onChangeText={(text) => handleChangeAnswer(index, text)}
              />
            </View>
          );
        }
    if (item.label_text === 'Shop Type') {
      return (
        <View key={item.field_id}>
          <Text style={styles.label}>{item.label_text}</Text>
          <RadioButtonRN
            data={optiondata}
            selectedBtn={(Values) => {
              console.log('Selected Shop Type:', Values.value);
              setSelectedShopType(Values.value);
            }}
            box={false}
          />
        </View>
      );
    }
    // Render additional questions based on the selected shop type
    if (selectedShopType === 'Super Market' && item.label_text === 'Do you have cold drinks?') {
      return (
        <View key={item.field_id}>
          <Text style={styles.label}>{item.label_text}</Text>
          <TextInput
            style={styles.input}
            value={answers[index]}
            onChangeText={(text) => handleChangeAnswer(index, text)}
          />
        </View>
      );
    }

    if (selectedShopType === 'Boutique' && item.label_text === 'Do you have fashionable clothes') {
      return (
        <View key={item.field_id}>
          <Text style={styles.label}>{item.label_text}</Text>
          <TextInput
            style={styles.input}
            value={answers[index]}
            onChangeText={(text) => handleChangeAnswer(index, text)}
          />
        </View>
      );
    }

    if (selectedShopType === 'Hardware' && item.label_text === 'Do you have household hardware') {
      return (
        <View key={item.field_id}>
          <Text style={styles.label}>{item.label_text}</Text>
          <TextInput
            style={styles.input}
            value={answers[index]}
            onChangeText={(text) => handleChangeAnswer(index, text)}
          />
        </View>
      );
    }

    return null; // Render nothing if conditions don't match
  })}
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <Button title='Go back' onPress={()=>navigation.goBack()}  color='red' />
          <Button title='Save as Published' onPress={PublishData} color='green' />
        </View>
      </View>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    padding: 15,
    marginTop: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
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
  },
  input: {
    width: '100%',
    height: 40,
    color:'black',
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,

  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold'
  }
})
