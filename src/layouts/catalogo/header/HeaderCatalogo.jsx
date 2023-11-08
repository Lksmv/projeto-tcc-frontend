import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Grid, Link, InputBase, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import { BACKEND_URL } from '../../../utils/backEndUrl';
import SearchIcon from '@mui/icons-material/Search';
import logoTexto from '../../../assets/logo.png';
import logoImg from '../../../assets/logoimg.png';

const HEADER_MOBILE = 44;
const HEADER_DESKTOP = 65;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: '0px 0px 0px 0px',
  background: 'linear-gradient(180deg, #C61C4A 0%, #861C58 98%)',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('md')]: {
    minHeight: HEADER_DESKTOP,
    margin: '0 auto',
    width: '65%',
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: '10px',
  },
  padding: theme.spacing(0, 2),
}));

const SearchBar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: '24px',
  backgroundColor: 'white',
  paddingLeft: '20px',
  width: '100%',
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  borderRadius: '24px',
  textIndent: '15px',
  flex: 1,
}));

const CategoriesContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CategoryLink = styled(Link)(({ theme }) => ({
  color: '#fff',
  textDecoration: 'none',
  marginRight: '16px',
  paddingBottom: '10px',
  position: 'relative',
  '&:hover::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: '-1px',
    width: '100%',
    borderBottom: '1px solid #C61C4A'
  }
}));

const CategoryTypography = styled(Typography)(({ theme }) => ({
  textTransform: 'uppercase',
  fontWeight: 'bold',
  fontSize: '14px',
  mb: 1,
}));

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(BACKEND_URL + 'categoria', {
          params: {
            page: 0,
            size: 8,
            filtro: "",
          },
        });
        setCategories(response.data.content);
      } catch (error) {
        console.error('Erro ao buscar a lista de categorias:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <>
      <StyledRoot>
        <StyledToolbar>
          <Grid container style={{ paddingTop: '16px' }}>
            <Grid item xs={3} style={{ paddingBottom: '10px' }}>
              <Link color="inherit" href="/">
                <Box sx={{ display: 'flex', alignItems: 'left' }}>
                  <img src={logoImg} alt="Logo" height='45px' />
                  <img src={logoTexto} alt="LogoTxt" height="45px" style={{ paddingLeft: '10px' }} />
                </Box>
              </Link>
            </Grid>
            <Grid item xs={9} style={{ paddingBottom: '10px' }}>
              <SearchBar>
                <SearchInput
                  placeholder="Pesquisar"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </SearchBar>
            </Grid>
            <Grid item xs={12}>
              <CategoriesContainer>
                {categories.map((category, index) => (
                  <React.Fragment key={index}>
                    <CategoryLink href={`/catalogo/${category.codigo}`}>
                      <CategoryTypography variant="subtitle">
                        {category.nome}
                      </CategoryTypography>
                    </CategoryLink>
                    {index < categories.length - 1}
                  </React.Fragment>
                ))}
              </CategoriesContainer>
            </Grid>
          </Grid>
        </StyledToolbar>
      </StyledRoot>
    </>
  );
}
