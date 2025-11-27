import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState, memo, useMemo, useCallback } from 'react'
import Header from '../Components/Header'
import ItemAddModal from '../Components/ItemAddModal'
import {MessageSquareDiff,List,CircleDot, CircleCheckBig } from 'lucide-react-native'
import { useSelector } from 'react-redux'
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFocusEffect } from '@react-navigation/native'
import StatusChangeModal from '../Components/StatusChangeModal'
import ItemDescription from '../Components/ItemDescription'


const ITEM_HEIGHT = 75
const buildPositions= (arr) => {
  const map = {};
  for (let i = 0; i< arr.length; i++) map[arr[i]._id] = i;
  return map;
}

const DBPositionChange = (Values, TaskList, portNo, date, email) => {
  const NewArr = []
  for (const id in Values){
    NewArr[Values[id]] = id
  }
  // console.log(NewArr)

  const reOrdered = NewArr.map(id=> 
    TaskList.find(obj => obj._id === id)
  )
  // console.log(reOrdered)
  postToMongo(reOrdered, portNo, date, email)
}

const postToMongo = async(reOrdered, PORTno, date, email) => {
  const res = await fetch(`http://${PORTno}:5000/TaskData/updateTaskList`,{
    method:"POST",
    headers: {'Content-Type': 'application/json',},
    body:JSON.stringify({NewTaskList:reOrdered, date:date, email:email})
  })
  if (res.ok) {
    console.log("Updated TaskList")
  }
}



const DailyTask = ({route}) => {

    const[AddItemModal, setAddItemModal] = useState(false)
    const [StatusChangeM, setStatusChangeM] = useState(false)
    const[TaskList,setTaskList] = useState([])
    const[TasklistLength, setTasklistLength] = useState()
    const [ItemDescriptionModal, setItemDescriptionModal] = useState(false)

    const[SelectedObjectId, setSelectedObjectId] = useState()
    const[SelectedTaskname, setSelectedTaskname] = useState()
    const[SelectedTaskdesc, setSelectedTaskdesc] = useState()
    const[SelectedTaskTime, setSelectedTaskTime] = useState()
    const[SelectedTaskCompleted, setSelectedTaskCompleted] = useState()

    const[TaskBasedStatusModal, setTaskBasedStatusModal] = useState(false)

    const email=useSelector((state) => state.auth.userEmail)
    const PORTno=useSelector((state) => state.portNo.portNo)
    const item = route.params
    const date = item.item.date
    // console.log(item)
    const positions = useSharedValue({})

    const ModalTaskStatus = (something) => setTaskBasedStatusModal(something)
    const ObjectId = (something) => setSelectedObjectId(something)
    const Taskname = (something) => setSelectedTaskname(something)
    const Taskdesc = (something) => setSelectedTaskdesc(something)
    const TaskTime = (something) => setSelectedTaskTime(something)
    const TaskCompleted = (something) => setSelectedTaskCompleted(something)

    const openModal =() => setAddItemModal(true)
    const closeModal =() => setAddItemModal(false)
    const openStatusModal =() => setStatusChangeM(true)
    const closeStatusModal =() => setStatusChangeM(false)

    const openItemDescriptionModal =() => setItemDescriptionModal(true)
    const closeItemDescriptionModal =() => setItemDescriptionModal(false)
    // console.log(StatusChangeM)
    useEffect(() => {
      getData()
      return () => {
        // setTaskList([])
        // positions.value={}
      }
    },[AddItemModal, StatusChangeM, ItemDescriptionModal])


    const getData = async() => {
      const FetchData = await fetch(`http://${PORTno}:5000/TaskData/TaskPerDate?email=${email}&date=${item.item.date}`,{
        method:'GET',
        headers: {'Content-Type': 'application/json',}
      })
      if(FetchData.ok){
        console.log("Data send to backend")
        const Data = await FetchData.json()
        setTaskList(Data.tasks)
        setTasklistLength(Data.tasks.length)
        // console.log(Data.tasks)
        positions.value = buildPositions(Data.tasks)
      }  else{
        console.log("request failed with status", FetchData.status)
      }
    }

    // console.log(TaskList)
  

  return (
    <GestureHandlerRootView style={Styles.WholeContainer}>
      <Header onOpenModal={openModal} item={item} />
      <ScrollView style={{flex:1}} contentContainerStyle={{width:'100%', minHeight:ITEM_HEIGHT*(TasklistLength+0.5)}}
      showsVerticalScrollIndicator={true}
      bounces={true}
      nestedScrollEnabled={true}
      >
        { 
          TaskList.length>0 ? TaskList.map((item) => {
            return(
                <ItemRow
                  key={item._id.toString()}
                  item = {item}
                  positions = {positions}
                  count ={TaskList.length}
                  TaskList = {TaskList}
                  portNo = {PORTno}
                  date = {date}
                  email = {email}
                  openStatusModal = {openStatusModal}
                  TaskBasedStatusModal = {ModalTaskStatus}
                  ObjectId = {ObjectId}
                  Taskname = {Taskname}
                  Taskdesc = {Taskdesc}
                  TaskTime = {TaskTime}
                  TaskCompleted = {TaskCompleted}
                  openItemDescriptionModal = {openItemDescriptionModal}
                />
            )
          }) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: '#888' }}>No tasks available</Text>
            </View>
          )
        }
      </ScrollView>
      <TouchableOpacity style={Styles.Floating} onPress={openModal}>
        <MessageSquareDiff color={"#FFF"} size={30} />
      </TouchableOpacity>
      {AddItemModal && <ItemAddModal closeModal = {closeModal} date={item.item.date}  />}
      {StatusChangeM && <StatusChangeModal closeModal={closeStatusModal} TaskStatus={TaskBasedStatusModal} date={date} ObjectId={SelectedObjectId}/>}
      {ItemDescriptionModal && <ItemDescription closeModal={closeItemDescriptionModal} ObjectId={SelectedObjectId} Taskname = {SelectedTaskname} Taskdesc={SelectedTaskdesc} TaskTime={SelectedTaskTime} TaskCompleted={SelectedTaskCompleted} date={date} />}
    </GestureHandlerRootView>
  )
}

