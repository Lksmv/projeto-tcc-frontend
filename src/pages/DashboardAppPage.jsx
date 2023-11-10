import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Container, Typography, Grid } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import { BACKEND_URL } from '../utils/backEndUrl';

import { AppQntAlugueisPast, AppQntAlugueisFut, AppWidget } from '../sections/@dashboard/app';

export default function DashboardAppPage() {
  const theme = useTheme();
  const [aluguelSemanal, setAluguelSemanal] = useState(0);
  const [aguardandoRetirada, setAguardandoRetirada] = useState(0);
  const [produtosAlugados, setProdutosAlugados] = useState(0);
  const [pedidosAtrasados, setPedidosAtrasados] = useState(0);
  const [labels, setLabels] = useState([]);
  const [dados, setDados] = useState([]);
  const [cData, setCData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aluguelResponse, atrasadosResponse, produtosAlugadosResponse, aguardandoRetiradaResponse, relatorioUltimosResponse, relatorioProximoResponse] = await Promise.all([
          axios.get(BACKEND_URL + 'aluguel/ultimos-sete-dias'),
          axios.get(BACKEND_URL + 'aluguel/quantidade-atrasados'),
          axios.get(BACKEND_URL + 'produto/quantidade-alugados'),
          axios.get(BACKEND_URL + 'produto/quantidade-aguardando-retirada'),
          axios.get(BACKEND_URL + 'aluguel/ultimos-sete-dias-por-dia'),
          axios.get(BACKEND_URL + 'aluguel/proximos-sete-dias-por-dia'),
        ]);

        setAluguelSemanal(aluguelResponse.data);
        setPedidosAtrasados(atrasadosResponse.data);
        setProdutosAlugados(produtosAlugadosResponse.data);
        setAguardandoRetirada(aguardandoRetiradaResponse.data);

        const relatorioUData = relatorioUltimosResponse.data;
        const relatorioPData = relatorioProximoResponse.data;
        const newLabels = [];
        const newDados = [];
        const newCData = [];

        relatorioUData.forEach((data) => {
          newCData.push({ label: data.diaDaSemana, value: data.quantidade })
        });
        setCData(newCData);
        relatorioPData.forEach((data) => {
          newLabels.push(data.dia)
          newDados.push(data.quantidade)
        });


        setLabels(newLabels);
        setDados(newDados);
      } catch (error) {
        console.error('Erro ao buscar Dados:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>
      <Container maxWidth="xl">
        <Container maxWidth="100%" style={{ alignContent: 'left' }}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 5 }}>
            Dashboard
          </Typography>
        </Container>

        <Grid container spacing={3} sx={{
          border: '1px solid #ccc',
          paddingRight: '20px',
          paddingBottom: '20px',
          borderRadius: '5px',
          backgroundColor: '#aaa',
        }}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidget title="Aluguel semanal" total={aluguelSemanal} color="success" icon={<CurrencyExchangeIcon />} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidget title="Aguardando retirada" total={aguardandoRetirada} color="info" icon={<HourglassEmptyIcon />} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidget title="Produtos alugados" total={produtosAlugados} color="warning" icon={<AssignmentIcon />} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidget title="Pedidos atrasados" total={pedidosAtrasados} color="error" icon={<AssignmentLateIcon />} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppQntAlugueisFut
              title="Aluguéis dos próximos Sete Dias."
              chartLabels={labels}
              chartData={[
                {
                  name: 'Total',
                  type: 'line',
                  fill: 'solid',
                  data: dados,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppQntAlugueisPast
              title="Quantidade de aluguéis dos ultimos Sete dias."
              chartData={cData}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
