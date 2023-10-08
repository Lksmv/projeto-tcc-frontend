import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography} from '@mui/material';
import Divider from '@mui/material/Divider';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';

import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppWidgetSummary,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <Container maxWidth="xl">
      <Typography variant="subtitle1" sx={{ mb: 2, color: '#DFE3E8'}}>
        {'>'} Dashboard
      <Divider sx={{backgroundColor: '#fff', mb: 3}} />
      </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Aluguel semanal" total={714000} color="success" icon={<CurrencyExchangeIcon/>} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Aguardando retirada" total={1352831} color="info" icon={<HourglassEmptyIcon/>} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Item Orders" total={1723315} color="warning" icon={<AssignmentIcon/>} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Pedidos atrasados" total={234} color="error" icon={<AssignmentLateIcon/>} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Aluguel Semanal"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Total',
                  type: 'line',
                  fill: 'solid',
                  data: [67, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Categoria mais alugada"
              chartData={[
                { label: 'Terno', value: 4344 },
                { label: 'Vestido', value: 5435 },
                { label: 'Sapato', value: 1443 },
                { label: 'bolsa', value: 4443 },
              ]}
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
