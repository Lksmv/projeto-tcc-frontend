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
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const navigate = useNavigate();

  const estiloCampo = {
    margin: '8px',
    borderRadius: '5px',
    width: '100%',
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

  const fetchClientes = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'cliente', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filterName,
        },
      });
      setClientes(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [page, rowsPerPage, filterName]);

  const handleClienteChange = (event, newValue) => {
    setCliente(newValue);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/cliente/relatorio/${cliente.codigo}`);
  };

  return (
    <>
      <Helmet>
        <title>Relatório de Clientes</title>
      </Helmet>
      <Container>
        <Container maxWidth="xl" sx={{
          marginTop: '30px',
          width: '700px',
        }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Typography variant="subtitle1" color="textPrimary">
              Relatório de alugueis
            </Typography>
          </Breadcrumbs>
        </Container>

        <Container style={{
          backgroundColor: '#f0f0f0',
          borderRadius: '16px',
          padding: '24px',
          margin: '20px auto',
          maxWidth: '700px',
        }}>
          <form onSubmit={handleSubmit}>
            <Grid container justifyContent='center' spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={clientes}
                  getOptionLabel={(option) => option.codigo + ' - ' + option.nome}
                  style={estiloCampo}
                  value={cliente}
                  onChange={handleClienteChange}
                  isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cliente"
                      variant="filled"
                      required
                      sx={{
                        borderRadius: '5px',
                        backgroundColor: '#fff',
                      }}
                      onChange={(event) => {
                        setFilterName(event.target.value);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container justifyContent='center'>
                  <Button
                    type="submit"
                    variant="contained"
                    style={salvarButtonStyle}
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
              </Grid>
            </Grid>
          </form>
        </Container>
      </Container >
    </>
  );
}
