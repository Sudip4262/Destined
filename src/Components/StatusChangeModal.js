import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import {MessageSquareDiff,List,CircleDot, CircleCheckBig } from 'lucide-react-native'
import { useSelector } from 'react-redux'

const StatusChangeModal = ({closeModal, TaskStatus, date, ObjectId,}) => {

  const[RadioButton, setRadioButton] = useState(TaskStatus)
  const email=useSelector((state) => state.auth.userEmail)
  const PORTno=useSelector((state) => state.portNo.portNo)

  const[TaskChanged, setTaskChanged] = useState(false)
  

  // useEffect(() => {
  //   setRadioButton(TaskStatus)
  // },[])
  console.log(RadioButton)


  const ChangeTaskStatus = async() => {
    console.log("here too")
    try{
      const res = await fetch(`http://${PORTno}:5000/TaskData/ChangeTaskStatus`,{
        method: 'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({taskStatus : RadioButton, email:email, date:String(date), Objectid:ObjectId})
      })
      if (res.ok){
        console.log(res.json())
        setTaskChanged(true)
        closeModal()
      }

    } catch(e){
      console.log(e)
    }
  }



  return (
    <Modal transparent onRequestClose={() => {closeModal()}}>
    <TouchableWithoutFeedback onPress={() => closeModal()}>
    <View style={Styles.WholeContainer}>
      <TouchableWithoutFeedback>
        <View style={Styles.Box}>
          <Text style={{color:'#000', fontSize:20, margin:10}}>Mark as complete..</Text>
          <View style={Styles.RadioButtonView}>
            <TouchableOpacity activeOpacity={0.7} style={RadioButton? Styles.RadioButtonOptionsFalse : Styles.RadioButtonOptionsTrue} onPress={() => {setRadioButton(false)}}>
              <CircleDot color={RadioButton? '#000':'#FFF'} />
              <Text style={RadioButton? Styles.TextFalse : Styles.TextTrue}>Incomplete</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={RadioButton? Styles.RadioButtonOptionsTrue : Styles.RadioButtonOptionsFalse} onPress={() => {setRadioButton(true)}}>
              <CircleCheckBig color={RadioButton? '#FFF' : '#000'} />
              <Text style={RadioButton? Styles.TextTrue : Styles.TextFalse}>Complete</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={Styles.Submit} onPress={() => {ChangeTaskStatus()}}>
            <Text style={{fontSize:14}}>Change</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
    </TouchableWithoutFeedback>
    </Modal>
  )
}

export default StatusChangeModal


const Styles = StyleSheet.create({
  WholeContainer:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems:'center'
  },
  Box:{
    height:'30%',
    width:'80%',
    borderRadius:20,
    backgroundColor:'#FFF',
    justifyContent: 'center',
    alignItems:'center'
  },
  RadioButtonView:{
    width:'100%',
    flexDirection:'row',
     justifyContent: 'space-around',
     padding:15,
    //  borderWidth:2,
    //  borderColor:"#000"
  },
  RadioButtonOptionsFalse:{
    flexDirection:'row', 
    alignItems:'center', 
    borderRadius:10,
    borderWidth:0.5, 
    borderColor:'#000', 
    backgroundColor:'#FFF',
    padding:10
  },
  RadioButtonOptionsTrue:{
    flexDirection:'row', 
    alignItems:'center', 
    borderRadius:10,
    // borderWidth:2, 
    // borderColor:'#000', 
    backgroundColor:'#2cc753',
    padding:10
  },
  TextTrue:{
    color:'#FFF',
    margin:5
  },
  TextFalse:{
    color:'#000',
    margin:5
  },
  Submit:{
    paddingVertical:10,
    paddingHorizontal:20,
    backgroundColor:'#ffeb78',
    borderRadius:10,
    margin:10
  }
})