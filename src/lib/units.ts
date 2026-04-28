import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/api/endpoints/profile';

export type WeightUnit = 'kg' | 'lb';
export type LengthUnit = 'cm' | 'in';

const KG_TO_LB = 2.20462262;
const CM_TO_IN = 0.393701;

export function kgToLb(kg: number) { return kg * KG_TO_LB; }
export function lbToKg(lb: number) { return lb / KG_TO_LB; }
export function cmToIn(cm: number) { return cm * CM_TO_IN; }

export function formatWeight(kg: number, unit: WeightUnit, decimals = 1): string {
  const val = unit === 'lb' ? kgToLb(kg) : kg;
  return `${val.toFixed(decimals)} ${unit}`;
}

export function formatHeight(cm: number, unit: LengthUnit): string {
  if (unit === 'in') {
    const totalIn = cmToIn(cm);
    const ft = Math.floor(totalIn / 12);
    const inches = Math.round(totalIn % 12);
    return `${ft}'${inches}"`;
  }
  return `${Math.round(cm)} cm`;
}

export function useUnits() {
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: getProfile });
  const weightUnit: WeightUnit = profile?.units_weight ?? 'kg';
  const lengthUnit: LengthUnit = profile?.units_measurement ?? 'cm';
  const isImperial = weightUnit === 'lb';

  return {
    weightUnit,
    lengthUnit,
    isImperial,
    fw: (kg: number, decimals = 1) => formatWeight(kg, weightUnit, decimals),
    fwVal: (kg: number, decimals = 1) => {
      const val = weightUnit === 'lb' ? kgToLb(kg) : kg;
      return parseFloat(val.toFixed(decimals));
    },
    fh: (cm: number) => formatHeight(cm, lengthUnit),
  };
}
