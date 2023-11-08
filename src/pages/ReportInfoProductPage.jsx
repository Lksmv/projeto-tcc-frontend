import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  Grid
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';
import ReportDownloadButton from '../components/downloadReport/donwloadReport';

export default function ReportInfoProductPage() {
  const [aluguelList, setAluguelList] = useState([]);
  const [produto, setProduto] = useState({});
  const { codigo } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Código do produto:', codigo);
    axios
      .get(BACKEND_URL + `aluguel/por-produto/${codigo}`)
      .then((response) => {
        setAluguelList(response.data)
      })
    axios
      .get(BACKEND_URL + `produto/${codigo}`)
      .then((response) => {
        setProduto(response.data)
      })
  }, [codigo]);

  return (
    <>
      <Helmet>
        <title>Relatório Produto</title>
      </Helmet>
      <Container maxWidth="xl" sx={{ marginBottom: "30px", marginTop: '30px' }}>
        <Container maxWidth="100%" style={{ alignContent: 'left' }}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
            Relatório do Produto com Código: {codigo}
          </Typography>
          <Grid container >
            <Grid item xs={6}>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link color="inherit" href="/dashboard">
                  Dashboard
                </Link>
                <Link color="inherit" href="/produto/relatorio">
                  Relatório de aluguel por produto
                </Link>
                <Typography variant="subtitle1" color="text.primary">{produto.nome}</Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <ReportDownloadButton nomeArquivo={"relatorioProdutoCod" + codigo + ".docx"} url={BACKEND_URL + `aluguel/relatorio-por-produto/${codigo}/download`} />
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
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>valor</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Aluguel Status</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Data Devolução</TableCell>
                  <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Data Retirada</TableCell>
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
                    <TableCell>{row.valor}</TableCell>
                    <TableCell>{row.statusAluguel}</TableCell>
                    <TableCell>{formatOutputDate(row.dataDevolucao)}</TableCell>
                    <TableCell>{formatOutputDate(row.dataSaida)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Container >
    </>
  );
}
