import { alpha } from '@mui/material/styles';

const GREY = {
  0: '#FFFFFF',
  100: '#fafafa',
  200: '#f5f5f5',
  300: '#f0f0f0',
  400: '#dedede',
  500: '#c2c2c2',
  600: '#979797',
  700: '#818181',
  800: '#606060',
  900: '#3c3c3c',
};

const PRIMARY = {
  lighter: '#eb284e',
  light: '#db224c',
  main: '#C61C4A',
  dark: '##b21447',
  darker: '#8f0642',
  contrastText: GREY[700],
};

const SECONDARY = {
  lighter: '#00ac6e',
  light: '#009d63',
  main: '#008b55',
  dark: '#007a48',
  darker: '#005a31',
  contrastText: '#dff5ed',
};

const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A',
  contrastText: '#fff',
};

const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: GREY[800],
};

const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
  contrastText: '#fff',
};

const palette = {
  common: { black: '#000', white: '#fff' },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.24),
  text: {
    primary: GREY[800],
    secondary: GREY[700],
    disabled: GREY[500],
  },
  background: {
    paper: '#fff',
    default: GREY[400],
    neutral: GREY[300]
  },
  action: {
    active: GREY[600],
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export default palette;
