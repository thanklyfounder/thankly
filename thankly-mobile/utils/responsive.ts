import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

export const isSmallScreen = width < 380 || height < 700;
export const isAndroidNarrow = width < 390;

export function rs(size: number) {
  const baseWidth = 390;
  const scale = width / baseWidth;
  const newSize = size * scale;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}