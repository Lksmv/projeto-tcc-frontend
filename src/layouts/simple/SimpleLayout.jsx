import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { bgGradient } from '../../utils/cssStyles';
import Logo from '../../assets/logo.png';

// ----------------------------------------------------------------------

const StyledHeader = styled('header')(({ theme }) => ({
  ...bgGradient({
    startColor: '#FE6B8B',
    endColor: '#FF8E53',
  }),
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute'
}));

// ----------------------------------------------------------------------

export default function SimpleLayout() {
  return (
    <>
      <StyledHeader>
        <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', paddingTop: '30px' }}>
          <img src={Logo} alt="Logo" style={{ maxWidth: '180px', maxHeight: '90px' }} />
        </div>
      </StyledHeader>
      <Outlet />
    </>
  );
}