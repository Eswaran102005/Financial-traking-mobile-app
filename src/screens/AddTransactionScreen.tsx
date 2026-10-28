import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft,
  Check,
  Calendar,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { CategoryIcon } from '../components/CategoryIcon';
import { CategoryId, TransactionType } from '../types';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { getTodayDateString } from '../utils/formatters';
import { useScreenEntryAnimation } from '../hooks/useScreenEntryAnimation';

export const AddTransactionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { editTransactionId, prefillCategoryId } = route.params || {};
  const { categories, transactions, addTransaction, updateTransaction } = useApp();

  // Repeat-on-focus staggered left-right entrance animation hook
  const { getSlideStyle } = useScreenEntryAnimation({
    staggerCount: 6,
    duration: 380,
    staggerDelay: 70,
    offsetDistance: 38,
    initialOpacity: 0.8,
  });

  const isEditing = Boolean(editTransactionId);
  const existingTx = isEditing
    ? transactions.find((t) => t.id === editTransactionId)
    : null;

  const [title, setTitle] = useState(existingTx ? existingTx.title : '');
  const [amount, setAmount] = useState(existingTx ? existingTx.amount.toString() : '');
  const [type, setType] = useState<TransactionType>(existingTx ? existingTx.type : 'expense');
  const [categoryId, setCategoryId] = useState<CategoryId>(
    existingTx
      ? existingTx.categoryId
      : prefillCategoryId || 'food'
  );
  const [date, setDate] = useState(existingTx ? existingTx.date : getTodayDateString());
  const [note, setNote] = useState(existingTx?.note || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Transaction title is required.';
    } else if (title.trim().length > 60) {
      newErrors.title = 'Title must be 60 characters or less.';
    }

    const numAmount = parseFloat(amount);
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required.';
    } else if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Amount must be a positive number greater than 0.';
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date.trim() || !dateRegex.test(date.trim())) {
      newErrors.date = 'Date must be in YYYY-MM-DD format.';
    }

    if (!categoryId) {
      newErrors.categoryId = 'Please select a category.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const numericAmount = parseFloat(amount);

    if (isEditing && editTransactionId) {
      const res = updateTransaction(editTransactionId, {
        title: title.trim(),
        amount: numericAmount,
        type,
        categoryId,
        date: date.trim(),
        note: note.trim(),
      });
      if (res.success) {
        navigation.goBack();
      } else if (res.error) {
        setErrors({ form: res.error });
      }
    } else {
      const res = addTransaction({
        title: title.trim(),
        amount: numericAmount,
        type,
        categoryId,
        date: date.trim(),
        note: note.trim(),
      });
      if (res.success) {
        navigation.goBack();
      } else if (res.error) {
        setErrors({ form: res.error });
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header: slide in from left */}
      <Animated.View style={[styles.header, getSlideStyle(0, 'left')]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color={PALETTE.deepBlack} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Transaction' : 'New Transaction'}
        </Text>
        <Pressable onPress={handleSave} style={styles.saveHeaderButton}>
          <Text style={styles.saveHeaderButtonText}>Save</Text>
        </Pressable>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {errors.form ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errors.form}</Text>
            </View>
          ) : null}

          {/* Type Toggle: Expense vs Income: slide in from right */}
          <Animated.View style={[styles.typeToggleContainer, getSlideStyle(1, 'right')]}>
            <Pressable
              onPress={() => setType('expense')}
              style={[
                styles.typeButton,
                type === 'expense' && styles.typeButtonExpenseActive,
              ]}
            >
              <ArrowDownLeft
                size={18}
                color={type === 'expense' ? PALETTE.offWhite : COLORS.expense}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'expense' && styles.typeButtonTextActive,
                ]}
              >
                Expense
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setType('income')}
              style={[
                styles.typeButton,
                type === 'income' && styles.typeButtonIncomeActive,
              ]}
            >
              <ArrowUpRight
                size={18}
                color={type === 'income' ? PALETTE.offWhite : COLORS.income}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'income' && styles.typeButtonTextActive,
                ]}
              >
                Income
              </Text>
            </Pressable>
          </Animated.View>

          {/* Main Input Card: slide in from left */}
          <Animated.View style={[styles.card, getSlideStyle(2, 'left')]}>
            {/* Amount */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Amount (₹) <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.amountInputWrapper, errors.amount && styles.inputError]}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  value={amount}
                  onChangeText={(val) => {
                    setAmount(val);
                    if (errors.amount) setErrors({ ...errors, amount: '' });
                  }}
                  placeholder="0.00"
                  placeholderTextColor={PALETTE.slateBlue}
                  keyboardType="numeric"
                  style={styles.amountInput}
                  autoFocus={!isEditing}
                />
              </View>
              {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}
            </View>

            {/* Title / Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Transaction Name <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, errors.title && styles.inputError]}>
                <FileText size={18} color={PALETTE.slateBlue} />
                <TextInput
                  value={title}
                  onChangeText={(val) => {
                    setTitle(val);
                    if (errors.title) setErrors({ ...errors, title: '' });
                  }}
                  placeholder="e.g. Gourmet Lunch with Team"
                  placeholderTextColor={PALETTE.slateBlue}
                  style={styles.input}
                />
              </View>
              {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
            </View>

            {/* Date */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Date (YYYY-MM-DD) <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, errors.date && styles.inputError]}>
                <Calendar size={18} color={PALETTE.slateBlue} />
                <TextInput
                  value={date}
                  onChangeText={(val) => {
                    setDate(val);
                    if (errors.date) setErrors({ ...errors, date: '' });
                  }}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={PALETTE.slateBlue}
                  style={styles.input}
                />
              </View>
              {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
            </View>

            {/* Optional Note */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Description / Note (Optional)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add details, receipt reference, or note..."
                  placeholderTextColor={PALETTE.slateBlue}
                  style={[styles.input, { minHeight: 45 }]}
                  multiline
                />
              </View>
            </View>
          </Animated.View>

          {/* Category Picker Section: slide in from right */}
          <Animated.View style={[styles.categoryPickerSection, getSlideStyle(3, 'right')]}>
            <Text style={styles.sectionHeading}>
              Select Category <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.categoryGrid}>
              {categories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => {
                      setCategoryId(cat.id);
                      if (errors.categoryId) setErrors({ ...errors, categoryId: '' });
                    }}
                    style={[
                      styles.categoryTile,
                      isSelected && {
                        borderColor: PALETTE.darkNavy,
                        backgroundColor: '#FFFFFF',
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <CategoryIcon
                      iconName={cat.iconName}
                      color={isSelected ? PALETTE.darkNavy : PALETTE.slateBlue}
                      bgColor={isSelected ? PALETTE.offWhite : cat.bgColor}
                      size={22}
                      containerSize={44}
                    />
                    <Text
                      style={[
                        styles.categoryTileText,
                        isSelected && { color: PALETTE.darkNavy, fontWeight: '700' },
                      ]}
                      numberOfLines={1}
                    >
                      {cat.name.split(' ')[0]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.categoryId ? (
              <Text style={styles.errorText}>{errors.categoryId}</Text>
            ) : null}
          </Animated.View>

          {/* Submit Action: slide in from left */}
          <Animated.View style={getSlideStyle(4, 'left')}>
            <Pressable onPress={handleSave} style={styles.submitButton}>
              <Check size={20} color={PALETTE.offWhite} />
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Update Transaction' : 'Save Transaction'}
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.offWhite, // #F8FAFC
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    backgroundColor: PALETTE.offWhite,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.lightSlate, // #CBD5E1 subtle border
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: PALETTE.deepBlack, // #0B0F14
  },
  saveHeaderButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    backgroundColor: PALETTE.darkNavy, // #24303E primary button
  },
  saveHeaderButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.offWhite, // #F8FAFC
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxxl,
    paddingTop: SPACING.md,
  },
  errorBanner: {
    backgroundColor: COLORS.expenseBg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
  },
  errorBannerText: {
    color: COLORS.expense,
    fontSize: 13,
    fontWeight: '600',
  },
  typeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: 4,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    gap: 4,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  typeButtonExpenseActive: {
    backgroundColor: COLORS.expense,
  },
  typeButtonIncomeActive: {
    backgroundColor: COLORS.income,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: PALETTE.slateBlue,
  },
  typeButtonTextActive: {
    color: PALETTE.offWhite,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  fieldContainer: {},
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: PALETTE.deepBlack,
    marginBottom: 6,
  },
  required: {
    color: COLORS.expense,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.offWhite,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: PALETTE.slateBlue,
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '800',
    color: PALETTE.deepBlack,
    paddingVertical: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.offWhite,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  inputError: {
    borderColor: COLORS.expense,
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: PALETTE.deepBlack,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.expense,
    marginTop: 4,
    fontWeight: '500',
  },
  categoryPickerSection: {
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.lg,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.slateBlue,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTile: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    ...SHADOWS.sm,
  },
  categoryTileText: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.slateBlue,
    marginTop: 6,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.darkNavy, // #24303E primary button
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    paddingVertical: 15,
    borderRadius: RADIUS.lg,
    ...SHADOWS.md,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.offWhite, // #F8FAFC text
  },
});