export default DailyTask


const Styles=StyleSheet.create({
    WholeContainer:{
        flex:1,
        backgroundColor:'#FFF'
    },
    Floating:{
      height:70,
      width:80,
      position:'absolute',
      backgroundColor:'#802187',
      borderRadius:50,
      alignSelf:'flex-end',
      bottom:0,
      margin: 20,
      justifyContent: 'center',
      alignItems:'center'
    },
    tasksContainer:{
      height:60, 
      width:'90%',
      backgroundColor:'#333333',
      borderRadius:20,
      alignSelf:'center',
      marginTop:15,
      flexDirection:'row',
      borderWidth:1,
      borderColor:'#000'
    }
})


const ItemRow = memo(function ItemRow({item, positions, count,TaskList, portNo, date, email, openStatusModal, TaskBasedStatusModal, ObjectId, Taskname, Taskdesc, TaskTime, TaskCompleted, openItemDescriptionModal}){
  const isActive = useSharedValue(false);
  const dragY = useSharedValue(0);
  const startY = useSharedValue(0);
  const hasDragged = useSharedValue(false);
  const Time = new Date(item.time)
  // console.log(Time.getHours().toString().padStart(2,'0')+":"+Time.getMinutes().toString().padStart(2,'0'))
  // console.log(item.completed)
  useEffect(() => {
    return () => {
      isActive.value = false
      dragY.value = 0
      startY.value = 0
    }
  },[])

  const pan = useMemo(() => 
    Gesture.Pan()
  .shouldCancelWhenOutside(false)
  .runOnJS(true)
  .onBegin(() => {
    hasDragged.value = false
    isActive.value=true
    startY.value = positions.value[item._id]*ITEM_HEIGHT;
  })
  .onUpdate((e) => {
    dragY.value = e.translationY;
    const currentY = startY.value+dragY.value;
    if(Math.abs(e.translationY)>5){
      hasDragged.value = true
    }

    let NewIndex = Math.round(currentY/ITEM_HEIGHT);
    NewIndex = Math.max(0, Math.min(NewIndex, (count - 1)))

    const map = {...positions.value}
    const oldIndex = map[item._id]
    if(NewIndex !== oldIndex){
      let swapId;
      for (const k in map){
        if(map[k] == NewIndex)
        {
          swapId = k;
          break;
        }
      }
      if (swapId != null){
        map[swapId] =oldIndex
      }
      map[item._id]= NewIndex
      positions.value = map
      // console.log(map)
    }
  })
  .onEnd(() => {
    isActive.value = false;
    dragY.value = 0;
    hasDragged.value=false
    DBPositionChange(positions.value, TaskList, portNo, date, email)
  }),
  [item._id, positions, count]

)


const AnimationStyle = useAnimatedStyle(() => {
  const index = positions.value[item._id] ?? 0;
  const targetY = index*ITEM_HEIGHT;
  const translateY = isActive.value?
  startY.value+dragY.value
  :
  withSpring(targetY,{damping:50, stiffness:300});
  const scale = hasDragged.value? 1.05:1
  return{
    position:'absolute',
    transform:[{translateY},{scale}],
    zIndex:isActive.value? 10:0,
    elevation:isActive.value? 10:0
  }
})

  return(
    <Animated.View style={[Styles.tasksContainer, AnimationStyle]} >
      <GestureDetector gesture={pan}>
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <List color={"#FFF"} size={20}/>
      </View> 
      </GestureDetector>
      <TouchableOpacity activeOpacity={0.7} style={{flex:4.5, flexDirection:'row', alignItems:'center' ,justifyContent:'space-between'}} 
      onPress={() => {
        openItemDescriptionModal(); 
        ObjectId(item._id)
        // console.log(item)
        Taskname(item.taskname)
        Taskdesc(item.taskdesc)
        TaskTime(Time.getHours().toString().padStart(2,'0')+":"+Time.getMinutes().toString().padStart(2,'0'))
        TaskCompleted(item.completed)
        }}>
        <Text style={{color:'#fff', fontSize:16}}>{item.taskname}</Text>
        <Text style={{color:'#FFF', fontSize:16}}>{Time.getHours().toString().padStart(2,'0')+":"+Time.getMinutes().toString().padStart(2,'0')}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity activeOpacity={0.8} style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff', borderRadius:10, marginHorizontal:10, marginVertical:10}}
      onPress={() => {openStatusModal(); TaskBasedStatusModal(item.completed); ObjectId(item._id) }}>
        {
          item.completed? <CircleCheckBig color={'#28a745'} size={25}/> : 
          <CircleDot color={'#a6a6a6'} size={20} /> 
        }
      </TouchableOpacity>
    </Animated.View>
    
  )

})