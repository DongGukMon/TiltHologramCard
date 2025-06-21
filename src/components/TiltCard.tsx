import {PropsWithChildren, useCallback} from 'react';
import Animated, {useAnimatedStyle, useDerivedValue, useSharedValue, withTiming} from 'react-native-reanimated';
import {Gyroscope} from 'expo-sensors';
import {useFocusEffect} from 'expo-router';
import {
  Canvas,
  DataSourceParam,
  Group,
  LinearGradient,
  Mask,
  RoundedRect,
  useImage,
  Image
} from '@shopify/react-native-skia';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';

interface TiltCardProps {
  enabled?: boolean;
  maxAngle?: number;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>
  hologramMaskSource?: DataSourceParam;
}

const RAD2DEG = 180 / Math.PI;

function clamp(v: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(v, min), max);
}

export const TiltCard = ({
                           children,
                           enabled = true,
                           maxAngle = 15,
                           width,
                           height,
                           style,
                           hologramMaskSource
                         }: PropsWithChildren<TiltCardProps>) => {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const hologramMask = useImage(hologramMaskSource)

  const rStyle = useAnimatedStyle(
    () => ({
      transform: [{perspective: 500}, {rotateX: `${rotateX.value}deg`}, {rotateY: `${rotateY.value}deg`}],
    }),
    [],
  );

  const gradientStart = useDerivedValue(() => ({
    x: -width + (width / 2 + (width / 2) * (rotateY.value / 1.5 / maxAngle)),
    y: -height + (height / 2 + (height / 2) * (rotateX.value / 1.5 / maxAngle)),
  }));

  const gradientEnd = useDerivedValue(() => ({
    x: width + (width / 2 + (width / 2) * (rotateY.value / 1.5 / maxAngle)),
    y: height + (height / 2 + (height / 2) * (rotateX.value / 1.5 / maxAngle)),
  }));

  const renderHologramLayer = () => (
    <Group blendMode="overlay">
      <Mask
        mask={
          <RoundedRect x={0} y={0} r={17} width={width} height={height}>
            <LinearGradient
              start={gradientStart}
              end={gradientEnd}
              colors={[
                'rgba(0, 0, 0, 0)',
                'rgba(255, 255, 255, 0.6)',
                'rgba(0, 0, 0, 0)',
                'rgba(255, 255, 255, 0.8)',
                'rgba(0, 0, 0, 0)',

                'rgba(255, 255, 255, 0.7)',
                'rgba(0, 0, 0, 0)',
                'rgba(255, 255, 255, 0.5)',
              ]}
              positions={[0, 0.1, 0.25, 0.35, 0.5, 0.65, 0.8, 1]}
            />
          </RoundedRect>
        }
        mode="luminance"
      >
        <Image image={hologramMask} width={width} height={height} fit="cover"/>
        <RoundedRect x={0} y={0} r={17} width={width} height={height}>
          <LinearGradient
            start={gradientStart}
            end={gradientEnd}
            colors={['#ff3b30', '#ff9500', '#ffcc00', '#4cd964', '#34aadc', '#5856d6', '#ff3b30']}
          />
        </RoundedRect>
      </Mask>
    </Group>
  );

  useFocusEffect(
    useCallback(() => {
      Gyroscope.setUpdateInterval(16);
      if (enabled) {
        let prev = Date.now();
        const unsubscribe = Gyroscope.addListener((gyroscopeData) => {
          const now = Date.now();
          const dt = (now - prev) / 1000; // 초
          prev = now;

          rotateX.value = clamp(rotateX.value + (gyroscopeData.x / 2) * dt * RAD2DEG, -maxAngle, maxAngle);
          rotateY.value = clamp(rotateY.value - (gyroscopeData.y / 2) * dt * RAD2DEG, -maxAngle, maxAngle);
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
      }
    }, [enabled, maxAngle]),
  );

  return (
    <Animated.View style={[rStyle, style]}>
      {children}

      <Canvas
        pointerEvents={'none'}
        style={[
          StyleSheet.absoluteFill,
          {
            width,
            height,
            borderRadius: 17,
            overflow: 'hidden',
          },
        ]}
      >
        {hologramMaskSource ? renderHologramLayer() : null}
        <RoundedRect x={0} y={0} r={17} width={width} height={height}>
          <LinearGradient
            start={gradientStart}
            end={gradientEnd}
            colors={[
              'rgba(0, 0, 0, 0)',
              'rgba(255, 255, 255, 0.15)',
              'rgba(0, 0, 0, 0)',
              'rgba(255, 255, 255, 0.3)',
              'rgba(0, 0, 0, 0)',

              'rgba(255, 255, 255, 0.2)',
              'rgba(0, 0, 0, 0)',
              'rgba(255, 255, 255, 0.15)',
            ]}
            positions={[0, 0.1, 0.25, 0.35, 0.5, 0.65, 0.8, 1]}
          />
        </RoundedRect>
      </Canvas>
    </Animated.View>
  );
};
