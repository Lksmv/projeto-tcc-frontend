import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Footer from '../../components/footer'

const StyledRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  overflow: 'hidden',
  backgroundColor: '#0E0207',
});

const Main = styled('div')(() => ({
  flexGrow: 1,
  overflow: 'auto'
}));


export default function CatalogoLayout() {
  return (

    <StyledRoot>
      <Header/>
      <Main>
        <Outlet />
      </Main>
      <Footer/>
    </StyledRoot>
  );
}
