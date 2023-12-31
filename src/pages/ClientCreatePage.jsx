import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  MenuItem,
  Snackbar
} from '@mui/material';
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InputMask from 'react-input-mask';
import { BACKEND_URL } from '../utils/backEndUrl';
import { formatOutputDate, formatInputDate } from '../utils/formatTime';

export default function ClientCreatePage() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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

  const estados = [
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' }
  ];

  const [formValues, setFormValues] = useState({
    codigo: 0,
    nome: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    redeSocial: "",
    pessoasAutorizadas: "",
    observacoes: "",
    cidade: "",
    cep: "",
    uf: "",
    endereco: "",
    bairro: "",
  });

  const cpfRef = React.createRef();

  const navigate = useNavigate()

  const handleFieldChange = (e) => {
    console.log(e)
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCodigoFieldChange = (event) => {
    const inputValue = event.target.value;

    const numericValue = inputValue.replace(/\D/g, '');

    setFormValues({
      ...formValues,
      codigo: numericValue,
    });
  };

  const handleCancel = () => {
    navigate('/cliente');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const codigoAsInteger = parseInt(formValues.codigo, 10);
    const formatedData = formatInputDate(formValues.dataNascimento);

    const requestData = {
      ...formValues,
      codigo: codigoAsInteger,
      dataNascimento: formatedData,
    };
    let response;
    try {
      response = await axios.post(BACKEND_URL + 'cliente', requestData);
      const codigo = response.data.codigo;
      showSnackbar('Cliente criado com sucesso', 'success');
      setTimeout(() => {
        navigate(`/cliente/detalhes/${codigo}`);
      }, 1000);
    } catch (error) {
      if (error.response) {
        if (error.response.data.message) {
          const errorMessage = error.response.data.message;
          showSnackbar(`${errorMessage}`, 'error');
        } else {
          let errorMessage = error.response.data.errors[0];
          const colonIndex = errorMessage.indexOf(':');
          if (colonIndex !== -1) {
            errorMessage = errorMessage.substring(colonIndex + 1).trim();
          }
          showSnackbar(`${errorMessage}`, 'error');
        }
      } else if (error.request) {
        showSnackbar(`Erro de requisição: ${error.request}`, 'error');
      } else {
        showSnackbar(`Erro ao salvar o Cliente: ${error.message}`, 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Helmet>
        <title>Cadastro de cliente</title>
      </Helmet>
      <Container>
        <Container maxWidth="100%" style={{ alignContent: 'left', marginTop: '30px' }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Link color="inherit" href="/cliente">
              Cliente
            </Link>
            <Typography variant="subtitle1" color="text.primary">Novo Cliente</Typography>
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
                  name="codigo"
                  label="Código"
                  variant="filled"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.codigo}
                  onChange={handleCodigoFieldChange}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                  helperText="Deixe 0 para preencher automaticamente ou insira um valor personalizado."
                />
                <TextField
                  name="nome"
                  label="Nome"
                  variant="filled"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.nome}
                  onChange={handleFieldChange}
                  required
                  sx={{
                    backgroundColor: '#fff'
                  }}
                />
                <InputMask
                  mask="999.999.999-99"
                  value={formValues.cpf}
                  onChange={handleFieldChange}
                >
                  {() => (
                    <TextField
                      name="cpf"
                      label="CPF"
                      variant="filled"
                      fullWidth
                      style={estiloCampo}
                      sx={{
                        backgroundColor: '#fff'
                      }}
                      required
                      inputRef={cpfRef}
                    />
                  )}
                </InputMask>
                <InputMask
                  mask="99-99-9999"
                  value={formValues.dataNascimento}
                  onChange={handleFieldChange}
                >
                  {() => (
                    <TextField
                      name="dataNascimento"
                      label="Data de Nascimento"
                      variant="filled"
                      fullWidth
                      style={estiloCampo}
                      sx={{
                        backgroundColor: '#fff'
                      }}
                      required
                    />
                  )}
                </InputMask>
                <InputMask
                  mask="(99)99999-9999"
                  value={formValues.telefone}
                  onChange={handleFieldChange}
                  maskChar="_"
                >
                  {() => (
                    <TextField
                      name="telefone"
                      label="Telefone"
                      variant="filled"
                      fullWidth
                      style={estiloCampo}
                      sx={{
                        backgroundColor: '#fff'
                      }}
                      required
                    />
                  )}
                </InputMask>
                <TextField
                  name="redeSocial"
                  label="Rede Social"
                  variant="filled"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.redeSocial}
                  onChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                />
                <TextField
                  name="pessoasAutorizadas"
                  label="Pessoas Autorizadas"
                  variant="filled"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.pessoasAutorizadas}
                  onChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                />
                <TextField
                  name="observacoes"
                  label="Observações"
                  variant="filled"
                  multiline
                  rows={4}
                  fullWidth
                  style={estiloCampo}
                  value={formValues.observacoes}
                  onChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} display="flex" flexDirection="column" sx={{ alignItems: 'center' }}>
                <InputMask
                  mask="99999-999"
                  value={formValues.cep}
                  onChange={handleFieldChange}
                >
                  {() => (
                    <TextField
                      name="cep"
                      label="CEP"
                      variant="filled"
                      fullWidth
                      style={estiloCampo}
                      sx={{
                        backgroundColor: '#fff'
                      }}
                      required
                    />
                  )}
                </InputMask>
                <TextField
                  name="cidade"
                  label="Cidade"
                  style={estiloCampo}
                  variant="filled"
                  fullWidth
                  required
                  sx={{
                    backgroundColor: '#fff'
                  }}
                  value={formValues.cidade}
                  onChange={handleFieldChange}
                />
                <TextField
                  name="uf"
                  variant="filled"
                  select
                  label="Estado"
                  fullWidth
                  required
                  style={estiloCampo}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                  value={formValues.uf}
                  onChange={handleFieldChange}
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    }
                  }}
                >
                  {estados.map((estado) => (
                    <MenuItem key={estado.sigla} value={estado.sigla}>
                      {estado.sigla + ' - ' + estado.nome}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="endereco"
                  label="Endereço"
                  style={estiloCampo}
                  variant="filled"
                  fullWidth
                  required
                  sx={{
                    backgroundColor: '#fff'
                  }}
                  value={formValues.endereco}
                  onChange={handleFieldChange}
                />
                <TextField
                  name="bairro"
                  label="Bairro"
                  variant="filled"
                  style={estiloCampo}
                  required
                  fullWidth
                  sx={{
                    backgroundColor: '#fff'
                  }}
                  value={formValues.bairro}
                  onChange={handleFieldChange}
                />
              </Grid>
            </Grid>
            <Grid className="botoes-cadastro-cliente" item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                type="submit"
                variant="contained"
                style={salvarButtonStyle}
              >
                SALVAR
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
