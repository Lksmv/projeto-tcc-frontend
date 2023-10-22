import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState } from 'react';
import Divider from '@mui/material/Divider';
import {
  Card,
  Table,
  Stack,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';


export default function RentalCreatePage() {

  return (
    <>
      <Helmet>
        <title> Aluguel</title>
      </Helmet>

      <Container maxWidth="xl">
      <Typography variant="subtitle1" sx={{ mb: 2}}>
        {'>'} Aluguel
        <Divider sx={{backgroundColor: '#606060', mb: 3}} />
      </Typography>

      

      
      </Container>

    </>
  );
}
