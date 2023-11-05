import React, { useState } from 'react';
import {
  Container,
  Grid,
  Divider,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  useMediaQuery,
} from '@mui/material';
import ProductList from '../sections/@dashboard/products/ProductList';
import ProductFilter from '../sections/@dashboard/products/ProductFilter';
import ReactPaginate from 'react-paginate';
import PRODUCTS from '../__mock/products';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {useParams} from 'react-router-dom';

export default function CatalogPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const [filterVisible, setFilterVisible] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const {genero} = useParams(); 

  const filterOptions = [
    {
      category: 'Gênero',
      options: ['Masculino', 'Feminino'],
    },
    {
      category: 'Tamanho',
      options: ['Pequeno', 'Médio', 'Grande'],
    },
    {
      category: 'Cores',
      options: ['Preto', 'Branco', 'Vermelho'],
    },
  ];

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsOnPage = PRODUCTS.slice(startIndex, endIndex);

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  return (
    <>
      <Container sx={{ marginTop: "100px", padding: "20px", marginBottom: "100px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} sx={{ borderRight: '1px solid #fff', marginTop: isMobile ? '0' : '50px', marginBottom: isMobile ? '0' : '200px', padding: '25px' }}>
            {isMobile ? (
              <>
                <Button
                  variant="contained"
                  onClick={toggleFilter}
                  sx={{ color: '#fff' }}
                >
                  {filterVisible ? 'Fechar Filtro' : 'Abrir Filtro'}
                </Button>
                {filterVisible && <ProductFilter filterOptions={filterOptions} />}
              </>
            ) : (
              <ProductFilter filterOptions={filterOptions} genero={genero}/>
            )}
          </Grid>
          <Grid item xs={12} md={9}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
              <Link color="inherit" href="/">
                Home
              </Link>
              <Link color="inherit" href="/catalogo">
                Catálogo
              </Link>
              <Typography variant="subtitle1" color="text.primary">Vestidos</Typography>
            </Breadcrumbs>
            <Divider sx={{ backgroundColor: '#C61C4A', mb: 3 }} />
            <ProductList products={productsOnPage} />

            <ReactPaginate
              pageCount={Math.ceil(PRODUCTS.length / itemsPerPage)}
              pageRangeDisplayed={5}
              marginPagesDisplayed={2}
              onPageChange={handlePageChange}
              containerClassName="pagination"
              pageClassName="page-number"
              activeClassName="active"
              previousLabel={
                <ArrowBackIosIcon sx={{ fontSize: 30 }} />
              }
              nextLabel={
                <ArrowForwardIosIcon sx={{ fontSize: 30 }} />
              }
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
