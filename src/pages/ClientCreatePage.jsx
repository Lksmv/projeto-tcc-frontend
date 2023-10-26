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
  MenuItem
} from '@mui/material';
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InputMask from 'react-input-mask';
import { BACKEND_URL } from '../utils/backEndUrl';

export default function ClientCreatePage() {
  const estiloCampo = {
    margin: '8px',
    borderRadius: '10px',
    width: '90%'
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
  };

  const cancelarButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#E91E63', // Cor de erro do Material Design
    color: '#fff',
    width: '117px',
    height: '36px',
    marginLeft: '8px',
  };



  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];
  const [formValues, setFormValues] = useState({
    codigo: "",
    nome: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    redeSocial: "",
    pessoasAutorizadas: "",
    observacoes: "",
    cep: "",
    uf: "",
    endereco: "",
    bairro: "",
  });

  const formatInputDate = (rawDate) => {
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
    if (dateRegex.test(rawDate)) {
      const parts = rawDate.split('-');
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      return formattedDate;
    } else {
      return rawDate;
    }
  };

  const navigate = useNavigate()

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
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

    try {
      const response = await axios.post(BACKEND_URL + 'cliente', requestData);
      const clientId = response.data.idCliente
      navigate(`/cliente/detalhes/${clientId}`);
    } catch (error) {
      console.error('Erro ao salvar o cliente:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Cadastro de cliente</title>
      </Helmet>
      <Container>
        <Container maxWidth="lg" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
            Cadastro de cliente
          </Typography>
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
                  variant="outlined"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.codigo}
                  onChange={handleFieldChange}
                  disabled={true}
                  sx={{
                    backgroundColor: '#e9e9e9'
                  }}
                  InputLabelProps={{
                    style: { color: '#9d9d9d' } 
                }}
                />
                <TextField
                  name="nome"
                  label="Nome"
                  variant="outlined"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.nome}
                  onChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                  required
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
                      variant="outlined"
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
                  mask="99-99-9999"
                  value={formValues.dataNascimento}
                  onChange={handleFieldChange}
                >
                  {() => (
                    <TextField
                      name="dataNascimento"
                      label="Data de Nascimento"
                      variant="outlined"
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
                      variant="outlined"
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
                  variant="outlined"
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
                  variant="outlined"
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
                  variant="outlined"
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
                      variant="outlined"
                      fullWidth
                      style={estiloCampo}
                      sx={{
                        backgroundColor: '#fff'
                      }}
                    />
                  )}
                </InputMask>
                <TextField
                  name="uf"
                  variant="outlined"
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
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="endereco"
                  label="Endereço"
                  style={estiloCampo}
                  variant="outlined"
                  fullWidth
                  sx={{
                    backgroundColor: '#fff'
                  }}
                  value={formValues.endereco}
                  onChange={handleFieldChange}
                />
                <TextField
                  name="bairro"
                  label="Bairro"
                  variant="outlined"
                  style={estiloCampo}
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
              <Button type="submit" variant="contained" style={salvarButtonStyle}>
                SALVAR
              </Button>

              <Button type="reset" variant="contained" style={cancelarButtonStyle}>
                CANCELAR
              </Button>
            </Grid>
          </form>
        </Container>
      </Container >
    </>
  );
}
