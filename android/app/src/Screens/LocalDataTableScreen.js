import React, { useEffect, useState } from "react";
import { View,  StyleSheet,Image, Text, TouchableOpacity, Button , Alert} from 'react-native';
import { Box,Menu,NativeBaseProvider, Pressable} from "native-base";
import LinearGradient from 'react-native-linear-gradient';
import { collection, getDocs , doc, deleteDoc,} from 'firebase/firestore';
import { db } from "../../../../firebase/config";
import FeatherIcon from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default LocalDataTableScreen = ({ navigation }) => {
    const config = {
        dependencies: {
          'linear-gradient': LinearGradient
        }
      };
    const [formData, setFormData] = useState([]);

    const deleteDoucment = async(docId) => {
        try {
            const documentRef = doc(db, 'Survey-data', docId)
            await deleteDoc(documentRef);
           console.log('survey deleted')
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Survey-data'));
                const docs = [];
                querySnapshot.forEach((doc) => {
                    docs.push({id: doc.id, ...doc.data()});
                });
                setFormData(docs);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
 
    const DeleteHandler = (id) => {
        deleteDoucment(id);
        const ShowAlert =() => {
            Alert.alert(
             'Delete Draft Data',
             'Draft Data Sucessfully Deleted in Draft',
             [
                 {
                     text:'ok',
                     style:'cancel'
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
        navigation.navigate('Dashboard')
    }

    return (
        <>
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button title='Add new Survey' color='#39b24a' onPress={() => navigation.navigate('Survey')} />
            </View>
            <View style={styles.tableHeader}>
                <Text style={styles.headerText}>SP Name</Text>
                <Text style={styles.headerText}>Auditor Name</Text>
                <Text style={styles.headerText}>Region</Text>
                <Text style={styles.headerText}>Action</Text>
            </View>
            {
                formData.map((item, index) => (
                    <View style={styles.tableRow} key={index}>
                        {/* <Text style={styles.tableCell}>{item.id}</Text> */}
                        <Text style={styles.tableCell}>{item.SupervisorName}</Text>
                        <Text style={styles.tableCell}>{item.AuditorName}</Text>
                        <Text style={styles.tableCell}>{item.Region}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('EditSurvey', { surveyId: item.id })}>
                            <Text><FeatherIcon name="edit" size={20} /></Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                        <Text><MaterialIcons name="delete" size={20}   onPress={()=>navigation.navigate('Dashboard', DeleteHandler(item.id))}/></Text>
                        </TouchableOpacity>
                    </View>
                ))
            }
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 50,
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
        fontSize: 10,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginBottom: 20,
        alignSelf: 'flex-end',
        width: '50%'
    }
});

