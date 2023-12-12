import { View, Text, StyleSheet, TouchableOpacity, Button , ScrollView} from 'react-native';
import React, { useState } from 'react';

export default function Completed({AssignmentData,navigation}) {
  const ongoingAssignment = AssignmentData.filter((assignment)=>assignment.status === 'Complete')
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
      {
      ongoingAssignment.length > 0 ? ( ongoingAssignment.map((item, index)=> {
          return (
            <View style={styles.CardsContainer} key={item.assignment_id}>
        <TouchableOpacity onPress={() => navigation.navigate(item.assignment_id)}>
        <View style={{flexDirection:'row', columnGap:10, borderBottomWidth:0.5, borderColor:'lightgrey'}}>
            <View style={styles.circle}></View>
            <View>
                <Text style={{color:'blue', fontSize:18, fontWeight:'700' , marginBottom:10}}>{item.assignment_modified_id}</Text>
            </View>
        </View>
        </TouchableOpacity>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10, borderBottomWidth:0.5, borderColor:'lightgrey', marginBottom:10}}>
        <View>
            <View>
                <Text style={{fontSize:14, fontWeight:'500', marginBottom:10}}>Start Date:{item.assigned_date}</Text>
            </View>
        </View>
        <View>
            <View>
                <Text style={{fontSize:14, fontWeight:'500', marginBottom:10}}>End Date:{item.planned_completion_date}</Text>
            </View>
        </View>
        </View>
        <View>
            <Text>Total Outlet:{item.total_outlets}</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10}}>
            <View>
                <Text>Outlets Completed:{item.completed_outlets}</Text>
            </View>
            <View>
                <Text>Outlets Terminated:{item.incomplete_outlets}</Text>
            </View>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10}}>
            <View>
                <Text>Draft:<Text style={{ color: 'red', marginBottom: 15, fontSize: 14, fontWeight:'500' }}>0</Text></Text>
            </View>
            <View>
                <Text>Published:<Text style={{ color: 'red', marginBottom: 15, fontSize: 14, fontWeight:'500' }}>0</Text></Text>
            </View>
        </View>
      </View>
          )
        })
      ) : (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <Text style={{fontSize:30}}>No Data Found</Text>
      </View>
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
    backgroundColor:'white',
    padding:20,
    shadowColor:'black',
    shadowOffset:{
      width:0,
      height:2
    },
    shadowOpacity:0.5,
    shadowRadius:10,
    elevation:5,
  },
  CardsContainer : {
    marginTop:10,
    backgroundColor:'white',
    padding:35,
    shadowColor:'black',
    shadowOffset:{
      width:0,
      height:2
    },
    shadowOpacity:0.5,
    shadowRadius:10,
    elevation:5,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 100 / 2,
    backgroundColor: 'darkred',
  },
});
