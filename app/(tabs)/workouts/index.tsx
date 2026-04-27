import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO(phase-workouts): week strip, day view, set logger
export default function WorkoutsTab() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 items-center justify-center">
        <Text className="text-title-2 text-neutral-800">Workouts</Text>
        <Text className="text-callout text-neutral-500 mt-2">Set logger coming in Phase 7</Text>
      </View>
    </SafeAreaView>
  );
}
