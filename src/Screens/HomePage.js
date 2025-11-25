import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthState } from '../../Redux/authSlice';

const DataSet = [
  {
    id: 1,
    date: moment().subtract(3, 'days').format('DD-MM-YYYY'),
    day: moment().subtract(3, 'days').day(),
  },
  {
    id: 2,
    date: moment().subtract(2, 'days').format('DD-MM-YYYY'),
    day: moment().subtract(2, 'days').day(),
  },
  {
    id: 3,
    date: moment().subtract(1, 'days').format('DD-MM-YYYY'),
    day: moment().subtract(1, 'days').day(),
  },
  { id: 4, date: moment().format('DD-MM-YYYY'), day: moment().day() },
  {
    id: 5,
    date: moment().add(1, 'days').format('DD-MM-YYYY'),
    day: moment().add(1, 'days').day(),
  },
  {
    id: 6,
    date: moment().add(2, 'days').format('DD-MM-YYYY'),
    day: moment().add(2, 'days').day(),
  },
  {
    id: 7,
    date: moment().add(3, 'days').format('DD-MM-YYYY'),
    day: moment().add(3, 'days').day(),
  },
  {
    id: 8,
    date: moment().add(4, 'days').format('DD-MM-YYYY'),
    day: moment().add(4, 'days').day(),
  },
  {
    id: 9,
    date: moment().add(5, 'days').format('DD-MM-YYYY'),
    day: moment().add(5, 'days').day(),
  },
  {
    id: 10,
    date: moment().add(6, 'days').format('DD-MM-YYYY'),
    day: moment().add(6, 'days').day(),
  },
];

const Item_Height = 130;
const Variable_Height = 170;

const DayColor = [
  { start: '#fcd465', middle: '#ffc217', end: '#ffbe0b' },
  { start: '#4fb0e3', middle: '#1583bd', end: '#0077b6' },
  { start: '#eb5e68', middle: '#d1212f', end: '#e63946' },
  { start: '#fcd465', middle: '#ffc217', end: '#ffbe0b' },
  { start: '#6b488c', middle: '#3e1763', end: '#3c096c' },
  { start: '#fcd465', middle: '#ffc217', end: '#ffbe0b' },
  { start: '#fcd465', middle: '#ffc217', end: '#ffbe0b' },
];

const DayIndexToDay = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const ItemRow = memo(function ItemRow({ item, index, navigation, Auth }) {
  const [Active, setActive] = useState(false);
  return (
    <TouchableOpacity
      style={[
        index == 3 ? Styles.VariableItem : Styles.EachItem,
        { backgroundColor: DayColor[item.day] },
      ]}
      onPress={() => {
        setActive(true);
        navigation.navigate('DailyTask', { item });
      }}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[
          DayColor[item.day].start,
          DayColor[item.day].middle,
          DayColor[item.day].end,
        ]}
        style={StyleSheet.absoluteFillObject}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 40,
            fontFamily: 'StoryScript-Regular',
            paddingLeft: 10,
            paddingTop: 10,
          }}
        >
          {DayIndexToDay[item.day]}
        </Text>
        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            fontFamily: 'StoryScript-Regular',
            paddingLeft: 10,
          }}
        >
          {item.date}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
});

//////Start
const HomePage = ({ navigation }) => {
  const auth = getAuth();
  const dispatch = useDispatch()

  useEffect(() => {
    getAuthState()
  },[])

  const getAuthState = () => {
    if(auth.currentUser){
      const User = auth.currentUser
      dispatch(setAuthState({
        uid: User.uid,
        userName:User.displayName,
        userEmail: User.email,
        emailVerified: User.emailVerified,
        phoneNumber:User.phoneNumber,
        photoUrl:User.photoURL
      }))
    }
  }

  const name = useSelector(state => state.auth);
  // console.log(name.userEmail)

  return (
    <View style={Styles.Whole_Container}>
      <FlatList
        data={DataSet}
        keyExtractor={item => item.id}
        initialScrollIndex={3}
        getItemLayout={(i, index) => {
          if (index == 3) {
            return {
              length: Variable_Height,
              offset: Item_Height * index,
              index,
            };
          }
          return { length: Item_Height, offset: Item_Height * index, index };
        }}
        renderItem={({ item, index }) => (
          <ItemRow
            item={item}
            index={index}
            navigation={navigation}
            Auth={auth}
          />
        )}
      />
    </View>
  );
};

export default HomePage;

const Styles = StyleSheet.create({
  Whole_Container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  EachItem: {
    width: '90%',
    height: 110,
    borderRadius: 10,
    margin: 10,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  VariableItem: {
    width: '95%',
    height: 250,
    borderRadius: 10,
    margin: 20,
    alignSelf: 'center',
    elevation: 10,
    overflow: 'hidden',
  },
});
