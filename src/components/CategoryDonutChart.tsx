import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { CategorySpending } from '../types';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { formatCurrency } from '../utils/formatters';

interface CategoryDonutChartProps {
  categorySpendings: CategorySpending[];
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ categorySpendings }) => {
  const activeSpendings = categorySpendings.filter((c) => c.totalSpent > 0);
  const totalExpense = activeSpendings.reduce((sum, c) => sum + c.totalSpent, 0);

  const radius = 64;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercentage = 0;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.sectionTitle}>Category Spending Distribution</Text>

      <View style={styles.chartAndCenter}>
        <Svg width={180} height={180} viewBox="0 0 180 180">
          <G rotation="-90" origin="90, 90">
            {/* Background Base Ring */}
            <Circle
              cx={90}
              cy={90}
              r={radius}
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Slices */}
            {totalExpense > 0 ? (
              activeSpendings.map((item, index) => {
                const fraction = item.totalSpent / totalExpense;
                const strokeDasharray = `${circumference * fraction} ${circumference}`;
                const strokeDashoffset = -circumference * accumulatedPercentage;
                accumulatedPercentage += fraction;

                return (
                  <Circle
                    key={`slice-${item.category.id}-${index}`}
                    cx={90}
                    cy={90}
                    r={radius}
                    stroke={item.category.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    fill="transparent"
                    strokeLinecap="round"
                  />
                );
              })
            ) : (
              <Circle
                cx={90}
                cy={90}
                r={radius}
                stroke={PALETTE.lightSlate}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
            )}
          </G>
        </Svg>

        <View style={styles.centerTextContainer}>
          <Text style={styles.centerLabel}>Total Spent</Text>
          <Text style={styles.centerAmount}>{formatCurrency(totalExpense)}</Text>
        </View>
      </View>

      {/* Breakdown list */}
      <View style={styles.breakdownList}>
        {activeSpendings.length > 0 ? (
          activeSpendings.map((item) => (
            <View key={item.category.id} style={styles.categoryRow}>
              <View style={styles.categoryLeft}>
                <View style={[styles.colorDot, { backgroundColor: item.category.color }]} />
                <Text style={styles.catName}>{item.category.name}</Text>
              </View>

              <View style={styles.categoryRight}>
                <Text style={styles.catAmount}>{formatCurrency(item.totalSpent)}</Text>
                <View style={[styles.percentBadge, { backgroundColor: item.category.bgColor }]}>
                  <Text style={[styles.percentText, { color: item.category.color }]}>
                    {item.percentageOfExpenses}%
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No expenses recorded for this period.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate, // #CBD5E1
    ...SHADOWS.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.deepBlack, // #0B0F14 Primary text
    marginBottom: SPACING.sm,
  },
  chartAndCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: SPACING.xs,
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    fontSize: 11,
    color: PALETTE.slateBlue, // #64748B Secondary text
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  centerAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: PALETTE.deepBlack, // #0B0F14 Primary text
    marginTop: 2,
  },
  breakdownList: {
    marginTop: SPACING.md,
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  catName: {
    fontSize: 13,
    color: PALETTE.deepBlack,
    fontWeight: '500',
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.deepBlack,
  },
  percentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    minWidth: 38,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 225, 0.4)',
  },
  percentText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: PALETTE.slateBlue,
    paddingVertical: SPACING.md,
    fontSize: 13,
  },
});
