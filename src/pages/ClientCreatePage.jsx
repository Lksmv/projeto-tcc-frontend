import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  MenuItem,
  Select,
} from '@mui/material';
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InputMask from 'react-input-mask';
import { BACKEND_URL } from '../utils/backEndUrl';

export default function ClientCreatePage() {
  const estiloCampo = {
    margin: '8px',
    borderRadius: '10px',
    maxWidth: '50%'
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
      console.log('Cliente salvo com sucesso:', response.data);
      // Redirecione o usuário para a página de clientes (ou qualquer outra página desejada)
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
        <Container maxWidth="lg" style={{ marginTop: '16px', paddingLeft: '20px', paddingRight: '20px' }}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 2 }}>
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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" flexDirection="column" alignItems='left'>
              <TextField
                name="codigo"
                label="Código"
                variant="outlined"
                fullWidth
                style={estiloCampo}
                value={formValues.codigo}
                onChange={handleFieldChange}
                sx={{
                  backgroundColor: '#aaa'
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
            <Grid item xs={12} sm={6} display="flex" flexDirection="column" sx={{ alignItems: 'left' }}>
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
              <Select
                name="uf"
                label="UF"
                variant="outlined"
                fullWidth
                style={estiloCampo}
                sx={{
                  backgroundColor: '#fff'
                }}
                value={formValues.uf}
                onChange={handleFieldChange}
                MenuProps={{
                  style: {
                    maxHeight: 300,
                  },
                }}
              >
                {estados.map((estado) => (
                  <MenuItem key={estado} value={estado}>
                    {estado}
                  </MenuItem>
                ))}
              </Select>
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
          <div className="botoes-cadastro-cliente" style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                width: '90px',
                height: '36px',
                marginRight: '8px',
                fontFamily: 'Rubik, sans-serif',
                backgroundColor: '#336DC3',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                boxSizing: 'border-box',
              }}
            >
              SALVAR
            </Button>
            <Button
              type="reset"
              variant="contained"
              color="error"
              style={{ width: '117px', height: '36px', marginLeft: '8px', fontFamily: 'Rubik, sans-serif', backgroundColor: '#B21447', color: '#fff', border: 'none', borderRadius: '5px', boxSizing: 'border-box' }}
            >
              CANCELAR
            </Button>
          </div>
        </form>
      </Container >
    </>
  );
}
