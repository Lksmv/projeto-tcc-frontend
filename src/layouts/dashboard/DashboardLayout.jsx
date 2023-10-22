import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'auto',
  minHeight: '100%',
  overflow: 'hidden'
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleOpenNav = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const userData = {
      token: storedUserData.token,
      usuario: storedUserData.usuario,
      cargo: storedUserData.cargo,
    };

    setUserData(userData);
  }, []);


  return (
    <StyledRoot>
      <Header onOpenNav={handleOpenNav} userData={userData} />
      <Nav openNav={open} onCloseNav={() => setOpen(false)} />
      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
