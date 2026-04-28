import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/api/endpoints/profile';
import { signOut } from '@/lib/auth';
import { colors, typography, radius, elevation } from '@/constants/theme';

function SettingsRow({ label, value, onPress, danger }: { label: string; value?: string; onPress?: () => void; danger?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: colors.neutral[0],
      }}
    >
      <Text style={{ ...typography.body, color: danger ? '#EF4444' : colors.neutral[900] }}>{label}</Text>
      {value && <Text style={{ ...typography.body, color: colors.neutral[400] }}>{value}</Text>}
      {!value && onPress && <Text style={{ color: colors.neutral[300], fontSize: 18 }}>›</Text>}
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ ...typography.footnote, color: colors.neutral[500], fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, paddingHorizontal: 4 }}>
        {title}
      </Text>
      <View style={{ borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.neutral[100], ...elevation[0] }}>
        {children}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: getProfile });

  const handleSignOut = () => {
    Alert.alert(
      'Sign out',
      'Your local data will be cleared. Make sure everything is synced.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/sign-in');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 }}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 28, color: colors.neutral[600], lineHeight: 32 }}>‹</Text>
        </Pressable>
        <Text style={{ ...typography.title2, color: colors.neutral[900] }}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {profile && (
          <Section title="Profile">
            <SettingsRow label="Name" value={profile.name} />
            <View style={{ height: 1, backgroundColor: colors.neutral[100], marginHorizontal: 16 }} />
            <SettingsRow label="Division" value={profile.sex === 'male' ? 'Male' : 'Female'} />
            <View style={{ height: 1, backgroundColor: colors.neutral[100], marginHorizontal: 16 }} />
            <SettingsRow label="Units" value={`${profile.units_weight} / ${profile.units_measurement}`} />
          </Section>
        )}

        <Section title="Account">
          <SettingsRow label="Sign out" onPress={handleSignOut} danger />
        </Section>

        <Text style={{ ...typography.footnote, color: colors.neutral[400], textAlign: 'center', marginTop: 8 }}>
          PrepMax AI v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
