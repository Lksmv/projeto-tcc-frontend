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
  MenuItem,
  Button,
  Autocomplete
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';
import InputMask from 'react-input-mask';

export default function ReportPage() {

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
    tipo: "",
    cliente: "",
    dataInicial: "",
    dataFinal: "",
    codigoCategoria: "",
  });

  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate()

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleReport = () => {
    navigate('/dashboard');
  };
 
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(BACKEND_URL + 'categoria', {
          params: {
            page: 0,
            size: 100,
            filtro: "",
          },
        });
        setCategorias(response.data.content);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategorias();
  }, []);

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
        <title>Relatório</title>
      </Helmet>
      <Container>
        <Container maxWidth="lg" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
            Relatório
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Typography variant="subtitle1" color="text.primary">Relatório</Typography>            
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
          marginBottom: '20px'
        }}>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} display="flex" flexDirection="column" alignItems='center'>

                <TextField
                  name="tipo"
                  variant="filled"
                  select
                  label="Tipo"
                  fullWidth
                  required
                  style={estiloCampo}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                  value={formValues.tipo}
                  onChange={handleFieldChange}
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    }
                  }}
                >
                  {tipos.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </TextField>

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

                <Grid className='grid-datas' item xs={12} sm={12} style={{ display: 'flex', width: '93%', alignItems: 'center' }}>
                  <Grid container>
                    <Grid item xs={6}>
                      <InputMask
                        mask="99-99-9999"
                        value={formValues.dataInicial}
                        onChange={handleFieldChange}
                      >
                        {() => (
                          <TextField
                            name="dataInicial"
                            label="Data Inicial"
                            variant="filled"
                            fullWidth
                            style={estiloCampo}
                            sx={{
                              backgroundColor: '#fff',
                            }}
                          />
                        )}
                      </InputMask>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                      <InputMask
                        mask="99-99-9999"
                        value={formValues.dataFinal}
                        onChange={handleFieldChange}
                      >
                        {() => (
                          <TextField
                            name="dataFinal"
                            label="Data Final"
                            variant="filled"
                            fullWidth
                            style={estiloCampo}
                            sx={{
                              backgroundColor: '#fff'
                            }}
                          />
                        )}
                      </InputMask>
                    </Grid>
                  </Grid>
                </Grid>

                <TextField
                  name="codigoCategoria"
                  variant="filled"
                  required
                  select
                  label="Categoria"
                  fullWidth
                  style={estiloCampo}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                  value={formValues.codigoCategoria}
                  onChange={(e) => {
                    const selectedCategoria = e.target.value;
                    setFormValues({ ...formValues, codigoCategoria: selectedCategoria });
                  }}
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.codigo} value={categoria.codigo}>
                      {categoria.nome}
                    </MenuItem>
                  ))}
                </TextField>

              </Grid>
              <Grid item xs={12} sm={6} display="flex" flexDirection="column" sx={{ alignItems: 'center' }}>

              </Grid>
            </Grid>
            <Grid className="botoes-cadastro-cliente" item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'end' }}>
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