import { View, Text, Modal, TouchableOpacity, StyleSheet, Button, ScrollView, Keyboard } from 'react-native'
import React, {useEffect, useState} from 'react'
import { TextInput } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { Dropdown } from 'react-native-element-dropdown'

import DatePicker from 'react-native-date-picker'



const ItemAddModal = ({closeModal, date}) => {


  const [time, setTime] = useState(null);
  const [TaskName, setTaskName] = useState()
  const [TaskDesc, setTaskDesc] = useState()
  const [KeyboardVisible, setKeyboardVisible] = useState()
  const email = useSelector((state) => state.auth.userEmail)
  const PORTno=useSelector((state)=> state.portNo.portNo)
  const[dateOpen,setDateOpen] = useState(false)
  // const [selectedTime, setSelectedTime] = useState(new Date())

  useEffect(() => {
    const showKey = Keyboard.addListener('keyboardDidShow', () => {setKeyboardVisible(true)})
    const hideKey = Keyboard.addListener('keyboardDidHide', () => {setKeyboardVisible(false)})

    // return () => {
      
    // }

  })
 
  const CreateTask = async() => {

    console.log("I'm here")
    try{
      const res = await fetch(`http://${PORTno}:5000/TaskData/create`,{
      method:'POST',
      headers: {'Content-Type': 'application/json',},
      body:JSON.stringify({TaskName:TaskName, TaskDesc:TaskDesc, time:time, Date:date, Email:email})
      })
      if (res.ok){
        console.log("Task Created")
      }
      closeModal()
    } catch(e){
      console.log(e)
    }
  }

 
  return(
    <Modal transparent>
      <View style={Styles.wholeContainer}>
      <ScrollView contentContainerStyle={{flexGrow:1, justifyContent:'center', alignItems:'center'}} keyboardShouldPersistTaps='handled'>
        <View style={[Styles.Box, {height: KeyboardVisible? '70%':'45%'}]}>
          <ScrollView style={{height:'100%', width:'100%'}} contentContainerStyle={{justifyContent:'center', alignItems:'center'}}>
          <Text style={{fontSize:25, margin:20}}>Create Task</Text>
          <TextInput style={Styles.TextInput} label={'Task Name'} mode='outlined' outlineColor='#A8D5BA' activeOutlineColor='#5fd5de' onChangeText={(txt) => setTaskName(txt)}/>
          <TextInput style={Styles.TextInputDesc} label={'Task Desc'} mode='outlined' outlineColor='#A8D5BA' activeOutlineColor='#5fd5de' numberOfLines={5} multiline onChangeText={(txt) => setTaskDesc(txt)}/>
          <TouchableOpacity style={time? Styles.GotTime: Styles.GetTime} onPress={() => {setDateOpen(true)}}>
            <Text style={{fontSize:16, paddingLeft:20}}>{time? time.getHours().toString().padStart(2,'0')+":"+time.getMinutes().toString().padStart(2,'0'):"Select Time"}</Text>
          </TouchableOpacity>
          <DatePicker modal open={dateOpen} date={time || new Date()} mode='time'
          onConfirm={(Time) => {
            setTime(Time)
            console.log(Time.getHours().toString().padStart(2,'0')+":"+Time.getMinutes(). toString().padStart(2,'0'))
            setDateOpen(false)
          }}
          onCancel={() => {setDateOpen(false)}}
           />
          <View style={{flexDirection:'row'}}>
            <View style={{flexDirection:'column'}}>
            </View>
          </View>
          </ScrollView>
        </View>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity style={Styles.Button} onPress={closeModal}>
              <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={Styles.Button2} onPress={() => {CreateTask()}}>
            <Text style={{color:'#FFF'}}>Create task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
      {/* <TouchableOpacity onPress={closeModal}></TouchableOpacity> */}
    </Modal>
  )
}

export default ItemAddModal


const Styles = StyleSheet.create({
    wholeContainer:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.8)',
    },
    Box:{
        width:'90%',
        borderRadius:10,
        backgroundColor:'#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Button:{
      height:50,
      width:120,
      backgroundColor:'#dedede',
      borderRadius:10,
      marginTop:10,
      margin:10,
      justifyContent:'center',
      alignItems:'center'
    },
    Button2:{
      height:50,
      width:120,
      backgroundColor:'#2cdee8',
      borderRadius:10,
      marginTop:10,
      margin:10,
      justifyContent:'center',
      alignItems:'center'
    },
    TextInput:{
      height:0,
      width:'80%',
      // backgroundColor:'#2cdee8',
      borderRadius:10,
      color:'#000',
      // padding:20,
      margin:5,
    },
    TextInputDesc:{
      height:100,
      width:'80%',
      // backgroundColor:'#2cdee8',
      borderRadius:10,
      color:'#000',
      // padding:20,
      margin:5,
      textAlignVertical:'top'
    },
    GetTime:{
      height:50,
      width:'80%',
      borderRadius:10,
      margin:5,
      backgroundColor:'#FFF',
      justifyContent: 'center',
      borderColor:'#A8D5BA',
      borderWidth:1,
    },
    GotTime:{
      height:50,
      width:'80%',
      borderRadius:10,
      margin:5,
      backgroundColor:'#FFF',
      justifyContent: 'center',
      borderColor:'#2cdee8',
      borderWidth:1,
    },
})