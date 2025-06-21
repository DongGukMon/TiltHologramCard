import { PropsWithChildren, useCallback } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gyroscope } from 'expo-sensors';
import { useFocusEffect } from 'expo-router';
import { StyleProp, ViewStyle } from 'react-native';

interface TiltCardProps {
  style?: StyleProp<ViewStyle>;
}

const MAX_ANGLE = 15;
const RAD2DEG = 180 / Math.PI;

function clamp(v: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(v, min), max);
}

export const SampleTiltCard = ({
  children,
  style,
}: PropsWithChildren<TiltCardProps>) => {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const rStyle = useAnimatedStyle(
    () => ({
      transform: [
        { perspective: 500 },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
    }),
    []
  );

  useFocusEffect(
    useCallback(() => {
      Gyroscope.setUpdateInterval(16);

      let prev = Date.now();
      const unsubscribe = Gyroscope.addListener((gyroscopeData) => {
        const now = Date.now();
        const dt = (now - prev) / 1000; // 초
        prev = now;

        rotateX.value = clamp(
          rotateX.value + (gyroscopeData.x / 2) * dt * RAD2DEG,
          -MAX_ANGLE,
          MAX_ANGLE
        );
        rotateY.value = clamp(
          rotateY.value - (gyroscopeData.y / 2) * dt * RAD2DEG,
          -MAX_ANGLE,
          MAX_ANGLE
        );
      });
      return () => {
        rotateX.value = withTiming(0, {
          duration: 500,
        });
        rotateY.value = withTiming(0, {
          duration: 500,
        });
        unsubscribe.remove();
      };
    }, [])
  );

  return <Animated.View style={[rStyle, style]}>{children}</Animated.View>;
};
