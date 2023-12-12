import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './android/app/src/Screens/HomeScreen';
import LoginScreen from './android/app/src/Screens/LoginScreen';
import Profile from './android/app/src/Screens/Profile';
import Setting from './android/app/src/Screens/Setting';
import Survey from './android/app/src/Screens/Survey';
import LocalDataTableScreen from './android/app/src/Screens/LocalDataTableScreen';
import DataCardsScreen from './android/app/src/Screens/DataCardsScreen';
import PublishDataTableScreen from './android/app/src/Screens/PublishDataTableScreen';
import EditSurveyScreen from './android/app/src/Screens/EditSurveyScreen';
import ShopDetailScreen from './android/app/src/Screens/ShopDetailScreen';
import TestPunjab from './android/app/src/Screens/TestPunjab';
import Test1 from './android/app/src/Screens/Test1';
import Test2 from './android/app/src/Screens/Test2';
import Test3 from './android/app/src/Screens/Test3';
// import NotStarted from './android/app/src/Screens/NotStarted';
import Circle from './android/app/src/Screens/Circle';
import Circle104 from './android/app/src/Screens/Circle104';
import Draft from './android/app/src/Screens/Draft';
import DashboardScreen from './android/app/src/Screens/DashboardScreen';
import PerfomanceScreen from './android/app/src/Screens/PerfomanceScreen';
import MessageScreen from './android/app/src/Screens/MessageScreen';
import { ToastProvider } from 'react-native-toast-notifications';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name='Test-Punjab' component={TestPunjab} />
          <Stack.Screen name='Test-1' component={Test1} />
          <Stack.Screen name='Test-2' component={Test2} />
          <Stack.Screen name='Test-3' component={Test3} />
          {/* <Stack.Screen name='Not-Started' component={NotStarted} /> */}
          <Stack.Screen name='circle' component={Circle} />
          <Stack.Screen name='Circle-104' component={Circle104} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name='Profile' component={Profile} />
          <Stack.Screen name='Setting' component={Setting} />
          <Stack.Screen name='DashboardScreen' component={DashboardScreen} />
          {/* <Stack.Screen name='Draft' component={Draft} /> */}
          {/* <Stack.Screen name='TableData' component={LocalDataTableScreen} /> */}
          <Stack.Screen name='EditSurvey' component={EditSurveyScreen} />
          <Stack.Screen name='PublishTableData' component={PublishDataTableScreen} />
          <Stack.Screen name='DataCards' component={DataCardsScreen} />
          <Stack.Screen name='shopdetail' component={ShopDetailScreen} />
          <Stack.Screen name='Survey' component={Survey} />
          <Stack.Screen name='Performance' component={PerfomanceScreen} />
          <Stack.Screen name='Message' component={MessageScreen} />
         </Stack.Navigator>
      </NavigationContainer>
      </ToastProvider>
  );
}
