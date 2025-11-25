import React, { useState, memo, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 70
const buildPositions = (arr) => {
      const map = {};
      for (let i = 0; i < arr.length; i++) map[arr[i].id] = i;
    //   console.log(map)
      return map;
    };

const NewTest2 = () => {

    const [Dataset, setDataset] = useState([
        { id: 1, title: 'Intro – Warmup' },
        { id: 2, title: 'Ocean Drive' },
        { id: 3, title: 'Late Night Coding' },
        { id: 4, title: 'Morning Coffee' },
        { id: 5, title: 'Focus Beats' },
        { id: 6, title: 'Tu hi Hai' },
        { id: 12, title: 'Phone' },
        { id: 18, title: 'Chicken' },
        { id: 19, title: 'Mutton' },
        { id: 28, title: 'SoyaBean' },
      ]);

    const positions = useSharedValue(buildPositions(Dataset))
    // console.log(Dataset)

    const commitOrder = () => {
        const map = positions.value;
        const ordered = [...Dataset].sort((a,b) => map[a.id] - map[b.id]);
        console.log(ordered)
        setDataset(ordered)
    }

  return (
    <GestureHandlerRootView style={styles.container}>
        <Text style={styles.header}>Queue</Text>
    
        {/* absolute rows sit inside a fixed-height container */}
        <View style={{ height: Dataset.length * ITEM_HEIGHT }}>
          {Dataset.map((item) => (
            <ItemRow 
              key={item.id}
              item={item}
              positions={positions}
              count = {Dataset.length}
              onDrop = {commitOrder} />
              
          ))}
        </View>
    </GestureHandlerRootView>
  )
}

export default NewTest2

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 16 },
  header: { fontSize: 20, fontWeight: '700', marginHorizontal: 16, marginBottom: 8 },
  row: {
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  handle: { color: '#9CA3AF', fontSize: 18, marginRight: 12 },
  title: { color: 'white', flex: 1, fontSize: 16 },
  drag: { color: '#9CA3AF', marginLeft: 12 },
});



const ItemRow = memo(function ItemRow({item, positions, count, onDrop}){
    const isActive = useSharedValue(false);
    const dragY = useSharedValue(0);
    const startY = useSharedValue(0);

    const pan = useMemo(
        () => 
    Gesture.Pan()
    .runOnJS(true)
    .onBegin(() => {
        isActive.value=true
        startY.value = positions.value[item.id]*ITEM_HEIGHT;
    })
    .onUpdate((e)=> {
        dragY.value = e.translationY;

        const currentY = startY.value+dragY.value;
        // console.log(currentY)

        let NewIndex = Math.round(currentY/ITEM_HEIGHT);
        NewIndex = Math.max(0, Math.min(NewIndex, (count - 1)))

        const map = {...positions.value};
        const OldIndex = map[item.id]
        if(NewIndex !== OldIndex){
            let swapId;
            for ( const k in map){
                if(map[k] == NewIndex)
                {
                    swapId = k;
                    break;
                }
            }
            if(swapId != null){
                map[swapId] = OldIndex
            }
            map[item.id] = NewIndex
            positions.value = map
        }
    })
    .onEnd(() => {
        isActive.value = false;
        dragY.value = 0;
        onDrop()
    }),
    [item.id, positions, count, onDrop]
    )

    const AnimationStyle = useAnimatedStyle(() => {
        const index = positions.value[item.id];
        const targetY = index*ITEM_HEIGHT;
        const translateY = isActive.value
        ? startY.value + dragY.value
        : withSpring(targetY,{damping:50, stiffness:300});
        const scale = isActive.value? 1.03:1;

        return{
            position: 'absolute',
            // width: width * 0.9,
            // height: ITEM_HEIGHT - 10,
            transform: [{ translateY }, { scale }],
            zIndex: isActive.value ? 10 : 0,
            elevation: isActive.value ? 10:0 ,
        };
    })



    return(
        <GestureDetector gesture={pan}>
        <Animated.View style={[styles.row, AnimationStyle]}>
          <Text style={styles.handle}>≡</Text>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.drag}>⇅</Text>
        </Animated.View>
        </GestureDetector>
    )
})