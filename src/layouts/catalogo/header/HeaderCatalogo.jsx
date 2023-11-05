import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Grid, Menu, MenuItem, Link } from '@mui/material';
import Imagem from '../../../assets/logo.png';

const HEADER_MOBILE = 44;
const HEADER_DESKTOP = 65;
const HEADER_MENU_MOBILE = 24;
const HEADER_MENU_DESKTOP = 35;

const SUBMENU_DELAY = 200;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: '0px 0px 0px 0px',
  background: 'linear-gradient(180deg, #C61C4A 0%, #861C58 98%)',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('md')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

const StyledMenu = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MENU_MOBILE,
  [theme.breakpoints.up('md')]: {
    minHeight: HEADER_MENU_DESKTOP,
    padding: theme.spacing(0, 5),
    display: 'flex',
    justifyContent: 'center',
  },
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const StyledOutletText = styled('div')(({ theme }) => ({
  color: '#fff',
  cursor: 'pointer',
  fontFamily: 'Roboto, sans-serif',
  fontSize: '15px',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const StyledSubmenu = styled(Menu)(({ theme }) => ({
  marginTop: '5px',
}));

export default function Header() {
  const [outletAnchorEl, setOutletAnchorEl] = useState(null);

  const handleOutletClick = (event) => {
    setOutletAnchorEl(event.currentTarget);
  };

  const handleOutletClose = () => {
    setTimeout(() => {
      setOutletAnchorEl(null);
    }, SUBMENU_DELAY);
  };

  return (
    <>
      <StyledRoot>
        <StyledToolbar>
          <Grid container justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
            <Link color="inherit" href="/">
              <Box>
                <img src={Imagem} alt="Logo" width="80%" height="80%" />
              </Box>
            </Link>
          </Grid>
        </StyledToolbar>
        <StyledMenu style={{ maxHeight: '10px' }}>
          <StyledOutletText
            aria-controls="outlet-menu"
            aria-haspopup="true"
            onMouseEnter={handleOutletClick}
          >
            OUTLET
          </StyledOutletText>
          <StyledSubmenu
            id="outlet-menu"
            anchorEl={outletAnchorEl}
            open={Boolean(outletAnchorEl)}
            onClose={handleOutletClose}
          >
            <MenuItem>Vestido</MenuItem>
            <MenuItem>Terno</MenuItem>
            <MenuItem>Sapato</MenuItem>
          </StyledSubmenu>
        </StyledMenu>
      </StyledRoot>
    </>
  );
}
