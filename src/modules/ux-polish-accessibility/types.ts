// UX Polish & Accessibility Type Definitions

// Animation and micro-interaction types
export interface AnimationConfig {
  duration: number;
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | string;
  delay?: number;
  iterations?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface MicroInteraction {
  id: string;
  name: string;
  trigger: InteractionTrigger;
  animation: AnimationConfig;
  target: string;
  conditions?: InteractionCondition[];
  callbacks?: InteractionCallbacks;
}

export interface InteractionTrigger {
  type: 'hover' | 'click' | 'focus' | 'scroll' | 'load' | 'custom';
  selector?: string;
  threshold?: number; // For scroll triggers
  debounce?: number;
}

export interface InteractionCondition {
  property: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'exists';
  value: unknown;
}

export interface InteractionCallbacks {
  onStart?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
  onProgress?: (progress: number) => void;
}

// Mobile replay types
export interface MobileReplayConfig {
  swipeThreshold: number;
  tapTimeout: number;
  longPressTimeout: number;
  enableVoiceNotes: boolean;
  enableGestures: boolean;
  autoRotation: boolean;
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  startTime: Date;
  endTime: Date;
  startPosition: TouchPosition;
  endPosition: TouchPosition;
}

export interface TouchPosition {
  x: number;
  y: number;
  pressure?: number;
  radiusX?: number;
  radiusY?: number;
}

export interface VoiceNote {
  id: string;
  userId: string;
  duration: number;
  transcription?: string;
  audioBlob: Blob;
  timestamp: Date;
  attachedTo?: {
    type: 'trade' | 'chart' | 'strategy' | 'journal';
    id: string;
    position?: { x: number; y: number };
  };
}

export interface MobileReplayState {
  currentIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number;
  selectedTimeframe: string;
  showControls: boolean;
  orientation: 'portrait' | 'landscape';
}

// Localization types
export interface LocaleConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  region: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    precision: number;
  };
  enabled: boolean;
}

export interface TranslationData {
  [key: string]: string | TranslationData;
}

export interface LocalizationContext {
  currentLocale: string;
  availableLocales: LocaleConfig[];
  translations: Record<string, TranslationData>;
  loading: boolean;
  fallbackLocale: string;
}

export interface ThemePack {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  animations: ThemeAnimations;
  components: ThemeComponents;
  preview?: string;
  tags: string[];
  premium: boolean;
}

export interface ThemeColors {
  primary: ColorPalette;
  secondary: ColorPalette;
  accent: ColorPalette;
  neutral: ColorPalette;
  semantic: SemanticColors;
  background: BackgroundColors;
}

export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Base color
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface SemanticColors {
  success: ColorPalette;
  warning: ColorPalette;
  error: ColorPalette;
  info: ColorPalette;
}

export interface BackgroundColors {
  primary: string;
  secondary: string;
  tertiary: string;
  overlay: string;
  glass: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface ThemeAnimations {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  keyframes: Record<string, any>;
}

export interface ThemeComponents {
  button: ComponentTheme;
  input: ComponentTheme;
  card: ComponentTheme;
  modal: ComponentTheme;
  tooltip: ComponentTheme;
  chart: ChartTheme;
}

export interface ComponentTheme {
  base: Record<string, any>;
  variants: Record<string, Record<string, any>>;
  states: Record<string, Record<string, any>>;
}

export interface ChartTheme {
  colors: {
    bullish: string;
    bearish: string;
    volume: string;
    indicators: string[];
    grid: string;
    text: string;
  };
  styles: {
    candlestick: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any;
    line: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any;
    area: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any;
    volume: any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any // eslint-disable-line @typescript-eslint/no-explicit-any;
  };
}

// Accessibility types
export interface AccessibilityConfig {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  colorBlindMode?: 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface AccessibilityAudit {
  timestamp: Date;
  url: string;
  violations: AccessibilityViolation[];
  warnings: AccessibilityWarning[];
  score: number; // 0-100
  standards: ('WCAG_2_0' | 'WCAG_2_1' | 'WCAG_2_2' | 'Section_508')[];
}

export interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  elements: AccessibilityElement[];
}

export interface AccessibilityWarning {
  id: string;
  description: string;
  elements: AccessibilityElement[];
}

export interface AccessibilityElement {
  target: string;
  html: string;
  failureSummary?: string;
}

// Responsive design types
export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  ultrawide: number;
}

export interface ResponsiveConfig {
  breakpoints: ResponsiveBreakpoints;
  baseUnit: number;
  scaleFactor: number;
  fluidTypography: boolean;
  containerQueries: boolean;
}

// Performance types
export interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalBlockingTime: number;
}

export interface UXMetrics {
  userSessions: number;
  averageSessionDuration: number;
  bounceRate: number;
  taskCompletionRate: number;
  errorRate: number;
  userSatisfactionScore: number;
}

// Event types for UX module
export type UXEvent =
  | { type: 'ANIMATION_STARTED'; payload: { animationId: string; element: string } }
  | { type: 'ANIMATION_COMPLETED'; payload: { animationId: string; duration: number } }
  | { type: 'VOICE_NOTE_RECORDED'; payload: { noteId: string; duration: number } }
  | { type: 'LOCALE_CHANGED'; payload: { from: string; to: string } }
  | { type: 'THEME_CHANGED'; payload: { themeId: string; themeName: string } }
  | { type: 'ACCESSIBILITY_SETTING_CHANGED'; payload: { setting: string; value: unknown } }
  | { type: 'GESTURE_DETECTED'; payload: SwipeGesture }
  | { type: 'PERFORMANCE_MEASURED'; payload: PerformanceMetrics }; 