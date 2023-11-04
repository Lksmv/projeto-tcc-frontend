import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  TableContainer,
  Paper,
  TableHead,
  Button,
  Grid
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';

export default function ReportInfoClientPage() {

  const buttonStyle = {
    fontFamily: 'Roboto, sans-serif',
    borderRadius: '4px',
    boxSizing: 'border-box',
    textTransform: 'none',
  };

  const imprimirButtonStyle = {
    ...buttonStyle,
    marginTop: '-25px',
    backgroundColor: '#808080',
    color: '#fff',
    width: '90px',
    height: '36px',
    marginRight: '8px',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#1565C0',
    },
    '&:active': {
      backgroundColor: '#0D47A1',
    },
  };

  const [clientList, setClientList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [rows, setRows] = useState([
    { codigo: 1, nome: 'Produto A', telefone: 10, codAluguel: '1', aluguelFinalizado: true, dataDevolucao: '', dataDevolvido: '' },
    { codigo: 2, nome: 'Produto B', telefone: 20, codAluguel: '1', aluguelFinalizado: true, dataDevolucao: '', dataDevolvido: '' },
    { codigo: 3, nome: 'Produto C', telefone: 30, codAluguel: '1', aluguelFinalizado: true, dataDevolucao: '', dataDevolvido: '' },
    { codigo: 4, nome: 'Produto D', telefone: 30, codAluguel: '1', aluguelFinalizado: true, dataDevolucao: '', dataDevolvido: '' },
    { codigo: 5, nome: 'Produto E', telefone: 30, codAluguel: '1', aluguelFinalizado: true, dataDevolucao: '', dataDevolvido: '' },
    { codigo: 6, nome: 'Produto F', telefone: 30, codAluguel: '1', aluguelFinalizado: true, dataDevolucao: '', dataDevolvido: '' },
  ]);

  const fetchClientList = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'cliente', {
        params: {
          size: rows,
        },
      });
      setClientList(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar a lista de clientes:', error);
    }
  };

  useEffect(() => {
  }, [rows]);

  const handlePrint = () => {
    // Handle the print action here, for example, by opening the print dialog.
    window.print();
  };


  return (
    <>
      <Helmet>
        <title>Relatório Cliente</title>
      </Helmet>
      <Container maxWidth="xl" sx={{ marginBottom: "30px" }}>
        <Container maxWidth="100%" style={{ alignContent: 'left' }}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
            Relatório Cliente
          </Typography>
          <Grid container >
            <Grid item xs={6}>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link color="inherit" href="/dashboard">
                  Dashboard
                </Link>
                <Typography variant="subtitle1" color="text.primary">Relatório Cliente</Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Button variant="filled" onClick={handlePrint} style={imprimirButtonStyle}>Imprimir</Button>
            </Grid>
          </Grid>
        </Container>

        <div style={{ width: '100%' }}>
          <TableContainer component={Paper} style={{ maxHeight: '550px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Código</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Nome</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Telefone</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Cód. Aluguel</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Aluguel Finalizado</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Data Devolução</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Data Devolvido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.codigo}>
                    <TableCell>{row.codigo}</TableCell>
                    <TableCell>{row.nome}</TableCell>
                    <TableCell>{row.telefone}</TableCell>
                    <TableCell>{row.codAluguel}</TableCell>
                    <TableCell>{row.aluguelFinalizado ? "Sim" : "Não"}</TableCell>
                    <TableCell>{row.dataDevolucao}</TableCell>
                    <TableCell>{row.dataDevolvido}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Container>
    </>
  );
}
