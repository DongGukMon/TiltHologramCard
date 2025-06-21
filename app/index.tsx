import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SampleTiltCard } from '@/src/components/SampleTiltCard';

export default function Index() {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.7;
  const cardHeight = cardWidth * 1.5;
  return (
    <View style={styles.container}>
      <SampleTiltCard style={styles.cardContainer}>
        <Image
          source={require('../src/assets/luffy.png')}
          style={{ width: cardWidth, height: cardHeight, objectFit: 'contain' }}
        />
      </SampleTiltCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  cardContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
