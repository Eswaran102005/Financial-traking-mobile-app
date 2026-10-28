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
  LogIn,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  User as UserIcon,
  Sparkles,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { COLORS, PALETTE, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { DEMO_CREDENTIALS } from '../utils/demoData';
import { useScreenEntryAnimation } from '../hooks/useScreenEntryAnimation';

export const SignInScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { signIn } = useApp();

  // Repeat-on-focus staggered left-right entrance animation hook
  const { getSlideStyle } = useScreenEntryAnimation({
    staggerCount: 4,
    duration: 380,
    staggerDelay: 70,
    offsetDistance: 38,
    initialOpacity: 0.8,
  });

  const [email, setEmail] = useState('alex@budget.com');
  const [password, setPassword] = useState('customer123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please provide both your email and password.');
      return;
    }

    setLoading(true);
    const res = await signIn(email, password);
    setLoading(false);

    if (res.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainDrawer' }],
      });
    } else {
      setError(res.error || 'Authentication failed.');
    }
  };

  const quickFillAdmin = () => {
    const admin = DEMO_CREDENTIALS[0];
    setEmail(admin.email);
    setPassword(admin.password);
    setError('');
  };

  const quickFillCustomer = () => {
    const customer = DEMO_CREDENTIALS[1];
    setEmail(customer.email);
    setPassword(customer.password);
    setError('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Branding: slide in from left */}
          <Animated.View style={[styles.brandingSection, getSlideStyle(0, 'left')]}>
            <View style={styles.logoBadge}>
              <Sparkles size={28} color={PALETTE.offWhite} />
            </View>
            <Text style={styles.appTitle}>FinTrack</Text>
            <Text style={styles.appTagline}>Finance & Budget Tracker</Text>
          </Animated.View>

          {/* Quick Demo Fill Buttons Card: slide in from right */}
          <Animated.View style={[styles.quickFillCard, getSlideStyle(1, 'right')]}>
            <Text style={styles.quickFillHeading}>Demo Access Shortcuts (1-Click Fill)</Text>
            <View style={styles.quickFillRow}>
              <Pressable
                onPress={quickFillCustomer}
                style={styles.quickButton}
              >
                <UserIcon size={14} color={PALETTE.darkNavy} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.quickButtonTitle}>Customer</Text>
                  <Text style={styles.quickButtonEmail} numberOfLines={1}>alex@budget.com</Text>
                  <Text style={styles.quickButtonPass}>Pass: customer123</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={quickFillAdmin}
                style={styles.quickButton}
              >
                <Shield size={14} color={PALETTE.darkNavy} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.quickButtonTitle}>Admin</Text>
                  <Text style={styles.quickButtonEmail} numberOfLines={1}>admin@budget.com</Text>
                  <Text style={styles.quickButtonPass}>Pass: admin123</Text>
                </View>
              </Pressable>
            </View>
          </Animated.View>

          {/* Sign In Form Card: slide in from left */}
          <Animated.View style={[styles.formCard, getSlideStyle(2, 'left')]}>
            <Text style={styles.formTitle}>Welcome Back</Text>
            <Text style={styles.formSubtitle}>Sign in to your FinTrack dashboard</Text>

            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Email Input */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Mail size={18} color={PALETTE.slateBlue} />
                <TextInput
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (error) setError('');
                  }}
                  placeholder="e.g. alex@budget.com"
                  placeholderTextColor={PALETTE.slateBlue}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} color={PALETTE.slateBlue} />
                <TextInput
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (error) setError('');
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor={PALETTE.slateBlue}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSignIn}
              style={[styles.signInButton, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              <Text style={styles.signInButtonText}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </Text>
              <LogIn size={18} color={PALETTE.offWhite} />
            </Pressable>
          </Animated.View>

          {/* Footer to Sign Up: slide in from right */}
          <Animated.View style={[styles.footerSection, getSlideStyle(3, 'right')]}>
            <Text style={styles.footerPrompt}>Don't have an account yet?</Text>
            <Pressable
              onPress={() => navigation.navigate('SignUp')}
              style={styles.signUpLinkButton}
            >
              <Text style={styles.signUpLinkText}>Create an Account</Text>
              <ArrowRight size={14} color={PALETTE.darkNavy} />
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
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PALETTE.darkNavy, // #24303E
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.md,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: PALETTE.deepBlack, // #0B0F14
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 13,
    color: PALETTE.slateBlue, // #64748B
    marginTop: 2,
  },
  quickFillCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: PALETTE.lightSlate, // #CBD5E1
    ...SHADOWS.sm,
  },
  quickFillHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: PALETTE.slateBlue,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  quickFillRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  quickButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    backgroundColor: PALETTE.offWhite,
    borderColor: PALETTE.lightSlate,
  },
  quickButtonTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: PALETTE.darkNavy,
  },
  quickButtonEmail: {
    fontSize: 10,
    color: PALETTE.slateBlue,
  },
  quickButtonPass: {
    fontSize: 9,
    color: PALETTE.slateBlue,
    marginTop: 1,
    fontWeight: '500',
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
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: PALETTE.deepBlack,
    marginBottom: 6,
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
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: PALETTE.deepBlack,
  },
  signInButton: {
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
  signInButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.offWhite, // #F8FAFC text
  },
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.xl,
  },
  footerPrompt: {
    fontSize: 13,
    color: PALETTE.slateBlue,
  },
  signUpLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  signUpLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.darkNavy,
  },
});
