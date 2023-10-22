import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Grid } from '@mui/material';
import { bgGradient } from '../../../utils/cssStyles';
import Imagem from '../../../assets/logo.png'
import AccountPopover from './AccountPopover';
import MenuIcon from '@mui/icons-material/Menu';

// ----------------------------------------------------------------------

const NAV_WIDTH = -1;
const HEADER_MOBILE = 54;
const HEADER_DESKTOP = 75;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'linear-gradient(180deg, #C61C4A 0%, #861C58 98%)',
  boxShadow: '-5px 0px 10px #000;',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav, userData}) {
  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          size="large"
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: '#fff',
          }}
        >
          <MenuIcon />
        </IconButton>
        <Grid container justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
          <Box>
            <img src={Imagem} alt="Logo" width="80%" height="80%" />
          </Box>
        </Grid>
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1 }}>
          <AccountPopover userData={userData} />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
