import { View, Text, StyleSheet, useWindowDimensions, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, HelperText, TextInput } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getAuth,GoogleAuthProvider,  onAuthStateChanged , createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential } from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import moment from 'moment'
import { Fingerprint, Eye, EyeOff, Mail } from 'lucide-react-native'
import { setAuthState } from '../../Redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'


const Login = ({navigation}) => {
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
    const [user, setUser] = useState(null);
    const[PassVisible, setPassVisible] = useState(true)

    const isLandScape = width>height

    useEffect(() => {


      GoogleSignin.configure({
        webClientId:'416215840744-trcqjggd0prlgpbvagbjpoo21jihqfrn.apps.googleusercontent.com'
      });

      // const unsubscribe = onAuthStateChanged(auth, userInfo => {
      //   // console.log(userInfo)
      //   setUser(userInfo);
      // })

      // return() => unsubscribe();

    },[])

    const onGoogleButtonPress = async() => {
      try{
        await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog:true})
        const signInResult = await GoogleSignin.signIn();
        const idToken = signInResult.data.idToken
        const googleCredential = GoogleAuthProvider.credential(idToken)
        const userCredential = await signInWithCredential(auth,googleCredential)
        console.log("user: ", userCredential.user)
        navigation.replace('Main',{screen:"HomePage"})
        dispatch(setAuthState({
                  uid:user.uid ,
                  userName:user.displayName,
                  userEmail:user.email,
                  emailVerified:user.emailVerified,
                  phoneNumber:user.phoneNumber,
                  photoUrl:user.photoURL,
                }))
      } catch (error) {
        console.log('Google Sign-In Error:', error);

        console.log("Error Message:", error.message);
      }
    }





    const ValidateUser = async() => {
      let valid = true;
      if(Email.trim() === ''){setEmailError(true); valid=false;}
      else setEmailError(false)

      if (Password.length < 6){setPasswordError(true); valid=false}
      else setPasswordError(false)

      if (valid){
        const userCred = signInWithEmailAndPassword(auth, Email, Password)
        .then(async () => {
          console.log("User Account Logged in Successfully")
          navigation.replace("Main",{screen:'HomePage'})
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
        
        <Text style={Styles.HeadingText} >Login</Text>
        <Text style={{color:'#f90'}}>{LoginErrorCode == "" ? '' : LoginErrorCode}</Text>

        <TextInput 
        style={Styles.TextInput} 
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

        <TextInput style={Styles.TextInput} label={'password'} mode='outlined' outlineColor='#A8D5BA' activeOutlineColor='#5fd5de' value={Password} onChangeText={(txt) => {setPassword(txt)}} error={PasswordError}
        secureTextEntry={PassVisible}
        right={<TextInput.Icon icon={() => (
                  PassVisible? <EyeOff size={20} color={'#d1cdcd'}/>:<Eye size={20} color={'#5fd5de'} />
                )}
                onPress={() => {setPassVisible(!PassVisible)}} /> }
        />
        <HelperText type='error' visible={PasswordError} style={{margin:-10}}>Password is required</HelperText>
        
        <Button style={Styles.Button} mode='contained' textColor='#FFF' buttonColor='#5fd5de' loading={Loading}
        onPress={() => {
          ValidateUser()
        }} >
          <Text style={{fontSize:16}}>Proceed</Text>
        </Button>
        <TouchableOpacity onPress={() => {navigation.replace('SignUp')}}><Text style={Styles.NormalText}>  already have an account?</Text></TouchableOpacity>
      </View>
      <View style={Styles.ProviderAuth}>
        <Button icon={() => <Fingerprint color={'#5fd5de'} />} style={Styles.ProviderButton} mode='outlined' onPress={() => {onGoogleButtonPress()}} ><Text style={{color:'#5fd5de', fontSize:16}} >Google</Text></Button>
      </View>
    </View>
    </TouchableWithoutFeedback>
  )
}

export default Login





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
    flex:3,
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
