import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import {MessageCirclePlus,MessageSquareDiff } from 'lucide-react-native'


const DayIndexToDay = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']


const Header = ({onOpenModal, item}) => {
  const Item = item.item
  // console.log(Item)
  return (
    <View style={Styles.Container}>
      <View style={{flex:1, justifyContent:'center'}}>
        <Text style={Styles.Text}>{DayIndexToDay[Item.day]}</Text>
      </View>
      {/* <View style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
        <TouchableOpacity onPress={onOpenModal} style={Styles.Icon}>
            <MessageCirclePlus color={'#000'} size={35} />
        </TouchableOpacity>
      </View> */}
    </View>
  )
}

export default Header


const Styles = StyleSheet.create({
    Container:{
        flexDirection:'row',
        width:'100%',
        backgroundColor:'#fff',
        alignSelf:'center',
        elevation:5
    },
    Text:{
        color:'#000',
        fontSize:28,
        padding:10,
        fontFamily:'StoryScript-Regular'
    },
    Icon:{
        padding:10
    }
})