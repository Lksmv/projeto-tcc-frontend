import { styled } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Grid } from '@mui/material';
import Imagem from '../../../assets/logo.png';
import React, { useEffect, useState } from 'react';

const HEADER_MOBILE = 54;
const HEADER_DESKTOP = 75;

const StyledRoot = styled(AppBar)(({ theme, isScrolled }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: "0px 0px 0px 0px",
  background: `linear-gradient(180deg, rgba(198, 28, 74, ${isScrolled}) 0%, rgba(134, 28, 88, ${isScrolled}) 98%)`,
  transition: 'background 0.3s',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollY / pageHeight);

      setIsScrolled(scrollPercentage);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <StyledRoot isScrolled={isScrolled} style={{  opacity: 0.6,}}>
      <StyledToolbar>
        <Grid container justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
          <Box>
            <img src={Imagem} alt="Logo" width="80%" height="80%" />
          </Box>
        </Grid>
      </StyledToolbar>
    </StyledRoot>
  );
}
