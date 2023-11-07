// @mui
import { styled } from '@mui/material/styles';
import { ListItemIcon, ListItemButton } from '@mui/material';

// ----------------------------------------------------------------------

export const StyledNavItem = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
  ...theme.typography.body2,
  height: 40,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.primary,
  borderRadius: 8, 
  '&:hover': {
    bgcolor: 'action.hover', 
  },
}));

export const StyledSubNavItem = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
  ...theme.typography.body2,
  height: 40,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.primary,
  borderRadius: 8,
  '&:hover': {
    bgcolor: 'action.hover', 
  },
}));

export const StyledNavItemIcon = styled(ListItemIcon)({
  width: 24, // Tamanho padrão para ícones
  height: 24, // Tamanho padrão para ícones
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
