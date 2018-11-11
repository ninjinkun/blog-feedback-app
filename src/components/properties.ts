export const colorsValue = {
  white: '#fff',
  black: 'rgb(20, 23, 26)',
  gray: '#8c8c8c',
  grayDark: '#1a1a1a',
  grayLight: '#ddd',
  grayPale: '#f6f6f6',
  green: '#51c300',
  red: '#f0163a',
};

export const colorsBlanding = {
  base: colorsValue.white,
  link: colorsValue.black,
  linkVisited: 'none',
  linkHover: 'none',
  linkActive: 'none',
  success: 'none',
  danger: 'none',
  warning: colorsValue.red,
  info: colorsValue.green,
  primary: colorsValue.green,
  secondary: 'none',
  accent: 'rgba(0, 71, 132, 1)',
  selected: colorsValue.grayPale,
  hover: 'rgb(245, 248, 250)',
};

export const colorsMedia = {
  text: colorsValue.black,
  text_outlined: colorsValue.white,
  tip: colorsValue.grayDark,
  line: colorsValue.grayLight,
  infoLayer1: colorsValue.grayPale,
  infoLayer2: colorsValue.white,
  card: colorsValue.white,
};

export const colors = Object.assign(colorsValue, colorsBlanding, colorsMedia);

export const fontSizes = {
  xxs: 'none',
  xs: '.6rem',
  s: '.8rem',
  m: '1rem',
  l: '1.2rem',
  xl: '1.4rem',
  xxl: '1.6rem',
  xxxl: '1.8rem',
  xxxxl: '2.0rem'
};

export const fontWeights = {
  default: 400,
  bold: 700
};

export const space = '0.5rem';

export const headerHeight = '64px';
export const lineWidth = '1px';
export const lineStyle = 'solid';
export const border = `${lineWidth} ${lineStyle} ${colorsMedia.line}`;

export const hoverFeedbackOpacity = 0.7;
export const hoverAnimationDuration = '.1s';
export const hoverAnimationTiming = 'ease-out';
export const hoverAnimation = `${hoverAnimationDuration} ${hoverAnimationTiming}`;

export const fadeAnimationDuration = '.2s';
export const fadeAnimationTiming = 'liner';
export const fadeAnimation = `${fadeAnimationDuration} ${fadeAnimationTiming}`;

export const zHeader = 10;

export const breakPointS = 'min-width: 768px';

export const fontFamily = '-apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", "Lucida Grande", Arial, sans-serif';

export const faviconSize = '16px';
export const baseMargin = '8px';