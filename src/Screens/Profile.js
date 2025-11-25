import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAuth } from '@react-native-firebase/auth'
import { signOutAuthState } from '../../Redux/authSlice'

const Profile = ({navigation}) => {

  const auth = getAuth()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth)
  console.log(user)

  const ClearRedux = () => {
    dispatch(signOutAuthState())
  }


  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text>{user.userEmail}</Text>
      <TouchableOpacity style={{padding:20, backgroundColor:'#ff1', borderRadius:20}} onPress={() => {auth.signOut(); navigation.replace("Login"); ClearRedux()}}>
        <Text>Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Profile