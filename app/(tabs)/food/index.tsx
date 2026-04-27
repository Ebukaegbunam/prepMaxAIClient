import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO(phase-food): today view, meal logger, mid-day chat, restaurant lookup
export default function FoodTab() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 items-center justify-center">
        <Text className="text-title-2 text-neutral-800">Food</Text>
        <Text className="text-callout text-neutral-500 mt-2">Meal logger coming in Phase 9</Text>
      </View>
    </SafeAreaView>
  );
}
