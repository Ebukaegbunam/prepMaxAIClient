import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Dumbbell, UtensilsCrossed, TrendingUp, Trophy } from 'lucide-react-native';
import { colors, iconSize } from '@/constants/theme';
import { useHaptic } from '@/lib/haptics';

export default function TabLayout() {
  const haptic = useHaptic();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.neutral[100],
          backgroundColor: colors.neutral[0],
        },
        tabBarActiveTintColor: colors.brand[500],
        tabBarInactiveTintColor: colors.neutral[500],
        tabBarLabelStyle: {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '500',
        },
      }}
      screenListeners={{
        tabPress: () => haptic('tabChange'),
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Home size={iconSize.nav} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts/index"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color }) => (
            <Dumbbell size={iconSize.nav} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="food/index"
        options={{
          title: 'Food',
          tabBarIcon: ({ color }) => (
            <UtensilsCrossed size={iconSize.nav} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress/index"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => (
            <TrendingUp size={iconSize.nav} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="competitions/index"
        options={{
          title: 'Competitions',
          tabBarIcon: ({ color }) => (
            <Trophy size={iconSize.nav} color={color} strokeWidth={2} />
          ),
        }}
      />
      {/* These screens live inside (tabs)/ but are not tab bar items */}
      <Tabs.Screen name="workouts/[day]" options={{ href: null }} />
      <Tabs.Screen name="workouts/session" options={{ href: null }} />
    </Tabs>
  );
}
