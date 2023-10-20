import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Container, Grid, Divider, Typography } from '@mui/material';
import ProductList from '../sections/@dashboard/products/ProductList';
import ProductFilter from '../sections/@dashboard/products/ProductFilter';
import ReactPaginate from 'react-paginate'; // Importe a biblioteca de paginação
import PRODUCTS from '../__mock/products';
import '../utils/pagination.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function CatalogPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;
  const filterOptions = [
    {
      category: 'Gênero',
      options: ['Masculino', 'Feminino'],
    },
    {
      category: 'Tamanho',
      options: ['Pequeno', 'Médio', 'Grande'],
    },
  ];

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const productsOnPage = PRODUCTS.slice(startIndex, endIndex);

  return (
    <Container sx={{ marginTop: "100px", padding: "20px", marginBottom: "100px"}}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} sx={{ borderRight: '1px solid #fff', marginTop:'100px', marginBottom:'200px', padding:'25px'}}>
          <ProductFilter filterOptions={filterOptions} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography variant="h4" sx={{ mb: 2, color: "#fff" }}>Produtos</Typography>
          <Divider sx={{ backgroundColor: '#C61C4A', mb: 3 }} />
          <ProductList products={productsOnPage}/>

          {/* Adicione a paginação aqui */}
          <ReactPaginate
            pageCount={Math.ceil(PRODUCTS.length / itemsPerPage)}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            pageClassName="page-number"
            activeClassName="active"
            previousLabel={
              <ArrowBackIosIcon sx={{ fontSize: 30 }} /> // Ícone de setinha esquerda
            }
            nextLabel={
              <ArrowForwardIosIcon sx={{ fontSize: 30 }} /> // Ícone de setinha direita
            }
          />
        </Grid>
      </Grid>
    </Container>
  );
}
