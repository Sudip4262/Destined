import { View, Text, StyleSheet, useWindowDimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, HelperText, TextInput } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential} from '@react-native-firebase/auth'
import moment from 'moment'
import { Fingerprint, Eye, EyeOff, Mail } from 'lucide-react-native'
import { setAuthState } from '../../Redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'

const SignUp = ({navigation}) => {
    const date = moment().format("DD-MM-YY");
    const time = moment().format("hh:mm:ss");
    const auth = getAuth()
    const dispatch = useDispatch()
    const PORTno=useSelector((state) => state.portNo.portNo)

    const[Email,setEmail] = useState('')
    const[EmailError,setEmailError] = useState(false)
    const[Password,setPassword] = useState('')
    const[PasswordError,setPasswordError] = useState(false)
    const {width, height} = useWindowDimensions()
    const[Loading, setLoading] = useState(false)
    const[LoginErrorCode,setLoginErrorCode] = useState('')
    const[ErrorModal, setErrorModal] = useState(false)
    const[PassVisible, setPassVisible] = useState(true)

    const isLandScape = width>height

    const SignUpWithGoogle = async() => {
      try{
        await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog:true})
        const signInResult= await GoogleSignin.signIn();
        const idToken = signInResult.data.idToken
        const GoogleCredential = GoogleAuthProvider.credential(idToken)
        const userCredential = await signInWithCredential(auth, GoogleCredential)
        console.log("user: ", userCredential.user)
        navigation.navigate('HomePage')
        dispatch(setAuthState({
                  uid:user.uid ,
                  userName:user.displayName,
                  userEmail:user.email,
                  emailVerified:user.emailVerified,
                  phoneNumber:user.phoneNumber,
                  photoUrl:user.photoURL,
                }))
        
      } catch(error){
        console.log("Google Signin error:", error)
      }
    }



    const CreateUser = () => {
      let valid = true;
      if(Email.trim() === ''){setEmailError(true); valid=false;}
      else setEmailError(false)

      if (Password.length < 6){setPasswordError(true); valid=false}
      else setPasswordError(false)

      if (valid){
        createUserWithEmailAndPassword(auth, Email, Password)
        .then(async () => {
          console.log("User Account Created Successfully")
          navigation.replace("HomePage")
          const user = auth.currentUser
          dispatch(setAuthState({
                  uid:user.uid ,
                  userName:user.displayName,
                  userEmail:user.email,
                  emailVerified:user.emailVerified,
                  phoneNumber:user.phoneNumber,
                  photoUrl:user.photoURL,
                }))
          try{
            const res = await fetch(`http://${PORTno}:5000/UserData/Create`,{
              method:"POST",
              headers: {'Content-Type': 'application/json',},
              body:JSON.stringify({email:Email, password:Password, date:date, time:time})
            })
            if (res.ok) {
              console.log("Data send to backend")
            }
          } catch(e){
            console.log(e)
          }
        })
        .catch((error) => {
          if (error.code === 'auth/invalid-email') {
            setLoginErrorCode('Please enter a valid-email')
            setErrorModal(true)
          }
          if (error.code === 'auth/invalid-credential') {
            setLoginErrorCode('auth/invalid-credential')
            setErrorModal(true)
          }
        })
        }
    }


  return (
    <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
    <View style={isLandScape? Styles.ContainerLandScape:Styles.Container}>
      <View style={Styles.EmailAuth}>
        
        <Text style={Styles.HeadingText} >SignUp</Text>
        <Text style={{color:'#f90'}}>{LoginErrorCode == "" ? '' : LoginErrorCode}</Text>

        <TextInput style={Styles.TextInput} 
        label={'email'} 
        mode='outlined' 
        outlineColor='#A8D5BA' 
        activeOutlineColor='#5fd5de' 
        value={Email} 
        onChangeText={(txt) => {setEmail(txt)}} 
        error={EmailError}
        right={<TextInput.Icon icon={() => (
          <Mail size={20} color={'#d1cdcd'} />
        )} />}
         />
        <HelperText type='error' visible={EmailError} style={{margin:-10}}>Email is required</HelperText>

        <TextInput style={Styles.TextInput} 
        label={'password'} 
        mode='outlined' 
        outlineColor='#A8D5BA' 
        activeOutlineColor='#5fd5de' 
        value={Password} 
        onChangeText={(txt) => {setPassword(txt)}} 
        error={PasswordError} 
        secureTextEntry={PassVisible} 
        right={<TextInput.Icon icon={() => (
          PassVisible? <EyeOff size={20} color={'#d1cdcd'}/>:<Eye size={20} color={'#5fd5de'} />
        )}
        onPress={() => {setPassVisible(!PassVisible)}} /> }/>
        <HelperText type='error' visible={PasswordError} style={{margin:-10}}>Password is required</HelperText>
        
        <Button style={Styles.Button} mode='contained' textColor='#FFF' buttonColor='#5fd5de' loading={Loading}
        onPress={() => {
          CreateUser()
        }} >
          <Text style={{fontSize:16}}>Continue</Text>
        </Button>
        <TouchableOpacity onPress={() => {navigation.replace('Login')}}><Text style={Styles.NormalText}>  don't have an account?</Text></TouchableOpacity>
      </View>
      <View style={Styles.ProviderAuth}>
        <Button icon={() => <Fingerprint color={'#5fd5de'} />} style={Styles.ProviderButton} mode='outlined' onPress={() => {SignUpWithGoogle()}} ><Text style={{color:'#5fd5de', fontSize:16}} >Google</Text></Button>
      </View>
    </View>
    </TouchableWithoutFeedback>
  )
}

export default SignUp





const Styles = StyleSheet.create({
  Container:{
    flex:1,
    flexDirection:'column',
    backgroundColor:'#FFF'
  },
  ContainerLandScape:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'#FFF'
  },
  EmailAuth:{
    flex:3.5,
    justifyContent:'flex-end',
    alignItems:'center',
    borderBottomWidth:1,
    borderColor:'#bdbdbd',
    borderRadius:70,
  },
  ProviderAuth:{
    flex:1,
    justifyContent: 'flex-start',
    alignItems:'center',
    padding:30
  },
  TextInput:{
    height:50,
    width:'80%',
    margin:5,
    backgroundColor:'#FFF',
    // borderRadius:10,
    // backgroundColor:'#ff1ff1'
  },
  Button:{
    borderColor:'#A8D5BA',
    borderRadius:25,
    marginTop:25,
    paddingVertical:2,
    paddingHorizontal:10
  },
  HeadingText:{
    fontSize:35,
    padding:20,

  },
  ProviderButton:{
    width:'50%',
    borderColor:'#5fd5de',
    padding:2,
  },
  NormalText:{
    fontSize:12,
    padding:10,
    marginBottom:20,
    color:'#5fd5de'
  }
})
