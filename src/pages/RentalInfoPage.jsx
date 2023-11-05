import { Helmet } from 'react-helmet-async';
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
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
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InputMask from 'react-input-mask';
import { BACKEND_URL } from '../utils/backEndUrl';
import { formatOutputDate, formatInputDate } from '../utils/formatTime';
import { NumericFormat } from 'react-number-format';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import FormControlLabel from '@mui/material/FormControlLabel';
import ProductTable from '../components/table/ProductTable';

export default function RentalInfoPage() {
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
    cliente: 0,
    funcionario: 0,
    dataSaida: "",
    dataDevolucao: "",
    dataEmissao: "",
    listaProdutos: [],
    listaPagamentos: [],
    valor: 0,
    valorCredito: 0,
    valorAdicional: 0,
    total: 0,
    valorPago: 0,
    formaPagamento: 0,
    utilizarCredito: false,
    patrocinio: false,
    statusAluguel: ""
  });


  const [cliente, setCliente] = useState([]);
  const [funcionario, setFuncionario] = useState([]);
  const [formasPagamento, setformasPagamento] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [desabilitar, setDesabilitar] = useState(!!false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedProducts, setSelectedProducts] = useState([]);



  const fetchData = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'forma-de-pagamento', {
        params: {
          page: 0,
          size: 50,
          filtro: "",
        },
      });
      setformasPagamento(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar a lista de formas de pagamento:', error);
    }
  };


  const fetchEmployees = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'funcionario', {
        params: {
          page: 0,
          size: 100,
          filtro: "",
        },
      });
      setFuncionarios(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
    }
  };

  const navigate = useNavigate()

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

  const { codigo } = useParams();

  useEffect(() => {
    const codigoRental = codigo;
    axios
      .get(BACKEND_URL + `aluguel/${codigoRental}`)
      .then((response) => {
        const rentalDetails = response.data;
        setCliente(rentalDetails.clienteDTO)
        setFuncionario(rentalDetails.funcionarioDTO)
        setFormValues({
          ...rentalDetails,
          cliente: cliente.codigo,
          funcionario: funcionario.codigo,
          patrocinio: rentalDetails.patrocinio == 'S' ? true : false,
          utilizarCredito: rentalDetails.utilizarCredito == 'S' ? true : false,
        });
        console.log(formValues)
      })
      .catch((error) => {
        setError(error);
      });
    fetchData();
    fetchEmployees()
  }, [codigo]);


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
                <TextField
                  fullWidth
                  value={formValues.cliente}
                  style={estiloCampo}
                  label="Cliente"
                  variant="filled"
                  required
                  sx={{
                    borderRadius: '5px 5px 0 0',
                    backgroundColor: '#fff'
                  }}
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

                <Grid item xs={12} sm={12} style={{ display: 'flex', width: '90%', alignItems: 'center', margin: '8px' }}>
                  <ProductTable
                    products={formValues.listaProdutos}
                    selectedProducts={selectedProducts}
                    onProductSelect={(selectedProducts) => setSelectedProducts(selectedProducts)}
                  />
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

              <Grid item className='grid-direita' xs={12} sm={6} flexDirection="column" sx={{ alignItems: 'center' }}>

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

                <InputMask
                  mask="99-99-9999"
                  value={formValues.dataContrato}
                  onChange={handleFieldChange}
                >
                  {() => (
                    <TextField
                      name="dataContrato"
                      label="Data Contrato"
                      variant="filled"
                      fullWidth
                      style={estiloCampo}
                      sx={{
                        backgroundColor: '#fff',
                      }}
                    />
                  )}
                </InputMask>

                <Grid className='grid-valor' item xs={12} sm={12} style={{ display: 'flex', width: '93%', alignItems: 'center' }}>
                  <Grid container>
                    <Grid item xs={6}>
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
                      />
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
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
                      />
                    </Grid>
                  </Grid>
                </Grid>

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
