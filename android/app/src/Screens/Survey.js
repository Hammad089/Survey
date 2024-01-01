import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, PermissionsAndroid, TouchableOpacity, Image, TextInput, ScrollView ,ActivityIndicator} from 'react-native';
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
import AttachmentIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../../../../firebase/config';
import { addDoc, updateDoc, doc, getDoc, collection } from "firebase/firestore";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import { useToast } from "react-native-toast-notifications";
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
  const toast = useToast();
  const Itemid = route.params?.itemId;
  const province = route.params?.Province;
  const city = route.params.City;
  const tehsil = route.params.Tehsil;
  const district = route.params.District;
  const districtCode = route.params?.DistrictCode;
  const locationName = route.params?.LocationName;
  const tehsilCode = route.params?.TehsilCode;
  const chargecode = route.params?.Chargecode;
  const assignment_moodifiedID = route.params?.assignment_moodifiedID;
  const AssignID = route.params?.AssignID;
  const latitude = route.params?.latitude;
  const longitude = route.params?.longitude
  console.log('data in Survey Form', province, city, tehsil, district, districtCode, locationName, tehsilCode, assignment_moodifiedID, AssignID, latitude, longitude)
  const [questions, setQuestions] = useState([]);
  const [location, setLocation] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [data, setData] = useState({});
  const [selectedShopType, setSelectedShopType] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [formNumber, setFormNumber] = useState(null);
  const [generalCategory, setGeneralCategory] = useState(null);
  const [geomap_Id, setGeomap_id] = useState(null);
  const [assigned_location_id, setAssigned_location_id] = useState(null);
  const [toggleCheckBox, setToggleCheckBox] = useState({})
  const [ImgUrl, setImgUrl] = useState(null);
  const [outletID, setOutletID] = useState('');
  const [fieldId, setFieldId] = useState('');
  const optiondata = [
    { label: 'Super Market', value: 'Super Market' },
    { label: 'Boutique', value: 'Boutique' },
    { label: 'Hardware', value: 'Hardware' }
  ]
  const checkBoxOption = [
    { label: 'Shoes and footwear', value: 'Shoes and footwear' },
    { label: 'Clothing', value: 'Clothing' },
    { label: 'Food', value: 'Food' },
    { label: 'Art', value: 'Art' }
  ]
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
  const AttachementFiles = async () => {
    try {
      console.log('PRESS ====>')
      const result = await launchCamera({ saveToPhotos: true });
      setImgUrl(result?.assets[0]?.uri);
      console.log('click the camera ', result)
    } catch (error) {
      console.log('Error in Launching camera', error)
    }
  }

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
  const apiURL = `https://coralr.com/api/dynamic-fields?task_id=${Itemid}&assignment_id=${AssignID}`;
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
          assignment_id: AssignID
        },
      });
      setQuestions(response.data?.data?.form);
      setFormNumber(response.data?.data?.form[0]?.form_number);
      setGeneralCategory(response.data?.data?.form[0]?.general_category_id)
      setGeomap_id(response.data.data?.geomap_id);
      setAssigned_location_id(response.data.data?.assigned_location_id)
      setFieldId(response.data?.data?.form[0]?.field_id);
    } catch (error) {
      console.log('Error in API response', error.message);
    }
  };
  console.log('survey form number', formNumber);
  console.log('survey general category id', generalCategory)
  console.log('assigned_locaation_id', assigned_location_id);
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
  const handleChangeAnswer = (index, text,) => {
    if (questions[index].field_type === 'S' || questions[index].field_type === 'M') {
      setSelectedShopType(text);
      setToggleCheckBox(text);
      setAnswers((prevAnswers) => {
        const newAnswers = [...prevAnswers];
        newAnswers[index] = text;
        return newAnswers;
      }, () => {
        // Call DraftData here after the state has been updated
        DraftData();
      });
      return;
    }

    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = text;
      return newAnswers;
    }, () => {
      // Call DraftData here after the state has been updated
      DraftData();
    });
  };
  // const handleShopTypeSelection = (selectedValue) => {
  //   console.log('Selected Shop Type:', selectedValue);
  //   setSelectedShopType(selectedValue);
  // };
  const resetField = () => {
    setAnswers(Array(questions.length).fill(''));
  };

  const StoreDataApiURL = 'https://coralr.com/api/store-data';
  const PublishData = async (answers, questions, selectedShopType, toggleCheckBox) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const data = {
        data: answers.map((answer, index) => {
          // Include checkbox value if the question is of type 'M'
          if (questions[index].field_type === 'M' && toggleCheckBox) {
            const checkboxValues = Object.keys(toggleCheckBox)
              .filter(key => toggleCheckBox[key])
              .join(', ');

            return `${answer} ${checkboxValues}`.trim(); // Append checkbox values to answer
          }
          return answer;
        }),
        shopType: selectedShopType,
        CheckBoxes: toggleCheckBox,
        // ImgUrl: ImgUrl,
        general_category_id: generalCategory,
        form_number: formNumber,
        assigned_location_id: assigned_location_id,
        geomap_id: geomap_Id,
        start_date_time: "2023-11-27 14:54:16",
        end_date_time: "2023-11-27 15:15:16",
        latitude: latitude,
        longitude: longitude,
        status: "Complete",
      };
      console.log(data)
      // Loop through questions to format data
      questions.forEach((question, index) => {
        const field_name = question.field_name || `question_${index + 1}`;
        const answer = answers[index];
        let dataForQuestion = {
          field_name: field_name,
          answer: answer,
        };

        if (question.field_type === 'S') {
          dataForQuestion.selectedShopType = selectedShopType;
        } else if (question.field_type === 'M') {
          const checkboxAnswer = Object.keys(toggleCheckBox)
            .filter(key => toggleCheckBox[key])
            .join(', '); // Concatenate selected checkbox values

          dataForQuestion.answer = `${answer} ${checkboxAnswer}`.trim(); // Append checkbox values to answer
        }
        console.log('Data for question:', dataForQuestion);
        data.data[field_name] = dataForQuestion;
      });
      resetField();
      toast.show('Survey data has successfully submit', {
        type: 'success',
        placement: 'top',
        duration: 4000,
        offset: 30,
        animationType: 'slide-in',
      });
      const response = await axios.post(StoreDataApiURL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Response from API:', response.data);
      setOutletID(response.data?.data?.outlet_id);
    } catch (error) {
      console.log('Error in API call:', error.message);
    }

  };

  const StoreImage = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('outlet in image storage', outletID);
      console.log('field id in store image', fieldId);
      console.log('Image url is in Store image api', ImgUrl)

      if (!token) {
        throw new Error('Token not available');
      }

      const formData = new FormData();
      formData.append("outlet_id", outletID);
      formData.append("field_id", fieldId);
      formData.append("image", {
        uri: ImgUrl,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const response = await fetch("https://coralr.com/api/upload-store-image", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log('Error in image upload:', error.message);
    }
  };
  useEffect(() => {
    if (outletID) {
      StoreImage(outletID);
    }
  }, [outletID]);
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
      SelectedShopType: selectedShopType,
      CheckBoxes: toggleCheckBox
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
    if (answers.length > 0) {
      DraftData();
    }
  }, [answers]);

  // const handleNextQuestion = () => {
  //   setCurrentQuestion(currentQuestion + 1);
  // };
  const handleShopTypeChange = (value) => {
    setSelectedShopType(value);
  };
  const handleCheckBox = (optionValue) => {
    setToggleCheckBox((prev) => ({
      ...prev,
      [optionValue]: !prev[optionValue]
    }))
    console.log(optionValue)
  }
  // const renderQuestion = (item, index) => {
  //   if (index === currentQuestion) {
  //     if (item.field_type === 'I' && item.field_name === 'outlet_name') {
  //       if (item.has_images === 1) {
  //         return (
  //           <>
  //             <View key={item.field_id}>
  //               <Text style={styles.label}>{item.label_text}</Text>
  //               <TextInput
  //                 style={styles.input}
  //                 value={answers[index]}
  //                 onChangeText={(text) => handleChangeAnswer(index, text)}
  //               />
  //             </View>
  //             <View style={styles.DocumentPickers} key={item.field_id}>
  //               <TouchableOpacity onPress={AttachementFiles} style={{ backgroundColor: 'grey', width: '50%', }}>
  //                 <View style={{ flexDirection: 'row', width: '100%', margin: 8, gap: 10, }}>
  //                   <AttachmentIcon name='camera' size={20} color='#fff' />
  //                   <Text style={{ color: 'white' }}>Open Camera</Text>
  //                 </View>
  //               </TouchableOpacity>
  //               <TouchableOpacity onPress={AttachementGallery} style={{ backgroundColor: '#1e76ba', width: '47%', borderRadius: 5 }}>
  //                 <View style={{ flexDirection: 'row', width: '100%', padding: 5 }}>
  //                   <AttachmentIcon name='attachment' size={20} color='#fff' style={styles.attachment} />
  //                   <Text style={{ color: 'white', fontSize: 20 }}>Attachment</Text>
  //                 </View>
  //               </TouchableOpacity>
  //             </View>
  //           </>
  //         );
  //       } else {
  //         return (
  //           <View key={item.field_id}>
  //             <Text style={styles.label}>{item.label_text}</Text>
  //             <TextInput
  //               style={styles.input}
  //               value={answers[index]}
  //               onChangeText={(text) => handleChangeAnswer(index, text)}
  //             />
  //           </View>
  //         );
  //       }
  //     }
  //     if (item.field_type === 'I' && item.field_name === 'full_address') {
  //       return (
  //         <View key={item.field_id}>
  //           <Text style={styles.label}>{item.label_text}</Text>
  //           <TextInput
  //             style={styles.input}
  //             value={answers[index]}
  //             onChangeText={(text) => handleChangeAnswer(index, text)}
  //           />
  //         </View>
  //       );
  //     }
  //     if (item.field_type === 'I' && item.field_name === 'question_4') {
  //       return (
  //         <View key={item.field_id}>
  //           <Text style={styles.label}>{item.label_text}</Text>
  //           <TextInput
  //             style={styles.input}
  //             value={answers[index]}
  //             onChangeText={(text) => handleChangeAnswer(index, text)}
  //           />
  //         </View>
  //       );
  //     }
  //     if (item.field_type === 'S' && item.field_name === 'shop_type') {
  //       return (
  //         <View key={item.field_id}>
  //           <Text style={styles.label}>{item.label_text}</Text>
  //           <RadioButtonRN
  //             data={optiondata}
  //             selectedBtn={(selectedOption) => {
  //               handleShopTypeChange(selectedOption.value);
  //               handleChangeAnswer(index, selectedOption.value);
  //             }}
  //             box={false}
  //           />
  //         </View>
  //       );
  //     }
  //     if (selectedShopType === 'Super Market' && item.field_name === 'question_1') {
  //       return (
  //         <View key={item.field_id}>
  //           <Text style={styles.label}>{item.label_text}</Text>
  //           <TextInput
  //             style={styles.input}
  //             value={answers[index]}
  //             onChangeText={(text) => handleChangeAnswer(index, text)}
  //           />
  //         </View>
  //       );
  //     }
  //     if (selectedShopType === 'Boutique' && item.field_name === 'question_2') {
  //       return (
  //         <View key={item.field_id}>
  //           <Text style={styles.label}>{item.label_text}</Text>
  //           <TextInput
  //             style={styles.input}
  //             value={answers[index]}
  //             onChangeText={(text) => handleChangeAnswer(index, text)}
  //           />
  //         </View>
  //       );
  //     }
  //     if (selectedShopType === 'Hardware' && item.field_name === 'question_3') {
  //       return (
  //         <View key={item.field_id}>
  //           <Text style={styles.label}>{item.label_text}</Text>
  //           <TextInput
  //             style={styles.input}
  //             value={answers[index]}
  //             onChangeText={(text) => handleChangeAnswer(index, text)}
  //           />
  //         </View>
  //       );
  //     }
  //     if (item.field_type === 'M') {
  //       return (
  //         <View key={item.field_id}>
  //           <Text style={styles.label}>{item.label_text}</Text>
  //           {checkBoxOption.map((option) => (
  //             <View key={option.value} style={{ flexDirection: 'row', }}>
  //               <CheckBox
  //                 disabled={false}
  //                 value={toggleCheckBox[option.value] || false}
  //                 onValueChange={() => handleCheckBox(option.value)}
  //               />
  //               <Text style={{ paddingTop: 5 }}>{option.label}</Text>
  //             </View>
  //           ))}
  //         </View>
  //       );
  //     }
  //   }
  //   return null;
  // };
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
      <ScrollView style={{ marginTop: 15 }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* <View>
            {questions.map((item, index) => renderQuestion(item, index))}
            {currentQuestion === questions.length - 1 ? (
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                <Button title='Go back' onPress={() => navigation.goBack()} color='red' />
                {questions.length > 0 && (
                  <Button title='Publish' onPress={() => PublishData(answers, questions, selectedShopType, toggleCheckBox)} />
                )}
              </View>
            ) : (
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', columnGap: 10 }}>
                {currentQuestion > 0 ? (
                  <View style={{ width: '50%', alignSelf: 'flex-end', marginTop: 15 }}>
                    <Button
                      title="Go back"
                      onPress={() => setCurrentQuestion((prev) => prev - 1)}
                      color={'grey'}
                    />
                  </View>
                ) : null}
                <View style={{ width: '50%', alignSelf: 'flex-end', marginTop: 15 }}>
                  <Button
                    title="Next"
                    onPress={handleNextQuestion}
                    disabled={currentQuestion === questions.length - 1}
                    color={'grey'}
                  />
                </View>
              </View>
            )}

          </View> */}
          {
         questions.length > 0 ?  (questions.map((item, index) => {
            if (item.field_type === 'I' && item.field_name === 'outlet_name') {
              if (item.has_images === 1) {
                return (
                  <>
                    <View key={item.field_id}>
                      <Text style={styles.label}>{item.label_text}</Text>
                      <TextInput
                        style={styles.input}
                        value={answers[index]}
                        onChangeText={(text) => handleChangeAnswer(index, text)}
                      />
                    </View>
                    <View style={styles.DocumentPickers} key={item.field_id}>
                      <TouchableOpacity onPress={AttachementFiles} style={{ backgroundColor: 'grey', width: '50%', borderRadius: 5 }}>
                        <View style={{ flexDirection: 'row', width: '100%', margin: 8, gap: 10, }}>
                          <AttachmentIcon name='camera' size={20} color='#fff' />
                          <Text style={{ color: 'white' }}>Open Camera</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={AttachementGallery} style={{ backgroundColor: '#1e76ba', width: '47%', borderRadius: 5 }}>
                        <View style={{ flexDirection: 'row', width: '100%', padding: 5 }}>
                          <AttachmentIcon name='attachment' size={20} color='#fff' style={styles.attachment} />
                          <Text style={{ color: 'white', fontSize: 20 }}>Attachment</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                );
              } else {
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
            }
            if (item.field_type === 'I' && item.field_name === 'full_address') {
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
            if (item.field_type === 'I' && item.field_name === 'question_4') {
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
            if (item.field_type === 'S' && item.field_name === 'shop_type') {
              return (
                <View key={item.field_id}>
                  <Text style={styles.label}>{item.label_text}</Text>
                  <RadioButtonRN
                    data={optiondata}
                    selectedBtn={(selectedOption) => {
                      handleShopTypeChange(selectedOption.value);
                      handleChangeAnswer(index, selectedOption.value);
                    }}
                    box={false}
                  />
                </View>
              );
            }
            // Render additional questions based on the selected shop type
            if (selectedShopType === 'Super Market' && item.field_name === 'question_1') {
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
            if (selectedShopType === 'Boutique' && item.field_name === 'question_2') {
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
            if (selectedShopType === 'Hardware' && item.field_name === 'question_3') {
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
            if (item.field_type === 'M') {
              return (
                <View key={item.field_id}>
                  <Text style={styles.label}>{item.label_text}</Text>
                  {checkBoxOption.map((option) => (
                    <View key={option.value} style={{ flexDirection: 'row', }}>
                      <CheckBox
                        disabled={false}
                        value={toggleCheckBox[option.value] || false}
                        onValueChange={() => handleCheckBox(option.value)}
                      />
                      <Text style={{ paddingTop: 5 }}>{option.label}</Text>
                    </View>
                  ))}
                </View>
              );
            }
            return null; // Render nothing if conditions don't match
          })) : (
            <ActivityIndicator size="large" style={{alignSelf:'center'}} />
          )
        }
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 10 }}>
            <Button title='Go back' onPress={() => navigation.goBack()} color='red' />
            <Button title='Publish' onPress={() => PublishData(answers, questions, selectedShopType, toggleCheckBox)} color={'green'} />
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
    color: 'black',
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
  },
  DocumentPickers: {
    width: '100%',
    height: '10%',
    marginTop: 10,
    borderRadius: 10,
    flexDirection: 'row',
    columnGap: 10,
    marginBottom: 10
  },
  attachment: {
    marginTop: 4
  }
})