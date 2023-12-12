
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default PublishDataTableScreen = ({ navigation }) => {
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('form-Data');
                console.log(jsonValue);
                if (jsonValue !== null) {
                    const parseData = JSON.parse(jsonValue);
                    setFormData(parseData);
                }
            } catch (error) {
                console.log('Error parsing form data', error);
            }
        }
        getData();
    }, []);

    return (
        <View style={styles.container}>
        <View style={styles.buttonContainer}>
        <Button title='Add new Survey' color='#39b24a' onPress={() => navigation.navigate('Survey')} />
    </View>
            <View style={styles.tableHeader}>
                <Text style={styles.headerText}>SP Name</Text>
                <Text style={styles.headerText}>City</Text>
                <Text style={styles.headerText}>Status</Text>
                <Text style={styles.headerText}>Region</Text>
                <Text style={styles.headerText}>Auditor Name</Text>
            </View>
            {
                formData && (
                    <View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>{formData.nameofSupervisor}</Text>
                            <Text style={styles.tableCell}>{formData.cities}</Text>
                            <Text style={styles.tableCell}>{formData.status}</Text>
                            <Text style={styles.tableCell}>{formData.region}</Text>
                            <Text style={styles.tableCell}>{formData.auditorName}</Text>
                        </View>
                    </View>
                )
            }
        </View>
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
       justifyContent:'center',
       alignItems:'center',
        borderBottomWidth: 1,
        paddingBottom: 8,
        paddingTop: 8,
    },
    tableCell: {
        flex: 1,
        fontSize: 10,
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center'
    },
    buttonContainer: {
        marginBottom:20,
        alignSelf: 'flex-end',
        width: '50%'
    }
});