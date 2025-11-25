import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 72;

const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
const buildPositions = (arr) => {
  const map = {};
  for (let i = 0; i < arr.length; i++) map[arr[i].id] = i;
  return map;
};
const Next2 = () => {
const [tracks, setTracks] = useState([
    { id: 1, title: 'Intro – Warmup' },
    { id: 2, title: 'Ocean Drive' },
    { id: 3, title: 'Late Night Coding' },
    { id: 4, title: 'Morning Coffee' },
    { id: 5, title: 'Focus Beats' },
  ]);

  // shared ordering (UI thread) so rows react instantly
  const positions = useSharedValue(buildPositions(tracks));

  // commit visual order back to React after drop
  const commitOrder = () => {
    const map = positions.value;
    const ordered = [...tracks].sort((a, b) => map[a.id] - map[b.id]);
    setTracks(ordered);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.header}>Queue</Text>

      {/* absolute rows sit inside a fixed-height container */}
      <View style={{ height: tracks.length * ITEM_HEIGHT }}>
        {tracks.map((t) => (
          <Row
            key={t.id}
            item={t}
            positions={positions}
            count={tracks.length}
            onDrop={commitOrder}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
} 

export default Next2

function Row({ item, positions, count, onDrop }) {
  const isActive = useSharedValue(false);
  const dragY = useSharedValue(0);
  const startY = useSharedValue(0);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true) // allow calling JS from handlers
        .onBegin(() => {
          isActive.value = true;
          startY.value = positions.value[item.id] * ITEM_HEIGHT;
        })
        .onUpdate((e) => {
          dragY.value = e.translationY;

          // convert current pixel Y → target index, then swap
          const currentY = startY.value + dragY.value;
          let newIndex = Math.round(currentY / ITEM_HEIGHT);
          newIndex = Math.max(0, Math.min(newIndex, (count - 1)))

          const map = { ...positions.value };
          const oldIndex = map[item.id];
          if (newIndex !== oldIndex) {
            // find id currently at newIndex and swap indices
            let swapId;
            for (const k in map) {
              if (map[k] === newIndex) { swapId = k; break; }
            }
            if (swapId != null) map[swapId] = oldIndex;
            map[item.id] = newIndex;
            positions.value = map; // reassign to trigger updates
          }
        })
        .onEnd(() => {
          isActive.value = false;
          dragY.value = 0;
          onDrop(); // reflect order into React state
        }),
    [count, item.id, positions, onDrop]
  );

  // each row springs to its slot unless being dragged
  const style = useAnimatedStyle(() => {
    const index = positions.value[item.id];
    const targetY = index * ITEM_HEIGHT;
    const translateY = isActive.value
      ? startY.value + dragY.value
      : withSpring(targetY, { damping: 20, stiffness: 220 });
    const scale = isActive.value ? 1.03 : 1;

    return {
      position: 'absolute',
      left: width * 0.05,
      width: width * 0.9,
      height: ITEM_HEIGHT - 10,
      transform: [{ translateY }, { scale }],
      zIndex: isActive.value ? 10 : 0,
      elevation: isActive.value ? 10 : 0,
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.row, style]}>
        <Text style={styles.handle}>≡</Text>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.drag}>⇅</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 16 },
  header: { fontSize: 20, fontWeight: '700', marginHorizontal: 16, marginBottom: 8 },
  row: {
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  handle: { color: '#9CA3AF', fontSize: 18, marginRight: 12 },
  title: { color: 'white', flex: 1, fontSize: 16 },
  drag: { color: '#9CA3AF', marginLeft: 12 },
});
