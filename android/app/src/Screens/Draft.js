import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, Button, Alert,ScrollView,RefreshControl,ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { collection, getDocs, doc, deleteDoc, } from 'firebase/firestore';
import { db } from "../../../../firebase/config";
import FeatherIcon from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from "react-native-raw-bottom-sheet";
export default function Draft({ navigation, route }) {
    const RBSheetRef = useRef();
    const { itemID, province, city, tehsil, district, districtCode, locationName, tehsilCode, chargeCode, assignment_moodifiedID,AssignID,latitude,longitude } = route.params;
    console.log('data from circle 104', province, city, tehsil, district, districtCode, locationName, chargeCode, assignment_moodifiedID,AssignID,latitude,longitude);
    const config = {
        dependencies: {
            'linear-gradient': LinearGradient
        }
    };
    const [formData, setFormData] = useState([]);
    const [selectedOutletData, setSelectedOutletData] = useState(null);
    const [refreshing,setRefreshing] = useState(false)

   const onRefresh = ()=>{
    setRefreshing(true);
    fetchData();
    setTimeout(()=>{
        setRefreshing(false);
    },2000)
   }
    // Fetching data
            const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Survey-data'));
                const docs = [];
                querySnapshot.forEach((doc) => {
                    docs.push({ id: doc.id, ...doc.data() });
                });
                setFormData(docs);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };
      useEffect(()=>{
        fetchData();
      },[])

    const openRbsheet = (item) => {
        setSelectedOutletData(item);
        RBSheetRef.current.open();
    }

    const closeRbsheet = () => {
        setSelectedOutletData(null);
        RBSheetRef.current.close();
    }
    const DeleteHandler = (id) => {
        deleteDocument(id);
        const ShowAlert = () => {
            Alert.alert(
                'Delete Draft Data',
                'Draft Data Sucessfully Deleted in Draft',
                [
                    {
                        text: 'ok',
                        style: 'cancel'
                    },
                ],
                {
                    cancelable: true,
                    onDismiss: () =>
                        Alert.alert(
                            'This alert was dismissed by tapping outside of the alert dialog.',
                        ),
                }
            )
        }
        ShowAlert();
    }

    const renderQuestionAndAnswer = (selectedShopType, selectedOutletData,) => {
        let questionIndex = null;

        switch (selectedShopType) {
            case 'Boutique':
                questionIndex = 4;
                break;
            case 'Hardware':
                questionIndex = 5;
                break;
            case 'Super Market':
                questionIndex = 3;
                break;
            default:
                break;
        }
        if (selectedOutletData.groupValues) {
            switch (selectedOutletData.groupValues) {
                case 'Shoes and footwear':
                    questionIndex = 0;
                    break;
                case 'Clothing':
                    questionIndex = 1;
                    break;
                case 'Food':
                    questionIndex = 2;
                    break;
                case 'Art':
                    questionIndex = 3;
                    break;
                default:
                    break;
            }
        }
       
        if (questionIndex !== null) {
            return (
                <>
                    <View style={{ flexDirection: 'row', columnGap: 15, marginTop: 10 }}>
                        <Text style={{ fontWeight: '700' }}>Question:</Text>
                        <Text style={{ fontSize: 14 }}>{selectedOutletData.Questions[questionIndex]?.label_text}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', columnGap: 15 }}>
                        <Text style={{ fontWeight: '700' }}>Answer:</Text>
                        <Text style={{ fontSize: 14 }}>{selectedOutletData.Answer[questionIndex]}</Text>
                    </View>
                </>
            );
        }

        return null;
    };
    const renderOutletData = () => {
        if (selectedOutletData) {
            return (
                <View style={styles.CardContainer}>
                    <View style={{ flexDirection: 'row', columnGap: 15 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700' }}>Question</Text>
                        <Text style={{ fontSize: 14, fontWeight: '700' }}>{selectedOutletData.Questions[0]?.label_text}</Text>
                    </View>
                    <Text>Answer: {selectedOutletData.Answer[0]}</Text>
                    <View style={{ flexDirection: 'row', columnGap: 15 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700' }}>Question</Text>
                        <Text style={{ fontSize: 14, fontWeight: '700' }}>{selectedOutletData.Questions[1]?.label_text}</Text>
                    </View>
                    <Text>Answer: {selectedOutletData.Answer[1]}</Text>
                    <View style={{ flexDirection: 'row', columnGap: 15 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700' }}>Question</Text>
                        <Text style={{ fontSize: 14, fontWeight: '700' }}>{selectedOutletData.Questions[2]?.label_text}</Text>
                    </View>
                    {
                        selectedOutletData.SelectedShopType === null ? (
                            <Text>Answer: {selectedOutletData.groupValues}</Text>
                        ): (
                            <Text>Answer: {selectedOutletData.SelectedShopType}</Text>
                        )
                    }

                    {
                        renderQuestionAndAnswer(selectedOutletData.SelectedShopType, selectedOutletData)
                    }
                    <View style={{ flexDirection: 'row', columnGap: 15 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700' }}>Question</Text>
                        <Text style={{ fontSize: 14, fontWeight: '700' }}>{selectedOutletData.Questions[6]?.label_text}</Text>
                    </View>
                    <Text>Answer: {selectedOutletData.Answer[6]}</Text>
                </View>
            );
        }
        return null;
    }


    const deleteDocument = async (docId) => {
        try {
            const documentRef = doc(db, 'Survey-data', docId)
            await deleteDoc(documentRef);
            console.log('Survey deleted');
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    }

    return (
        <>
            <View style={styles.container}>
                {/* Render data in table */}
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}
                style={{flex:1}}
                 />}>
                <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>Outlet Name</Text>
                    <Text style={styles.headerText}></Text>

                </View>
                {
                  formData.length > 0 ? (formData.map((item, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCell}>{item.Answer[0]}</Text>
                            <TouchableOpacity>
                                <View style={{ flexDirection: 'row', columnGap: 10 }}>
                                    <Text><MaterialIcons name="delete" size={20} onPress={() => DeleteHandler(item.id)} /></Text>
                                    <Text><FeatherIcon name="edit" size={20} onPress={() => navigation.navigate('EditSurvey', { surveyId: item.id, itemid: itemID, assignment_moodifiedID: assignment_moodifiedID, province: province, city: city, tehsil: tehsil, district: district, districtCode: districtCode, locationName: locationName, tehsilCode: tehsilCode, chargeCode: chargeCode })} /></Text>
                                    <Text><MaterialIcons name='eye' size={20} onPress={() => openRbsheet(item)} /></Text>
                                </View>
                            </TouchableOpacity>
                            <RBSheet
                                ref={RBSheetRef}
                                closeOnDragDown={true}
                                closeOnPressMask={true}
                                customStyles={{
                                    container: {
                                        height: '100%'
                                    },
                                    wrapper: {
                                        backgroundColor: 'transparent',
                                        shadowColor: 'black',
                                        shadowOffset: {
                                            width: 0,
                                            height: 2
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 6,
                                        elevation: 5
                                    },
                                    draggableIcon: {
                                        backgroundColor: '#000',
                                    },
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
                                    <View>
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={() => {
                                            closeRbsheet()
                                        }}>
                                            <Text style={{ color: 'blue' }}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {/* Show outlet data in RBSheet */}
                                {renderOutletData()}
                            </RBSheet>
                        </View>
                    ))
                  ):(
                    <ActivityIndicator size="large" style={{marginTop:200, alignSelf:'center'}} />
                  )
                }
                </ScrollView>
            </View>
            <View>
                <Button title="Start New Survey" color='#39b24a' onPress={() => navigation.navigate('Survey', { itemId: itemID, Province: province, City: city, District: district, Tehsil: tehsil, DistrictCode: districtCode, LocationName: locationName, TehsilCode: tehsilCode, Chargecode: chargeCode, assignment_moodifiedID: assignment_moodifiedID,latitude:latitude,longitude:longitude, AssignID:AssignID})} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingBottom: 8,
    },
    headerText: {
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingBottom: 8,
        paddingTop: 8,
    },
    tableCell: {
        flex: 1,
        fontSize: 15,
        color: 'black',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginBottom: 20,
        alignSelf: 'flex-end',
        width: '50%'
    },
    CardContainer: {
        backgroundColor: 'white',
        padding: 20,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5
    }
});
