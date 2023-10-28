import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Drawer } from '@mui/material';
import useResponsive from '../../../hooks/useResponsive';

import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import {navConfig, navConfigAdmin} from './config';

// ----------------------------------------------------------------------

const NAV_WIDTH = 185;

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }

    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    setUserData(storedUserData);
  }, [pathname]);

  const isUserAdmin = () => {
    return userData?.cargo === "ROLE_ADMIN";
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column', zIndex: -1 },
        zIndex: -1,
      }}
    >
      <Box sx={{ px: 2.5, py: 5, display: 'inline-flex' }}>
      </Box>

      {(isUserAdmin() ? <NavSection data={navConfigAdmin} /> : <NavSection data={navConfig} />)}

    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              background: `linear-gradient(to bottom, #C61C4A, #8f0642)`
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              background: `linear-gradient(to bottom, #C61C4A, #8F1B4D)`
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
