import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Stack } from 'expo-router';
import { TiltCard } from '@/src/components/TiltCard';

export default function Index() {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.7;
  const cardHeight = cardWidth * 1.5;
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <TiltCard
          width={cardWidth}
          height={cardHeight}
          hologramMaskSource={require('../src/assets/holo_background.png')}
        >
          <View style={styles.cardContainer}>
            <Image
              source={require('../src/assets/luffy.png')}
              style={{
                width: cardWidth,
                height: cardHeight,
                objectFit: 'contain',
              }}
            />
          </View>
        </TiltCard>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
