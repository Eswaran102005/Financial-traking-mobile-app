import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  HeartPulse,
  GraduationCap,
  Plane,
  CircleEllipsis,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  Tag,
  CreditCard,
  Briefcase,
  HelpCircle,
} from 'lucide-react-native';

interface CategoryIconProps {
  iconName: string;
  color?: string;
  bgColor?: string;
  size?: number;
  containerSize?: number;
  style?: ViewStyle;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  iconName,
  color = '#4F46E5',
  bgColor = '#EEF2FF',
  size = 20,
  containerSize = 40,
  style,
}) => {
  const renderIcon = () => {
    const iconProps = { size, color };

    switch (iconName?.toLowerCase()) {
      case 'utensils':
      case 'food':
        return <Utensils {...iconProps} />;
      case 'car':
      case 'transport':
        return <Car {...iconProps} />;
      case 'shoppingbag':
      case 'shopping':
        return <ShoppingBag {...iconProps} />;
      case 'film':
      case 'entertainment':
        return <Film {...iconProps} />;
      case 'receipt':
      case 'filetext':
      case 'bills':
        return <Receipt {...iconProps} />;
      case 'heartpulse':
      case 'healthcare':
      case 'health':
        return <HeartPulse {...iconProps} />;
      case 'graduationcap':
      case 'education':
        return <GraduationCap {...iconProps} />;
      case 'plane':
      case 'travel':
        return <Plane {...iconProps} />;
      case 'income':
      case 'arrowupright':
        return <ArrowUpRight {...iconProps} />;
      case 'expense':
      case 'arrowdownleft':
        return <ArrowDownLeft {...iconProps} />;
      case 'dollar':
      case 'wallet':
        return <DollarSign {...iconProps} />;
      case 'trending':
        return <TrendingUp {...iconProps} />;
      case 'tag':
        return <Tag {...iconProps} />;
      case 'card':
        return <CreditCard {...iconProps} />;
      case 'work':
      case 'briefcase':
        return <Briefcase {...iconProps} />;
      default:
        return <CircleEllipsis {...iconProps} />;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          backgroundColor: bgColor,
        },
        style,
      ]}
    >
      {renderIcon()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
