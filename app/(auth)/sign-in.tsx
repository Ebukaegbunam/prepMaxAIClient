import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO(phase-auth): wire to GET /auth/google/start → expo-web-browser → POST /auth/google/callback
export default function SignIn() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-0">
      <View className="flex-1 items-center justify-center px-4 gap-6">
        <Text className="text-title-1 text-neutral-900">PrepMax AI</Text>
        <Text className="text-body text-neutral-500 text-center">
          Your 16-week classic physique prep coach.
        </Text>
        <Pressable
          className="w-full bg-brand-500 rounded-sm h-11 items-center justify-center"
          onPress={() => { /* TODO */ }}
        >
          <Text className="text-body-strong text-white">Continue with Google</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
