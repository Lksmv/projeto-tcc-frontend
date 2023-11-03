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

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  //pegar lista de clientes cadastrados
  const clientes = [
    '123 - Maria', '11 - joao'
  ];

  const funcionarios = [
    '1 - Maria', '11 - joao'
  ];

  const products = [
    { name: '001 - Vestido' },
    { name: '002 - Terno' },
    { name: '003 - Sapato' },
  ];

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
    dataContrato: "",
  });

  const [formasPagamento, setformasPagamento] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

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
                  options={clientes} // A lista de clientes
                  getOptionLabel={(option) => option} // Função para obter o rótulo de cada cliente
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
                    products={products}
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
                        disabled={formValues.patrocinio}
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
                        disabled={formValues.patrocinio}
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
