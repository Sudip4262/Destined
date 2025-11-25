import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { getAuth } from "@react-native-firebase/auth";
import TabNavigator from './navigation/TabNavigator'
import { Provider,useDispatch } from "react-redux";

import index from './Redux/index'

import HomePage from './src/Screens/HomePage'
import Profile from "./src/Screens/Profile";
import DailyTask from './src/Screens/DailyTask'
import Login from './src/Screens/Login'
import SignUp from './src/Screens/SignUp'
import NewTest2 from './src/Screens/NewTest2'

const Stack = createNativeStackNavigator()


export default App = () => {
    const auth = getAuth()
    return(
        <Provider store={index}>
        <NavigationContainer>
            {/* <Stack.Navigator> */}
                {/* <Stack.Screen name='NewTest2' component={NewTest2} options={{headerShown:false, statusBarHidden:true}} /> */}
            <Stack.Navigator initialRouteName={auth.currentUser? "Main":"Login"} screenOptions={{headerShown:false}}>
                <Stack.Screen name='Login' component={Login} options={{headerShown:false, statusBarHidden:true}} />
                <Stack.Screen name='SignUp' component={SignUp} options={{headerShown:false, statusBarHidden:true}} />
                <Stack.Screen name='Main' component={TabNavigator} options={{headerShown:false}}/>
                <Stack.Screen name='DailyTask' component={DailyTask} options={{headerShown:false}} />
                <Stack.Screen name='Profile' component={Profile} options={{headerShown:false}} />
            </Stack.Navigator>
        </NavigationContainer>
        </Provider>
    )
}