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
import {
  UserPlus,
  User as UserIcon,
  Mail,
  Lock,
  ArrowLeft,
  Shield,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useScreenEntryAnimation } from '../hooks/useScreenEntryAnimation';

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { signUp } = useApp();

  // Repeat-on-focus staggered left-right entrance animation hook
  const { getSlideStyle } = useScreenEntryAnimation({
    staggerCount: 4,
    duration: 380,
    staggerDelay: 70,
    offsetDistance: 38,
    initialOpacity: 0.8,
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

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

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    setLoading(true);
    const res = await signUp(name.trim(), email.trim(), password.trim(), role);
    setLoading(false);

    if (res.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainDrawer' }],
      });
    } else {
      setErrors({ form: res.error || 'Failed to create account.' });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

      {/* Header: slide in from left */}
      <Animated.View style={[styles.header, getSlideStyle(0, 'left')]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Back to sign in"
        >
          <ArrowLeft size={22} color={PALETTE.deepBlack} />
        </Pressable>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={{ width: 40 }} />
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
          {/* Form Card: slide in from right */}
          <Animated.View style={[styles.formCard, getSlideStyle(1, 'right')]}>
            <Text style={styles.formTitle}>Join FinTrack</Text>
            <Text style={styles.formSubtitle}>Create your smart budgeting profile</Text>

            {errors.form ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errors.form}</Text>
              </View>
            ) : null}

            {/* Role Selection */}
            <View style={styles.roleSelectionSection}>
              <Text style={styles.label}>Select Account Role</Text>
              <View style={styles.roleToggleRow}>
                <Pressable
                  onPress={() => setRole('customer')}
                  style={[
                    styles.roleOption,
                    role === 'customer' && styles.roleOptionCustomerActive,
                  ]}
                >
                  <UserIcon
                    size={16}
                    color={role === 'customer' ? PALETTE.offWhite : PALETTE.slateBlue}
                  />
                  <Text
                    style={[
                      styles.roleOptionText,
                      role === 'customer' && styles.roleOptionTextActive,
                    ]}
                  >
                    Customer
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setRole('admin')}
                  style={[styles.roleOption, role === 'admin' && styles.roleOptionAdminActive]}
                >
                  <Shield
                    size={16}
                    color={role === 'admin' ? PALETTE.offWhite : PALETTE.slateBlue}
                  />
                  <Text
                    style={[
                      styles.roleOptionText,
                      role === 'admin' && styles.roleOptionTextActive,
                    ]}
                  >
                    Admin
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Full Name <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                <UserIcon size={18} color={PALETTE.slateBlue} />
                <TextInput
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="e.g. Alex Morgan"
                  placeholderTextColor={PALETTE.slateBlue}
                  autoCapitalize="words"
                  style={styles.input}
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
                  onChangeText={(t) => {
                    setEmail(t);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="e.g. alex@budget.com"
                  placeholderTextColor={PALETTE.slateBlue}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Password (min 6 chars) <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <Lock size={18} color={PALETTE.slateBlue} />
                <TextInput
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="Create a secure password"
                  placeholderTextColor={PALETTE.slateBlue}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Confirm Password <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                <Lock size={18} color={PALETTE.slateBlue} />
                <TextInput
                  value={confirmPassword}
                  onChangeText={(t) => {
                    setConfirmPassword(t);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  placeholder="Re-enter password to confirm"
                  placeholderTextColor={PALETTE.slateBlue}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            {/* Submit */}
            <Pressable
              onPress={handleSignUp}
              style={[styles.signUpButton, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              <UserPlus size={18} color={PALETTE.offWhite} />
              <Text style={styles.signUpButtonText}>
                {loading ? 'Registering...' : 'Register Account'}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Link back to sign in: slide in from left */}
          <Animated.View style={[styles.footerRow, getSlideStyle(2, 'left')]}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.footerLink}>Sign In</Text>
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
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    ...SHADOWS.md,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: PALETTE.deepBlack,
  },
  formSubtitle: {
    fontSize: 13,
    color: PALETTE.slateBlue,
    marginBottom: SPACING.lg,
    marginTop: 2,
  },
  errorBanner: {
    backgroundColor: COLORS.expenseBg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
  },
  errorText: {
    color: COLORS.expense,
    fontSize: 13,
    fontWeight: '600',
  },
  roleSelectionSection: {
    marginBottom: SPACING.md,
  },
  roleToggleRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    backgroundColor: PALETTE.offWhite,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
  },
  roleOptionCustomerActive: {
    backgroundColor: PALETTE.darkNavy, // #24303E
    borderColor: PALETTE.darkNavy,
  },
  roleOptionAdminActive: {
    backgroundColor: PALETTE.deepBlack, // #0B0F14
    borderColor: PALETTE.deepBlack,
  },
  roleOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: PALETTE.slateBlue, // #64748B
  },
  roleOptionTextActive: {
    color: PALETTE.offWhite, // #F8FAFC
    fontWeight: '700',
  },
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: PALETTE.deepBlack,
    marginBottom: 6,
  },
  required: {
    color: COLORS.expense,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.offWhite,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate,
    borderRadius: RADIUS.lg,
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
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PALETTE.darkNavy, // #24303E primary button
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.offWhite, // #F8FAFC
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.xl,
  },
  footerText: {
    fontSize: 13,
    color: PALETTE.slateBlue,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.darkNavy,
  },
});
