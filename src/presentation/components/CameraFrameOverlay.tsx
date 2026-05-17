import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../../core/theme/colors';

const WINDOW_WIDTH_RATIO = 0.82;
const WINDOW_ASPECT_RATIO = 4 / 3;

export function CameraFrameOverlay() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const windowWidth = screenWidth * WINDOW_WIDTH_RATIO;
  const windowHeight = windowWidth * WINDOW_ASPECT_RATIO;
  const topOffset = (screenHeight - windowHeight) / 2;
  const sideWidth = (screenWidth - windowWidth) / 2;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Top overlay */}
      <View style={[styles.overlay, { height: topOffset }]} />

      <View style={{ flexDirection: 'row' }}>
        {/* Left overlay */}
        <View style={[styles.overlay, { width: sideWidth }]} />

        {/* Clear window with corner brackets */}
        <View style={{ width: windowWidth, height: windowHeight }}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          {/* Scanning hint text */}
          <View style={styles.hintContainer}>
            <View style={styles.hintBadge}>
              <View style={styles.hintDot} />
              <View style={styles.hintDot2} />
            </View>
          </View>
        </View>

        {/* Right overlay */}
        <View style={[styles.overlay, { width: sideWidth }]} />
      </View>

      {/* Bottom overlay */}
      <View style={[styles.overlay, { flex: 1 }]} />
    </View>
  );
}

const CORNER_SIZE = 28;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: colors.primaryContainer,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },
  hintContainer: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hintBadge: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  hintDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryContainer,
  },
  hintDot2: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryContainer,
    opacity: 0.5,
  },
});
