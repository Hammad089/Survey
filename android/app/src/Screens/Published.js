import { View, Text,Button } from 'react-native'
import React from 'react'

export default function Published({navigation, route}) {
  const { itemID, province, city, tehsil, district, districtCode, locationName, tehsilCode, chargeCode, assignment_moodifiedID,AssignID,latitude,longitude } = route.params;
  console.log('data from draft', province, city, tehsil, district, districtCode, locationName, chargeCode, assignment_moodifiedID,AssignID,latitude,longitude);
  return (
    <>
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text style={{fontSize:20}}>No Data Found</Text>
    </View>
    <View>
    <Button title="Start New Survey" color='#39b24a' onPress={() => navigation.navigate('Survey', { itemId: itemID, Province: province, City: city, District: district, Tehsil: tehsil, DistrictCode: districtCode, LocationName: locationName, TehsilCode: tehsilCode, Chargecode: chargeCode, assignment_moodifiedID: assignment_moodifiedID,latitude:latitude,longitude:longitude, AssignID:AssignID})} />
  </View>  
</>
  )
}