import { View, Text, TextInput, Pressable, TextInputProps } from 'react-native';
import { colors, typography, radius } from '@/constants/theme';

interface FieldProps extends TextInputProps {
  label: string;
  error?: string;
  suffix?: string;
}

export function Field({ label, error, suffix, style, ...props }: FieldProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ ...typography.footnote, color: colors.neutral[600], fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[
            {
              flex: 1,
              borderWidth: 1,
              borderColor: error ? colors.danger[500] : colors.neutral[200],
              borderRadius: radius.md,
              paddingHorizontal: 14,
              paddingVertical: 13,
              fontSize: 16,
              color: colors.neutral[900],
              backgroundColor: colors.neutral[0],
            },
            style,
          ]}
          placeholderTextColor={colors.neutral[400]}
          {...props}
        />
        {suffix && (
          <Text style={{ ...typography.body, color: colors.neutral[500], marginLeft: 10 }}>
            {suffix}
          </Text>
        )}
      </View>
      {error && (
        <Text style={{ ...typography.footnote, color: colors.danger[500], marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
}

interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentPickerProps<T extends string> {
  label: string;
  options: SegmentOption<T>[];
  value: T | null;
  onChange: (val: T) => void;
}

export function SegmentPicker<T extends string>({ label, options, value, onChange }: SegmentPickerProps<T>) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ ...typography.footnote, color: colors.neutral[600], fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: radius.md,
                borderWidth: 1.5,
                borderColor: active ? colors.brand[500] : colors.neutral[200],
                backgroundColor: active ? colors.brand[50] : colors.neutral[0],
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: active ? colors.brand[600] : colors.neutral[600] }}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

interface ChipGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export function ChipGroup({ label, options, selected, onChange }: ChipGroupProps) {
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((x) => x !== val) : [...selected, val]);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ ...typography.footnote, color: colors.neutral[600], fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <Pressable
              key={opt}
              onPress={() => toggle(opt)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: active ? colors.brand[500] : colors.neutral[200],
                backgroundColor: active ? colors.brand[50] : colors.neutral[0],
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '500', color: active ? colors.brand[600] : colors.neutral[600] }}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  suffix?: string;
}

export function Stepper({ label, value, min, max, onChange, suffix }: StepperProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ ...typography.footnote, color: colors.neutral[600], fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Pressable
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: value <= min ? colors.neutral[100] : colors.brand[50],
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 22, color: value <= min ? colors.neutral[300] : colors.brand[500], lineHeight: 26, fontWeight: '600' }}>−</Text>
        </Pressable>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.neutral[900], minWidth: 40, textAlign: 'center' }}>
          {value}{suffix ?? ''}
        </Text>
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: value >= max ? colors.neutral[100] : colors.brand[50],
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 22, color: value >= max ? colors.neutral[300] : colors.brand[500], lineHeight: 26, fontWeight: '600' }}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}
