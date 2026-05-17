import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../core/theme/colors';

interface Props {
  title: string;
  onPress: () => void;
  isLoading: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function LoadingButton({
  title,
  onPress,
  isLoading,
  disabled,
  variant = 'primary',
  style,
  textStyle,
}: Props) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';

  const bgColor = isPrimary ? colors.primaryContainer : 'transparent';
  const borderColor = isSecondary ? colors.secondaryContainer : isPrimary ? 'transparent' : colors.outline;
  const spinnerColor = isPrimary ? colors.onPrimary : isSecondary ? colors.onSecondaryContainer : colors.primary;
  const txtColor = isPrimary ? colors.onPrimary : isSecondary ? colors.onSecondaryContainer : colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: variant === 'primary' ? 0 : 2,
        },
        (isLoading || disabled) && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: txtColor }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontFamily: 'WorkSans_600SemiBold',
    fontWeight: '600',
  },
});
