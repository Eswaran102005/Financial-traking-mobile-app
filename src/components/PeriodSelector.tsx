import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PeriodFilter } from '../types';
import { COLORS, PALETTE, RADIUS, SPACING } from '../constants/theme';

interface PeriodSelectorProps {
  selectedPeriod: PeriodFilter;
  onSelectPeriod: (period: PeriodFilter) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onSelectPeriod,
}) => {
  const periods: { key: PeriodFilter; label: string }[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];

  return (
    <View style={styles.container}>
      {periods.map((item) => {
        const isActive = selectedPeriod === item.key;
        return (
          <Pressable
            key={item.key}
            onPress={() => onSelectPeriod(item.key)}
            style={[styles.pill, isActive && styles.activePill]}
          >
            <Text style={[styles.pillText, isActive && styles.activePillText]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.full,
    padding: 3,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
  },
  pill: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
  },
  activePill: {
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy active
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: PALETTE.slateBlue, // #64748B Slate Blue inactive
  },
  activePillText: {
    color: PALETTE.offWhite, // #F8FAFC Off White text
    fontWeight: '700',
  },
});
