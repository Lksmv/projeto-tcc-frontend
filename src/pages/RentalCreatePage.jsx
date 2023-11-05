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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InputMask from 'react-input-mask';
import { BACKEND_URL } from '../utils/backEndUrl';
import { formatOutputDate, formatInputDate } from '../utils/formatTime';
import { NumericFormat } from 'react-number-format';

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
    codigoCliente: 0,
    codigoFuncionario: 0,
    dataSaida: "",
    dataDevolucao: "",
    listaProdutos: [],
    valor: 0,
    valorCredito: 0,
    utilizarCredito: false,
    valorAdicional: 0,
    total: 0,
    valorPago: 0,
    formaPagamento: 0,
    patrocinio: false,
  });

  const [formasPagamento, setformasPagamento] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [filtroFuncionario, setFiltroFuncionario] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroProduto, setFiltroProduto] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [desabilitar, setDesabilitar] = useState(!!false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'forma-de-pagamento', {
        params: {
          page: page,
          size: 50,
          filtro: "",
        },
      });
      setformasPagamento(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar a lista de formas de pagamento:', error);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'cliente', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filtroCliente,
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
          filtro: filtroProduto,
        },
      });
      setProdutos(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'funcionario', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filtroFuncionario,
        },
      });
      setFuncionarios(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [page, rowsPerPage, filtroCliente]);

  useEffect(() => {
    fetchProduct();
  }, [page, rowsPerPage, filtroProduto]);

  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage, filtroFuncionario]);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target || e.currentTarget;
    if (name) {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleCheckboxPatrocinioChange = (e) => {
    const { name, checked } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: checked,
    }));
    setDesabilitar(checked);

  };

  const calculateAllValues = () => {
    if (!formValues.patrocinio) {
      if (formValues.utilizarCredito) {
        let totalAluguel = formValues.valorCredito >= formValues.valor - formValues.valorPago ? 0 : formValues.valor - formValues.valorCredito - formValues.valorPago;
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          total: totalAluguel,
        }));
      } else {
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          total: formValues.valor - formValues.valorPago
        }));
      }
    } else {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
      }));
    }
  }

  useEffect(() => {
    calculateAllValues();
  }, [formValues.utilizarCredito]);

  useEffect(() => {
    calculateAllValues();
  }, [formValues.patrocinio]);

  useEffect(() => {
    calculateAllValues();
  }, [formValues.valor]);

  useEffect(() => {
    calculateAllValues();
  }, [formValues.valorPago]);

  useEffect(() => {
    calculateAllValues();
  }, [formValues.valorCredito]);




  const handleCheckboxCreditoChange = (e) => {
    const { name, checked } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: checked
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
      utilizarCredito: formValues.utilizarCredito ? 'S' : 'N',
      patrocinio: formValues.patrocinio ? 'S' : 'N',
      codigo: codigoAsInteger,
      dataSaida: formatedDataSaida,
      dataDevolucao: formatedDataDevolucao,
    };

    try {
      const response = await axios.post(BACKEND_URL + 'aluguel', requestData);
      const codigo = response.data.codigo
      console.log(formValues)
      showSnackbar('Aluguel criado com sucesso', 'success');
      navigate(`/aluguel/detalhes/${codigo}`);
    } catch (error) {
      if (error.response) {
        setSnackbarMessage(error.response.data.errors[0]);
        console.log(error)
      } else if (error.request) {
        setSnackbarMessage('Erro de requisição: ' + error.request);
      } else {
        setSnackbarMessage('Erro ao salvar o Aluguel: ' + error.message);
      }
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleClienteChange = (event, newValue) => {
    if (newValue) {
      const array = Object.values(newValue.listaCreditos);
      const credito = array.reduce((total, credito) => total + credito.valor, 0);
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        codigoCliente: newValue.codigo,
        valorCredito: credito
      }));
    } else {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        codigoCliente: 0
      }));
    }
  };

  const handleFuncionarioChange = (event, newValue) => {
    if (newValue) {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        codigoFuncionario: newValue.codigo
      }));
    } else {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        codigoFuncionario: 0
      }));
    }
  };

  const handleProdutoChange = (event, newValue) => {
    if (newValue) {
      const produtosArray = Object.values(newValue);
      const listaProdutosIds = produtosArray.map(produto => produto.codigo);
      const somaValores = produtosArray.reduce((total, produto) => total + produto.valor, 0);
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        listaProdutos: listaProdutosIds,
        valor: somaValores
      }));

    } else {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        valor: 0,
        listaProdutos: []
      }));
    }
  };

  const handleFormaPagamentoChange = (event, newValue) => {
    if (newValue) {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        formaPagamento: newValue.idFormaDePagamento
      }));
    } else {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        formaPagamento: 0
      }));
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
                  onChange={handleClienteChange}
                  isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                  fullWidth
                  required
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
                        setFiltroCliente(event.target.value);
                      }}
                    />
                  )}
                />

                <Autocomplete
                  options={funcionarios}
                  getOptionLabel={(option) => option.codigo + ' - ' + option.nome}
                  style={estiloCampo}
                  onChange={handleFuncionarioChange}
                  isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                  fullWidth
                  required
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Funcionario"
                      variant="filled"
                      required
                      sx={{
                        borderRadius: '5px 5px 0 0',
                        backgroundColor: '#fff',
                      }}
                      onChange={(event) => {
                        setFiltroFuncionario(event.target.value);
                      }}
                    />
                  )}
                />
                <Autocomplete
                  multiple
                  required
                  options={produtos}
                  getOptionLabel={(option) => option.codigo + ' - ' + option.nome}
                  style={estiloCampo}
                  onChange={handleProdutoChange}
                  isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Produto"
                      variant="filled"
                      sx={{
                        borderRadius: '5px 5px 0 0',
                        backgroundColor: '#fff',
                      }}
                      onChange={(event) => {
                        setFiltroProduto(event.target.value);
                      }}
                    />
                  )}
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
                              backgroundColor: '#fff'
                            }}
                            required
                          />
                        )}
                      </InputMask>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                      <InputMask
                        mask="99-99-9999"
                        value={formValues.dataDevolucao}
                        onChange={handleFieldChange}
                        required
                      >
                        {() => (
                          <TextField
                            name="dataDevolucao"
                            label="Data Devolução"
                            variant="filled"
                            fullWidth
                            style={estiloCampo}
                            required
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
                      checked={!!formValues.patrocinio}
                      onChange={handleCheckboxPatrocinioChange}
                      style={estiloCheckbox}
                    />
                    <span>Aluguel patrocinado</span>
                  </Grid>
                </Grid>

              </Grid>

              <Grid item className='grid-direita' xs={12} sm={6} display="flex" flexDirection="column" sx={{ alignItems: 'center' }}>
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
                  onValueChange={(values) => {
                    handleFieldChange({ target: { name: 'valor', value: values.floatValue } });
                  }}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                  disabled={desabilitar}
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
                      value={formValues.valorCredito}
                      sx={{
                        backgroundColor: '#fff'
                      }}
                      inputProps={{
                        readOnly: true,
                      }}
                      disabled={desabilitar}
                    />
                  </Grid>
                  <Grid style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox
                      name="utilizarCredito"
                      checked={!!formValues.utilizarCredito}
                      onChange={handleCheckboxCreditoChange}
                      style={estiloCheckbox}
                    />
                    <span>Utilizar Crédito</span>
                  </Grid>
                </Grid>

                <Autocomplete
                  options={formasPagamento}
                  getOptionLabel={(option) => option.idFormaDePagamento + ' - ' + option.nome}
                  style={estiloCampo}
                  onChange={handleFormaPagamentoChange}
                  isOptionEqualToValue={(option, value) => option.idFormaDePagamento === value.idFormaDePagamento}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Forma de pagamento"
                      variant="filled"
                      sx={{
                        borderRadius: '5px 5px 0 0',
                        backgroundColor: '#fff',
                      }}
                    />
                  )}
                />

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
                  onValueChange={(values) => {
                    handleFieldChange({ target: { name: 'valorPago', value: values.floatValue } });
                  }}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                  disabled={desabilitar}
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
                  sx={{
                    backgroundColor: '#fff'
                  }}
                  inputProps={{
                    readOnly: true,
                  }}
                  disabled={desabilitar}
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
