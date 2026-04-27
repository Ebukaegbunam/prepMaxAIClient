import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO(phase-progress): body-part timeline, photo capture, weekly check-in, AI report viewer
export default function ProgressTab() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 items-center justify-center">
        <Text className="text-title-2 text-neutral-800">Progress</Text>
        <Text className="text-callout text-neutral-500 mt-2">Progress tracking coming in Phase 11</Text>
      </View>
    </SafeAreaView>
  );
}
