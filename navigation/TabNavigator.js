import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {Focus, NotebookText, UserStar} from 'lucide-react-native'
import { useNavigationState } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { getAuth } from '@react-native-firebase/auth'
import { setAuthState } from '../Redux/authSlice'

import HomePage from '../src/Screens/HomePage'
import Profile from '../src/Screens/Profile'


const Tab = createBottomTabNavigator()


const TabNavigator = () => {
    const[ActivePage, setActivePage]=useState('Home')
    const auth = getAuth();
    const dispatch = useDispatch();
    const user = auth.currentUser

    dispatch(setAuthState({
          uid:user.uid ,
          userName:user.displayName,
          userEmail:user.email,
          emailVerified:user.emailVerified,
          phoneNumber:user.phoneNumber,
          photoUrl:user.photoURL,
        }))

  return(
        <Tab.Navigator screenOptions={({route}) => ({
            tabBarShowLabel:false,
            headerShown:false,
            tabBarStyle:{
                position:'absolute',
                height:70,
                marginHorizontal:'20%',
                bottom:10,
                borderRadius:50
            },
            
        })}>
            <Tab.Screen name="Home" component={HomePage} options={{
                tabBarButton:(props) => {
                    const focused = props?.['aria-selected']
                    // console.log(props?.['aria-selected'])
                    return(
                        <TouchableOpacity style={{flex:1,backgroundColor:focused?'#000':'#FFF', borderRadius:50, justifyContent:'center', alignItems:'center', margin:10}} onPress={props.onPress}>
                            <Text style={{color:focused?'#FFF':'#000'}}> Tasks </Text>
                        </TouchableOpacity>
                    )
                }
            }}/>
            <Tab.Screen name="Profile" component={Profile} options={{
                tabBarButton:(props) => {
                    const focused = props?.['aria-selected']
                    // console.log(props?.['aria-selected'])
                return(
                    <TouchableOpacity style={{flex:1,backgroundColor:focused?'#000':'#FFF', borderRadius:50, justifyContent:'center', alignItems:'center', margin:10}} onPress={props.onPress}>
                        <Text style={{color:focused?'#FFF':'#000'}}> Profile </Text>
                    </TouchableOpacity>
                )
                }
            }}/>
        </Tab.Navigator>
    )
}

export default TabNavigator