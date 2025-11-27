import { View, Text, TouchableWithoutFeedback, Modal,TouchableOpacity} from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'


const ItemDescription = ({closeModal, ObjectId, Taskname, Taskdesc, TaskTime, TaskCompleted, date}) => {

  const PORTno=useSelector((state)=> state.portNo.portNo)

  const DeleteTask = async() => {
    // console.log("hiiiiiiiiiiiiiiiii")
    try{
      const res = await fetch(`http://${PORTno}:5000/TaskData/delete`,{
      method:'POST',
      headers: {'Content-Type': 'application/json',},
      body:JSON.stringify({date:date, ObjectId:ObjectId})
      })
      if (res.ok){
        console.log("Data send for deletion")
        closeModal()
      }
    } catch(e){
      console.log(e)
    }
  }



    return (
    <Modal transparent onRequestClose={() => {closeModal()}}>
        <TouchableWithoutFeedback onPress={() => {closeModal()}}>
            <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.8)' }}>
                <TouchableWithoutFeedback>
                  <View  style={{height:200, width:'80%', backgroundColor:'#FFF', borderRadius:10}}>
                    <View style={{flex:3,justifyContent:'center', alignItems:'center'}}>
                      <Text style={{fontSize:28, fontWeight:'700'}}>{Taskname}</Text>
                      <Text style={{fontSize:16,margin:5}}>( {Taskdesc} )</Text>
                      <Text style={{margin:0}}>{TaskTime}</Text>
                      <Text>Task completed: <Text style={{fontSize:18}}>{TaskCompleted? "Yes":"No"}</Text></Text>
                    </View>
                    <View style={{flex:1.5, flexDirection:'row',justifyContent:'space-around', alignItems:'center'}}>
                      <TouchableOpacity style={{height:"70%", width:"42%", borderRadius:10 , backgroundColor:'#2ecc71', justifyContent:'center', alignItems:'center'}}
                      onPress={() => {closeModal()}}>
                        <Text style={{color:'#FFF', fontSize:16}} >It's ok</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{height:"70%", width:"42%", borderRadius:10, backgroundColor:'#e74c3c', justifyContent:'center', alignItems:'center'}}
                      onPress={() => {DeleteTask()}}>
                        <Text style={{color:'#FFF', fontSize:16}} >delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
  )
}

export default ItemDescription