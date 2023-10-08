import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Button(theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
        sizeLarge: {
          height: 48,
        },
        containedInherit: {
          color: theme.palette.grey[800],
          '&:hover': {
            backgroundColor: theme.palette.grey[800],
          },
        },
        containedPrimary: {
          boxShadow: theme.customShadows.secondary,
        },
        containedSecondary: {
          boxShadow: theme.customShadows.secondary,
        },
        outlinedInherit: {
          border: `1px solid ${alpha(theme.palette.grey[500], 0.32)}`,
        },
        textInherit: {
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
  };
}
