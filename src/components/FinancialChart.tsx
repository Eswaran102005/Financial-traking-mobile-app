import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { PeriodFilter, Transaction } from '../types';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';

interface FinancialChartProps {
  transactions: Transaction[];
  period: PeriodFilter;
}

const { width: screenWidth } = Dimensions.get('window');
const CHART_WIDTH = screenWidth - SPACING.lg * 2 - SPACING.lg * 2;
const CHART_HEIGHT = 180;

export const FinancialChart: React.FC<FinancialChartProps> = ({ transactions, period }) => {
  // Build data points depending on period
  const getDataPoints = () => {
    if (period === 'daily') {
      return [
        { label: 'Morning', income: 0, expense: 0 },
        { label: 'Afternoon', income: 0, expense: 0 },
        { label: 'Evening', income: 0, expense: 0 },
        { label: 'Night', income: 0, expense: 0 },
      ];
    } else if (period === 'weekly') {
      return [
        { label: 'Mon', income: 0, expense: 0 },
        { label: 'Tue', income: 0, expense: 0 },
        { label: 'Wed', income: 0, expense: 0 },
        { label: 'Thu', income: 0, expense: 0 },
        { label: 'Fri', income: 0, expense: 0 },
        { label: 'Sat', income: 0, expense: 0 },
        { label: 'Sun', income: 0, expense: 0 },
      ];
    } else {
      return [
        { label: 'Wk 1', income: 0, expense: 0 },
        { label: 'Wk 2', income: 0, expense: 0 },
        { label: 'Wk 3', income: 0, expense: 0 },
        { label: 'Wk 4', income: 0, expense: 0 },
      ];
    }
  };

  const dataPoints = getDataPoints();

  // Populate dataPoints from transactions
  transactions.forEach((t) => {
    const parts = t.date.split('-');
    if (parts.length === 3) {
      const dayOfMonth = parseInt(parts[2], 10);
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, dayOfMonth);

      if (period === 'weekly') {
        const dayIdx = (d.getDay() + 6) % 7; // Monday = 0
        if (dataPoints[dayIdx]) {
          if (t.type === 'income') dataPoints[dayIdx].income += t.amount;
          else dataPoints[dayIdx].expense += t.amount;
        }
      } else if (period === 'monthly') {
        const weekIdx = Math.min(3, Math.floor((dayOfMonth - 1) / 7));
        if (dataPoints[weekIdx]) {
          if (t.type === 'income') dataPoints[weekIdx].income += t.amount;
          else dataPoints[weekIdx].expense += t.amount;
        }
      } else {
        const idx = Math.abs(t.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 4;
        if (dataPoints[idx]) {
          if (t.type === 'income') dataPoints[idx].income += t.amount;
          else dataPoints[idx].expense += t.amount;
        }
      }
    }
  });

  // Calculate max value for scaling
  let maxVal = 1000;
  dataPoints.forEach((dp) => {
    if (dp.income > maxVal) maxVal = dp.income;
    if (dp.expense > maxVal) maxVal = dp.expense;
  });
  maxVal = Math.ceil(maxVal * 1.15);

  const barGroupWidth = CHART_WIDTH / dataPoints.length;
  const barWidth = Math.min(14, barGroupWidth * 0.28);
  const graphBottom = CHART_HEIGHT - 25;
  const graphTop = 20;
  const graphHeight = graphBottom - graphTop;

  return (
    <View style={styles.chartWrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.chartTitle}>Cashflow Comparison</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.income }]} />
            <Text style={styles.legendText}>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.expense }]} />
            <Text style={styles.legendText}>Expense</Text>
          </View>
        </View>
      </View>

      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* Background Grid Lines */}
        <Line
          x1={0}
          y1={graphTop}
          x2={CHART_WIDTH}
          y2={graphTop}
          stroke={PALETTE.lightSlate}
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <Line
          x1={0}
          y1={graphTop + graphHeight / 2}
          x2={CHART_WIDTH}
          y2={graphTop + graphHeight / 2}
          stroke={PALETTE.lightSlate}
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <Line
          x1={0}
          y1={graphBottom}
          x2={CHART_WIDTH}
          y2={graphBottom}
          stroke={PALETTE.lightSlate}
          strokeWidth={1.5}
        />

        {/* Render Bars */}
        {dataPoints.map((item, idx) => {
          const groupCenter = idx * barGroupWidth + barGroupWidth / 2;
          const incomeHeight = maxVal > 0 ? (item.income / maxVal) * graphHeight : 0;
          const expenseHeight = maxVal > 0 ? (item.expense / maxVal) * graphHeight : 0;

          const incomeX = groupCenter - barWidth - 2;
          const incomeY = graphBottom - incomeHeight;

          const expenseX = groupCenter + 2;
          const expenseY = graphBottom - expenseHeight;

          return (
            <G key={`group-${idx}`}>
              {/* Income Bar */}
              <Rect
                x={incomeX}
                y={Math.min(incomeY, graphBottom - 2)}
                width={barWidth}
                height={Math.max(2, incomeHeight)}
                rx={3}
                fill={COLORS.income}
              />

              {/* Expense Bar */}
              <Rect
                x={expenseX}
                y={Math.min(expenseY, graphBottom - 2)}
                width={barWidth}
                height={Math.max(2, expenseHeight)}
                rx={3}
                fill={COLORS.expense}
              />

              {/* X Axis Label */}
              <SvgText
                x={groupCenter}
                y={CHART_HEIGHT - 6}
                fontSize={11}
                fontWeight="600"
                fill={PALETTE.slateBlue}
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate, // #CBD5E1
    ...SHADOWS.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.deepBlack, // #0B0F14 Primary text
  },
  legendRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.slateBlue, // #64748B Secondary text
  },
});
