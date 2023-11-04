import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  Autocomplete,
  Checkbox,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InputMask from 'react-input-mask';
import { BACKEND_URL } from '../utils/backEndUrl';
import { formatOutputDate, formatInputDate } from '../utils/formatTime';
import { NumericFormat } from 'react-number-format';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function RentalCreatePage() {
  const estiloCampo = {
    margin: '8px',
    borderRadius: '5px 5px 0 0',
    width: '90%',
  };

  const estiloCheckbox = {
    marginLeft: '12px',
    borderRadius: 'none',
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

  const [formValues, setFormValues] = useState({
    codigo: 0,
    cliente: "",
    funcionario: "",
    dataSaida: "",
    dataDevolucao: "",
    produtos: [],
    valor: "",
    utilizarCredito: false,
    total: "",
    valorPago: "",
    restanteAPagar: "",
    formaPagamento: "",
    patrocinio: false,
  });

  const [formasPagamento, setformasPagamento] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'forma-de-pagamento', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filtro,
        },
      });
      setformasPagamento(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar a lista de formas de pagamento:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'cliente', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filtro,
        },
      });
      setClientes(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'produto', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filtro,
        },
      });
      setProdutos(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchClientes();
    fetchData();
  }, [page, rowsPerPage, filtro]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: checked,
    }));
  };

  const handleCancel = () => {
    navigate('/aluguel');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const codigoAsInteger = parseInt(formValues.codigo, 10);
    const formatedDataSaida = formatInputDate(formValues.dataSaida);
    const formatedDataDevolucao = formatInputDate(formValues.dataDevolucao);

    const requestData = {
      ...formValues,
      codigo: codigoAsInteger,
      dataSaida: formatedDataSaida,
      dataDevolucao: formatedDataDevolucao,
    };

    try {
      const response = await axios.post(BACKEND_URL + 'aluguel', requestData);
      const aluguelId = response.data.idAluguel
      navigate(`/aluguel/detalhes/${aluguelId}`);
    } catch (error) {
      console.error('Erro ao salvar o aluguel:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Cadastro de aluguel</title>
      </Helmet>
      <Container>
        <Container maxWidth="lg" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
            Cadastro de aluguel
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Link color="inherit" href="/aluguel">
              Aluguel
            </Link>
            <Typography variant="subtitle1" color="text.primary">Novo Aluguel</Typography>
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
              <Grid item className='grid-esquerda' xs={12} sm={6} display="flex" flexDirection="column" alignItems='center'>

                <TextField
                  name="idAluguel"
                  label="Código"
                  variant="filled"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.codigo}
                  onChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                  inputProps={{
                    readOnly: true,
                  }}
                />
                <Autocomplete
                  options={clientes}
                  getOptionLabel={(option) => option.codigo + ' - ' + option.nome}
                  style={estiloCampo}
                  onChange={(event, newValue) => {
                    setClienteSelecionado(newValue.codigo);
                  }}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cliente"
                      variant="filled"
                      required
                      sx={{
                        borderRadius: '5px 5px 0 0',
                        backgroundColor: '#fff',
                      }}
                      onChange={(event) => {
                        setFiltro(event.target.value);
                      }}
                    />
                  )}
                />

                <Autocomplete
                  options={funcionarios}
                  getOptionLabel={(option) => option}
                  value={formValues.funcionario}
                  onChange={(event, newValue) => {
                    setFormValues({ ...formValues, funcionario: newValue });
                  }}
                  fullWidth
                  style={estiloCampo}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Funcionário"
                      variant="filled"
                      required
                      sx={{
                        borderRadius: '5px 5px 0 0',
                        backgroundColor: '#fff'
                      }}
                    />
                  )}
                />
                <Autocomplete
                  multiple  // Habilita a seleção múltipla
                  id="produtos"
                  options={products}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            checked={selected}
                          />
                        }
                        label={option.name}
                      />
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      label="Produtos"
                      fullWidth
                    />
                  )}
                  value={formValues.produtos}
                  onChange={(event, newValue) => {
                    setFormValues({ ...formValues, produtos: newValue });
                  }}
                  style={estiloCampo}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                />

                <Grid className='grid-datas' item xs={12} sm={12} style={{ display: 'flex', width: '93%', alignItems: 'center' }}>
                  <Grid container>
                    <Grid item xs={6}>
                      <InputMask
                        mask="99-99-9999"
                        value={formValues.dataSaida}
                        onChange={handleFieldChange}
                      >
                        {() => (
                          <TextField
                            name="dataSaida"
                            label="Data Saída"
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
                        value={formValues.dataDevolucao}
                        onChange={handleFieldChange}
                      >
                        {() => (
                          <TextField
                            name="dataDevolucao"
                            label="Data Devolução"
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

                <Grid container className='grid-utilizarCredito' alignItems="center">
                  <Grid style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox
                      name="patrocinio"
                      checked={formValues.patrocinio}
                      onChange={handleCheckboxChange}
                      style={estiloCheckbox}
                    />
                    <span>Aluguel patrocinado</span>
                  </Grid>
                </Grid>

              </Grid>

              <Grid item className='grid-direita' xs={12} sm={6} display="flex" flexDirection="column" sx={{ alignItems: 'center' }}>

                <TextField
                  name="formaPagamento"
                  variant="filled"
                  required
                  select
                  label="Forma de Pagamento"
                  fullWidth
                  style={estiloCampo}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                  value={formValues.formaPagamento}
                  onChange={(e) => {
                    const selectedFormaPagamento = e.target.value;
                    setFormValues({ ...formValues, formaPagamento: selectedFormaPagamento });
                  }}
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {formasPagamento.map((formaPagamento) => (
                    <MenuItem key={formaPagamento.codigo} value={formaPagamento.codigo}>
                      {formaPagamento.nome}
                    </MenuItem>
                  ))}
                </TextField>

                <NumericFormat
                  name="valor"
                  variant='filled'
                  customInput={TextField}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  label="Valor"
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  fullWidth
                  style={estiloCampo}
                  value={formValues.valor}
                  onValueChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                  disabled={formValues.patrocinio}
                />
                <Grid container className='grid-utilizarCredito' alignItems="center" style={{ display: 'flex', width: '93%' }}>
                  <Grid item xs={12} sm={6}>
                    <NumericFormat
                      name="creditoValor"
                      variant='filled'
                      customInput={TextField}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      label="Valor de Crédito"
                      allowNegative={false}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      fullWidth
                      style={estiloCampo}
                      value={formValues.creditoValor}
                      onValueChange={handleFieldChange}
                      sx={{
                        backgroundColor: '#fff'
                      }}
                      disabled={!formValues.utilizarCredito}
                    />
                  </Grid>
                  <Grid style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox
                      name="utilizarCredito"
                      checked={formValues.utilizarCredito}
                      onChange={handleCheckboxChange}
                      style={estiloCheckbox}
                    />
                    <span>Utilizar Crédito</span>
                  </Grid>
                </Grid>

                <NumericFormat
                  name="valorPago"
                  variant='filled'
                  customInput={TextField}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  label="Valor Pago"
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  fullWidth
                  style={estiloCampo}
                  value={formValues.valorPago}
                  onValueChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                  disabled={formValues.patrocinio}
                />

                <NumericFormat
                  name="total"
                  variant='filled'
                  customInput={TextField}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  label="Total"
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  fullWidth
                  style={estiloCampo}
                  value={formValues.total}
                  onValueChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                  disabled={formValues.patrocinio}
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
    </>
  );
}
