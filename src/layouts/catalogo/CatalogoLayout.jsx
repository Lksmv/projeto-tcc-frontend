import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import HeaderCatalogo from './header/HeaderCatalogo';
import Footer from '../../components/footer'

const StyledRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: '#fff',
});

const Main = styled('div')(() => ({
  flexGrow: 1,
  overflow: 'auto'
}));


export default function CatalogoLayout({ catalogo }) {
  return (
    <StyledRoot>
      {catalogo ? <HeaderCatalogo /> : <Header />}
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </StyledRoot>
  );
}
