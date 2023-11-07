import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mammoth from 'mammoth';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { formatOutputDate, formatInputDate } from '../utils/formatTime';
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
import ReportDownloadButton from '../components/downloadReport/donwloadReport';

export default function ReportInfoClientPage() {
  const [aluguelList, setAluguelList] = useState([]);
  const { codigo } = useParams();
  const navigate = useNavigate();


  const buttonStyle = {
    fontFamily: 'Roboto, sans-serif',
    borderRadius: '4px',
    boxSizing: 'border-box',
    textTransform: 'none',
  };
  
  useEffect(() => {
    console.log('Código do cliente:', codigo);
    axios
      .get(BACKEND_URL + `aluguel/por-cliente/${codigo}`)
      .then((response) => {
        setAluguelList(response.data)
      })
  }, [codigo]);



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
              <ReportDownloadButton url={BACKEND_URL + `aluguel/relatorio/${codigo}/download`} />
            </Grid>
          </Grid>
        </Container>

        <div style={{ width: '100%' }}>
          <TableContainer component={Paper} style={{ maxHeight: '550px', overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Código Aluguel</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Nome Cliente</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Telefone</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>valor</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Aluguel Status</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Data Devolução</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Data Retirada</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Data Contrato</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {aluguelList && aluguelList.map((row) => (
                  <TableRow
                    key={row.codigo}
                    style={{ cursor: 'pointer', background: row.statusAluguel === 'FECHADO' ? '#c6f68d' : row.status === 'CANCELADO' ? '#ffc8b9' : '#fddeb1' }}
                    onClick={() => {
                      navigate(`/aluguel/detalhes/${codigo}`);
                    }}
                  >
                    <TableCell>{row.codigo}</TableCell>
                    <TableCell>{row.clienteDTO.nome}</TableCell>
                    <TableCell>{row.clienteDTO.telefone}</TableCell>
                    <TableCell>{row.valor}</TableCell>
                    <TableCell>{row.statusAluguel}</TableCell>
                    <TableCell>{formatOutputDate(row.dataDevolucao)}</TableCell>
                    <TableCell>{formatOutputDate(row.dataSaida)}</TableCell>
                    <TableCell>{formatOutputDate(row.dataEmissao)}</TableCell>
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
