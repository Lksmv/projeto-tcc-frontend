import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 62;
const APP_BAR_DESKTOP = 90;

const StyledRoot = styled('div')({
  display: 'auto',
  minHeight: '100%',
  overflow: 'hidden'
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  const handleOpenNav = () => {
    setOpen(!open);
  };

  return (
    <StyledRoot>
      <Main>
        <Header onOpenNav={handleOpenNav} />
        <Nav openNav={open} onCloseNav={() => setOpen(false)} />
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
