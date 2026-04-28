import { View, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/theme';

// Neutral loading screen — AuthGate in _layout.tsx handles all routing from here
export default function Entry() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.neutral[0], alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={colors.brand[500]} size="large" />
    </View>
  );
}
