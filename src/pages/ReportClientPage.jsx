import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Grid,
  TextField,
  Button,
  Autocomplete
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';

export default function ReportClientPage() {

  const estiloCampo = {
    margin: '8px',
    borderRadius: '5px 5px 0 0',
    width: '90%',
  };

  const buttonStyle = {
    fontFamily: 'Roboto, sans-serif',
    borderRadius: '4px',
    boxSizing: 'border-box',
    textTransform: 'none',
  };

  const salvarButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#1976D2',
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

  const cancelarButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#E91E63',
    color: '#fff',
    width: '117px',
    height: '36px',
    marginLeft: '8px',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#D81B60',
    },
  };

  const tipos = [
    'Devolução', 'Retirada'
  ];

  const clientes = [
    '123 - Maria', '11 - joao'
  ];

  const [formValues, setFormValues] = useState({
    cliente: "",    
  });

  const navigate = useNavigate()

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleReport = () => {
    navigate('/filtro/clientes/relatorio');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatedDataInicial = formatInputDate(formValues.dataInicial);
    const formatedDataFinal = formatInputDate(formValues.dataFinal);

    const requestData = {
      ...formValues,
      dataInicial: formatedDataInicial,
      dataFinal: formatedDataFinal,
    };
    let response;
    try {
      response = await axios.post(BACKEND_URL + 'relatorio', requestData);
    } catch (error) {
      if (error.response) {
        setSnackbarMessage(error.response.data.errors[0]);
      } else if (error.request) {
        setSnackbarMessage('Erro de requisição: ' + error.request);
      } else {
        setSnackbarMessage('Erro ao gerar relatório: ' + error.message);
      }
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Relatório de Clientes</title>
      </Helmet>
      <Container>
        <Container maxWidth="lg" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
            Relatório de Clientes
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Typography variant="subtitle1" color="text.primary">Relatório de Clientes</Typography>
          </Breadcrumbs>
        </Container>

        <Container style={{
          backgroundColor: '#c4c4c4',
          transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          width: '700px',
        }}>

          <form onSubmit={handleSubmit}>
            <Grid display="flex" flexDirection="column" alignItems='center' style={{ paddingRight: '70px', paddingLeft: '70px'}}>               

               <Autocomplete
                 options={clientes}
                 getOptionLabel={(option) => option}
                 value={formValues.cliente}
                 onChange={(event, newValue) => {
                   setFormValues({ ...formValues, cliente: newValue });
                 }}
                 fullWidth
                 style={estiloCampo}
                 renderInput={(params) => (
                   <TextField
                     {...params}
                     label="Cliente"
                     variant="filled"
                     required
                     sx={{
                       borderRadius: '5px 5px 0 0',
                       backgroundColor: '#fff'
                     }}
                   />
                 )}
               />
              
            </Grid>
            <Grid className="botoes-relatorio-cliente" item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
              <Button
                type="submit"
                variant="contained"
                style={salvarButtonStyle}
                onClick={handleReport}
              >
                AVANÇAR
              </Button>

              <Button
                type="reset"
                variant="contained"
                style={cancelarButtonStyle}
                onClick={handleCancel}
              >
                CANCELAR
              </Button>
            </Grid>
          </form>
        </Container>
      </Container >
    </>
  );
}