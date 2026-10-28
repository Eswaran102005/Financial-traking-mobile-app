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
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Check, X, User, Mail, Phone, Wallet } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useScreenEntryAnimation } from '../hooks/useScreenEntryAnimation';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, updateProfile } = useApp();

  // Repeat-on-focus staggered left-right entrance animation hook
  const { getSlideStyle } = useScreenEntryAnimation({
    staggerCount: 6,
    duration: 380,
    staggerDelay: 70,
    offsetDistance: 38,
    initialOpacity: 0.8,
  });

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [monthlyBudget, setMonthlyBudget] = useState(
    user?.monthlyBudget ? user.monthlyBudget.toString() : '45000'
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (phone.trim() && phone.trim().length < 8) {
      newErrors.phone = 'Please enter a valid phone number (min 8 digits).';
    }

    const budgetNum = parseFloat(monthlyBudget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      newErrors.monthlyBudget = 'Monthly budget must be a positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const res = await updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      monthlyBudget: parseFloat(monthlyBudget),
    });

    if (res.success) {
      navigation.goBack();
    } else if (res.error) {
      setErrors({ form: res.error });
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
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
            <View style={styles.formErrorBanner}>
              <Text style={styles.formErrorText}>{errors.form}</Text>
            </View>
          ) : null}

          {/* Avatar preview: slide in from right */}
          <Animated.View style={[styles.avatarSection, getSlideStyle(1, 'right')]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {name.trim() ? name.substring(0, 2).toUpperCase() : 'CU'}
              </Text>
            </View>
            <Text style={styles.avatarSubtext}>Profile Identity</Text>
          </Animated.View>

          {/* Form Fields Card: slide in from left */}
          <Animated.View style={[styles.formCard, getSlideStyle(2, 'left')]}>
            {/* Full Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Full Name <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                <User size={18} color={PALETTE.slateBlue} />
                <TextInput
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="e.g. Alex Morgan"
                  placeholderTextColor={PALETTE.slateBlue}
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Email Address <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                <Mail size={18} color={PALETTE.slateBlue} />
                <TextInput
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="e.g. alex@budget.com"
                  placeholderTextColor={PALETTE.slateBlue}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Phone Number */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
                <Phone size={18} color={PALETTE.slateBlue} />
                <TextInput
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="e.g. +91 98765 43210"
                  placeholderTextColor={PALETTE.slateBlue}
                  style={styles.input}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>

            {/* Monthly Budget */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Monthly Spending Target (₹)</Text>
              <View style={[styles.inputWrapper, errors.monthlyBudget && styles.inputError]}>
                <Wallet size={18} color={PALETTE.slateBlue} />
                <TextInput
                  value={monthlyBudget}
                  onChangeText={(val) => {
                    setMonthlyBudget(val);
                    if (errors.monthlyBudget) setErrors({ ...errors, monthlyBudget: '' });
                  }}
                  placeholder="45000"
                  placeholderTextColor={PALETTE.slateBlue}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
              {errors.monthlyBudget ? (
                <Text style={styles.errorText}>{errors.monthlyBudget}</Text>
              ) : null}
            </View>
          </Animated.View>

          {/* Action Buttons: slide in from right */}
          <Animated.View style={[styles.buttonRow, getSlideStyle(3, 'right')]}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              accessibilityLabel="Cancel editing"
            >
              <X size={18} color={PALETTE.slateBlue} />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              style={styles.saveButton}
              accessibilityLabel="Save profile changes"
            >
              <Check size={18} color={PALETTE.offWhite} />
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
    backgroundColor: PALETTE.offWhite,
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
    borderBottomColor: PALETTE.lightSlate,
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
    color: PALETTE.deepBlack,
  },
  saveHeaderButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy
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
  formErrorBanner: {
    backgroundColor: '#FEE2E2',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  formErrorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: PALETTE.offWhite,
  },
  avatarSubtext: {
    fontSize: 12,
    color: PALETTE.slateBlue,
    marginTop: 4,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate, // #CBD5E1
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  fieldContainer: {},
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: PALETTE.deepBlack,
    marginBottom: 6,
  },
  required: {
    color: '#DC2626',
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
    borderColor: '#DC2626',
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
    color: '#DC2626',
    marginTop: 4,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: PALETTE.slateBlue,
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: PALETTE.darkNavy, // #24303E Dark Navy
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.offWhite,
  },
});
