  import PropTypes from 'prop-types';
  import { styled } from '@mui/material/styles';
  import { Box, Stack, AppBar, Toolbar, IconButton, Grid, Typography } from '@mui/material';
  import Imagem from '../../../assets/logo.png';
  import AccountPopover from './AccountPopover';
  import MenuIcon from '@mui/icons-material/Menu';

  const NAV_WIDTH = -1;

  const StyledRoot = styled(AppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: 'linear-gradient(180deg, #C61C4A 0%, #861C58 98%)',
    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)', // Ajustei a sombra para cima.
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${NAV_WIDTH + 1}px)`,
    },
  }));

  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(0, 5),
    },
  }));

  Header.propTypes = {
    onOpenNav: PropTypes.func,
  };

  export default function Header({ onOpenNav }) {
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={Imagem} alt="Logo" style={{ maxWidth: '80%', height: 'auto' }} />
            </Box>
          </Grid>
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1 }}>
            <AccountPopover />
          </Stack>
        </StyledToolbar>
      </StyledRoot>
    );
  }
