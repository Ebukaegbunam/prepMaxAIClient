import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO(phase-competitions): search, saved shows, current target competition
export default function CompetitionsTab() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="flex-1 items-center justify-center">
        <Text className="text-title-2 text-neutral-800">Competitions</Text>
        <Text className="text-callout text-neutral-500 mt-2">Competition search coming in Phase 13</Text>
      </View>
    </SafeAreaView>
  );
}
