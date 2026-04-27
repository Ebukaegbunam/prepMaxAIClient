import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO(phase-home): today card with calorie ring + hero numeral, week strip, quick actions
export default function HomeTab() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 items-center justify-center">
        <Text className="text-title-2 text-neutral-800">Home</Text>
        <Text className="text-callout text-neutral-500 mt-2">Today card coming in Phase 6</Text>
      </View>
    </SafeAreaView>
  );
}
