import { View, Text, StyleSheet, TouchableOpacity, Button, ScrollView,ActivityIndicator } from 'react-native';
import React, { useState } from 'react';

export default function NotStarted({ AssignmentData, navigation,Itemid }) {
  const ongoingAssignment = AssignmentData.filter((assignment) => assignment.status === 'ongoing');
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        {
          ongoingAssignment.length > 0 ? (ongoingAssignment.map((item, index) => {
            return (
              <View style={styles.CardsContainer} key={Itemid}>
                <TouchableOpacity onPress={() => navigation.navigate('circle', { ItemId: Itemid, AssignmentModifiedID: item.assignment_modified_id, AssignmentsID: item.assignment_id })}>
                  <View style={{ flexDirection: 'row', columnGap: 10, borderBottomWidth: 0.5, borderColor: 'lightgrey' }}>
                    <View style={styles.circle}></View>
                    <View>
                      <Text style={{ color: 'blue', fontSize: 18, fontWeight: '700', marginBottom: 10 }}>{item.assignment_modified_id}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderBottomWidth: 0.5, borderColor: 'lightgrey', marginBottom: 10 }}>
                  <View>
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 10 }}>Start Date:{item.assigned_date}</Text>
                    </View>
                  </View>
                  <View>
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 10 }}>End Date:{item.planned_completion_date}</Text>
                    </View>
                  </View>
                </View>
                <View>
                  <Text>Total Outlet:{item.total_outlets}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <View>
                    <Text>Outlets Completed:{item.completed_outlets}</Text>
                  </View>
                  <View>
                    <Text>Outlets Terminated:{item.incomplete_outlets}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <View>
                    <Text>Draft:<Text style={{ color: 'red', marginBottom: 15, fontSize: 14, fontWeight: '500' }}>0</Text></Text>
                  </View>
                  <View>
                    <Text>Published:<Text style={{ color: 'red', marginBottom: 15, fontSize: 14, fontWeight: '500' }}>0</Text></Text>
                  </View>
                </View>
              </View>
            )
          })
          ) : (              
            !ongoingAssignment.length > 0 ? (
              <View style={{flex:1,justifyContent:'center',alignItems:'center', marginTop:150}}>
              <Text style={{fontSize:20}}>No data found </Text>
             </View>
            ) : (
              <ActivityIndicator size="large" style={{marginTop:150, alignSelf:'center'}} />
            )
      )
        }

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e76ba',
    alignItems: 'center',
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
    backgroundColor: '#6699CC',
    padding: 25,
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
  CardsContainer: {
    marginTop: 10,
    backgroundColor: 'white',
    padding: 35,
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
});
