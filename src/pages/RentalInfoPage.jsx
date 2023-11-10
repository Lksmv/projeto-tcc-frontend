import { Helmet } from 'react-helmet-async';
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ReportDownloadButton from '../components/downloadReport/donwloadReport';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InputMask from 'react-input-mask';
import { BACKEND_URL } from '../utils/backEndUrl';
import { formatOutputDate, formatInputDate } from '../utils/formatTime';
import { NumericFormat } from 'react-number-format';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


export default function RentalInfoPage() {

  const [cliente, setCliente] = useState([]);
  const [novoValorAdicional, setValorAdicional] = useState(0);
  const [funcionario, setFuncionario] = useState([]);
  const [formasPagamento, setformasPagamento] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isAddValueDialogOpen, setAddValueDialogOpen] = useState(false);
  const [isAddNewPaymentDialogOpen, setAddNewPaymentOpen] = useState(false);
  const [novosPagamentos] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [valorPagamento, setValorPagamento] = useState(0);
  const [idFormaPagamento, setIdFormaPagamento] = useState(0);
  const { codigo } = useParams();


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
    statusAluguel: "",
    observacoes: ""
  });


  const handleValorAdicionalFieldChange = (e) => {
    setValorAdicional(e);
  };

  const handlePagamentoFieldChange = (e) => {
    setValorPagamento(e);
  };

  const addValor = async () => {
    setFormValues((formValues) => ({
      ...formValues,
      valorAdicional: novoValorAdicional + formValues.valorAdicional
    }));
  }

  const handleStatusChange = (event) => {
    if (selectedRow !== null) {
      const updatedProducts = [...formValues.listaProdutos];
      if (updatedProducts[selectedRow]) {
        updatedProducts[selectedRow].status = event.target.value;
        setFormValues({ ...formValues, listaProdutos: updatedProducts });
      }
    }
  };


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


  const navigate = useNavigate()

  const handleFieldChange = (e) => {
    const { name, value } = e.target || e.currentTarget;
    if (name) {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleFormaPagamentoChange = (event, newValue) => {
    if (newValue) {
      setIdFormaPagamento(newValue.idFormaDePagamento);
    } else {
      setIdFormaPagamento(0);
    }
  };

  const handleCancel = () => {
    navigate('/aluguel');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const codigoAsInteger = parseInt(formValues.codigo, 10);
    const formatedDataSaida = formatInputDate(formValues.dataSaida);
    const formatedDataDevolucao = formatInputDate(formValues.dataDevolucao);
    const formatedDataEmissao = formatInputDate(formValues.dataEmissao);

    const requestData = {
      ...formValues,
      codigo: codigoAsInteger,
      dataSaida: formatedDataSaida,
      dataDevolucao: formatedDataDevolucao,
      dataEmissao: formatedDataEmissao
    };

    if (novosPagamentos.length > 0) {
      try {
        const responseArray = await Promise.all(novosPagamentos.map(async (pagamento) => {
          return axios.post(BACKEND_URL + 'pagamento', pagamento);
        }));

        responseArray.forEach((response, index) => {
          console.log(`Pagamento ${index + 1} atualizado com sucesso:`, response.data);
        });
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
          showSnackbar(`Erro ao salvar os Pagamentos: ${error.message}`, 'error');
        }
      }
    };
    try {
      const responseArray = await Promise.all(formValues.listaProdutos.map(async (produtos) => {
        const aluguelProduto = { codigoProduto: produtos.produtoDTO.codigo, codigoAluguel: formValues.codigo, status: produtos.status }
        return axios.put(BACKEND_URL + 'aluguel/update-status', aluguelProduto);
      }));

      responseArray.forEach((response, index) => {
        console.log(`Produto aluguel status ${index + 1} atualizado com sucesso:`, response.data);
      });

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
        showSnackbar(`Erro ao alterar o status do Produto(s): ${error.message}`, 'error');
      }
    }
    try {
      const response = await axios.put(BACKEND_URL + `aluguel/${codigoAsInteger}`, requestData);
      console.log('Aluguel atualizado com sucesso:', response.data);
      showSnackbar(`Aluguel Salvo com Sucesso`, 'success');
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
        showSnackbar(`Erro ao salvar o Aluguel: ${error.message}`, 'error');
      }
    }
  }

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenAddValorAdicionalDialog = () => {
    setAddValueDialogOpen(true);
  };

  const handleCloseAddValueDialog = () => {
    setAddValueDialogOpen(false);
  };

  const handleOpenAddPagamentoDialog = () => {
    setValorPagamento(0);
    setIdFormaPagamento(0);
    setAddNewPaymentOpen(true);
  };

  const handleCloseAddPagamentoDialog = () => {
    setAddNewPaymentOpen(false);
  };

  const addNewPayment = () => {
    if (valorPagamento > (formValues.total)) {
      showSnackbar(`Valor do pagamento não pode ser maior que o valor a pagar!`, 'error');
      handleCloseAddPagamentoDialog();
    } else if (idFormaPagamento > 0 && valorPagamento > 0) {
      setFormValues((formValues) => ({
        ...formValues,
        listaPagamentos: [
          ...formValues.listaPagamentos,
          {
            codigoAluguel: formValues.codigo,
            idFormaPagamento: idFormaPagamento,
            valor: valorPagamento,
          },
        ],
      }));
      novosPagamentos.push(
        {
          codigoAluguel: formValues.codigo,
          idFormaPagamento: idFormaPagamento,
          valor: valorPagamento,
        }
      )
      handleCloseAddPagamentoDialog();
    } else {
    }
  };

  const handleConcluir = async (event) => {
    event.preventDefault();
    const updatedProducts = formValues.listaProdutos.map((produto) => ({
      ...produto,
      status: produto.status == 'ALUGADO' ? 'DEVOLVIDO' : 'CANCELADO',
      statusAluguel: 'FECHADO'
    }));

    setFormValues({
      ...formValues,
      listaProdutos: updatedProducts,
    });
    await handleSubmit(event);
  };

  const handleCancelar = async (event) => {
    event.preventDefault();
    const updatedProducts = formValues.listaProdutos.map((produto) => ({
      ...produto,
      status: 'CANCELADO',
      statusAluguel: 'CANCELADO'
    }));

    setFormValues({
      ...formValues,
      listaProdutos: updatedProducts,
    });

    await handleSubmit(event);
  }


  const calculateAllValues = () => {
    const array = Object.values(formValues.listaPagamentos);
    const pagamentos = array.reduce((total, pagamento) => total + pagamento.valor, 0);
    setFormValues((formValues) => ({
      ...formValues,
      valorPago: pagamentos,
      valor: formValues.valorOriginal + formValues.valorAdicional,
      total: formValues.valorOriginal + formValues.valorAdicional - pagamentos,
    }));

  }

  useEffect(() => {
    calculateAllValues();
  }, [formValues.listaPagamentos, formValues.valorAdicional]);

  useEffect(() => {
    const codigoRental = codigo;
    axios
      .get(BACKEND_URL + `aluguel/${codigoRental}`)
      .then((response) => {
        const rentalDetails = response.data;
        setCliente(rentalDetails.clienteDTO)
        setFuncionario(rentalDetails.funcionarioDTO)

        const array = Object.values(rentalDetails.listaPagamentos);
        const pagamentos = array.reduce((total, pagamento) => total + pagamento.valor, 0);
        setFormValues({
          ...rentalDetails,
          cliente: cliente.codigo,
          funcionario: funcionario.codigo,
          patrocinio: rentalDetails.patrocinio == 'S' ? true : false,
          utilizarCredito: rentalDetails.utilizarCredito == 'S' ? true : false,
          dataDevolucao: formatOutputDate(rentalDetails.dataDevolucao),
          dataEmissao: formatOutputDate(rentalDetails.dataEmissao),
          dataSaida: formatOutputDate(rentalDetails.dataSaida),
          valorOriginal: rentalDetails.valor
        });
      })
      .catch((error) => {
        setError(error);
      });
    fetchData();
  }, [codigo]);

  return (
    <>
      <Helmet>
        <title>Cadastro de aluguel</title>
      </Helmet>
      <Container>
        <Container maxWidth="100%" style={{ alignContent: 'left', marginTop: '30px' }}>
          <Grid container >
            <Grid item xs={6}>
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link color="inherit" href="/dashboard">
                  Dashboard
                </Link>
                <Link color="inherit" href="/aluguel">
                  Aluguel
                </Link>
                <Typography variant="subtitle1" color="text.primary">{cliente.nome}</Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <ReportDownloadButton nomeArquivo={"relatorioClienteCod" + codigo + ".docx"} txt={'Baixar Contrato'} url={BACKEND_URL + `aluguel/contrato/${codigo}`} />
            </Grid>
          </Grid>
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

          <form onSubmit={(e) => handleSubmit(e)}>

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
                <TextField
                  fullWidth
                  value={cliente.codigo + " - " + cliente.nome}
                  style={estiloCampo}
                  label="Cliente"
                  variant="filled"
                  required
                  sx={{
                    borderRadius: '5px 5px 0 0',
                    backgroundColor: '#fff'
                  }}
                  inputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  fullWidth
                  value={funcionario.codigo + " - " + funcionario.nome}
                  style={estiloCampo}
                  label="Funcionário"
                  variant="filled"
                  required
                  sx={{
                    borderRadius: '5px 5px 0 0',
                    backgroundColor: '#fff'
                  }}
                  inputProps={{
                    readOnly: true,
                  }}
                />

                <Grid item xs={12} sm={12} style={{ display: 'flex', width: '90%', alignItems: 'center', margin: '8px' }}>
                  <div style={{ width: '100%' }}>
                    <TableContainer component={Paper} style={{ maxHeight: '220px', overflowY: 'auto' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Codigo</TableCell>
                            <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Nome</TableCell>
                            <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Valor</TableCell>
                            <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formValues.listaProdutos.map((row, index) => (
                            <TableRow
                              key={row.produtoDTO.codigo}
                              hover
                              style={{ background: row.status === 'ALUGADO' ? '#c6f68d' : row.status === 'CANCELADO' ? '#ffc8b9' : '#fddeb1' }}
                              onClick={() => setSelectedRow(index)}
                            >
                              <TableCell>{row.produtoDTO.codigo}</TableCell>
                              <TableCell>{row.produtoDTO.nome}</TableCell>
                              <TableCell>{'R$ ' + row.produtoDTO.valor}</TableCell>
                              <TableCell>
                                <Select
                                  value={row.status}
                                  onChange={handleStatusChange}
                                >
                                  <MenuItem value="ALUGADO">ALUGADO</MenuItem>
                                  <MenuItem value="CANCELADO">CANCELADO</MenuItem>
                                  <MenuItem value="DEVOLVIDO">DEVOLVIDO</MenuItem>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Grid>
                <TextField
                  name="observacoes"
                  label="Observações"
                  variant="filled"
                  multiline
                  rows={2}
                  fullWidth
                  style={estiloCampo}
                  value={formValues.observacoes || ''}
                  onChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                />

              </Grid>

              <Grid item className='grid-direita' xs={12} sm={6} flexDirection="column" sx={{ alignItems: 'center' }}>

                <Grid className='grid-datas' item xs={12} sm={12} style={{ display: 'flex', width: '93%', alignItems: 'center' }}>
                  <Grid item xs={4}>
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
                  <Grid item xs={4} style={{ textAlign: 'right' }}>
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
                  <Grid item xs={4} style={{ textAlign: 'right' }}>
                    <InputMask
                      mask="99-99-9999"
                      value={formValues.dataEmissao}
                      onChange={handleFieldChange}
                    >
                      {() => (
                        <TextField
                          name="dataEmissao"
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
                  </Grid>
                </Grid>

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
                        sx={{
                          backgroundColor: '#effbee'
                        }}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <AddIcon onClick={handleOpenAddValorAdicionalDialog} />
                              </IconButton>
                            </InputAdornment>
                          ),
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
                        onValueChange={(values) => {
                          handleFieldChange({ target: { name: 'valorPago', value: values.floatValue } });
                        }}
                        sx={{
                          backgroundColor: formValues.valorPago < formValues.valor ? '#f6f6c1' : '#effbee'
                        }}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <AddIcon onClick={handleOpenAddPagamentoDialog} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
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
                  decimalScale={2}
                  fixedDecimalScale={true}
                  fullWidth
                  style={estiloCampo}
                  value={formValues.total}
                  sx={{
                    backgroundColor: formValues.total > 0 ? '#f6f6c1' : '#effbee'
                  }}
                  inputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

            </Grid>

            <Grid className="botoes-cadastro-cliente" item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'end', marginTop: '16px' }}>
              <Button
                type="submit"
                variant="contained"
                style={salvarButtonStyle}
                submit
              >
                SALVAR
              </Button>

              <Button
                variant="contained"
                style={{
                  ...buttonStyle,
                  backgroundColor: '#4CAF50', // Cor verde (ou a cor desejada para o botão "Concluir")
                  color: '#fff',
                  width: '90px',
                  height: '36px',
                  marginRight: '8px',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: '#45a049', // Cor hover
                  },
                  '&:active': {
                    backgroundColor: '#367738', // Cor quando pressionado
                  },
                }}
                onClick={handleConcluir}
              >
                CONCLUIR
              </Button>

              <Button
                type="reset"
                variant="contained"
                style={{
                  ...buttonStyle,
                  backgroundColor: '#E91E63', // Cor vermelha (ou a cor desejada para o botão "Cancelar")
                  color: '#fff',
                  width: '185px',
                  height: '36px',
                  marginRight: '8px',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: '#D81B60', // Cor hover
                  },
                }}
                onClick={handleCancelar}
              >
                CANCELAR ALUGUEL
              </Button>

              <Button
                type="reset"
                variant="contained"
                style={{
                  ...buttonStyle,
                  backgroundColor: '#FFA500', // Laranja
                  color: '#fff',
                  width: '90px',
                  height: '36px',
                  marginRight: '8px',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: '#FF8C00', // Laranja mais escuro no hover
                  },
                  '&:active': {
                    backgroundColor: '#FF6347', // Tom de vermelho mais forte quando pressionado
                  },
                }}
                onClick={handleCancel}  // Ou a função que você deseja chamar ao voltar
              >
                VOLTAR
              </Button>


            </Grid>
          </form>
        </Container>
      </Container >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Dialog open={isAddValueDialogOpen} onClose={handleCloseAddValueDialog}>
        <DialogTitle>Adicionar Valor Adicional</DialogTitle>
        <DialogContent>
          <NumericFormat
            name="valorAdicional"
            variant='filled'
            customInput={TextField}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            label="Valor adicional"
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale={true}
            fullWidth
            style={estiloCampo}
            onValueChange={(values) => {
              handleValorAdicionalFieldChange(values.floatValue);
            }}
            sx={{
              backgroundColor: '#fff'
            }}
          />
          <Button
            onClick={() => {
              addValor();
              handleCloseAddValueDialog();
            }}
            style={{
              marginTop: '10px',
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
            }}
          >
            Adicionar
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={isAddNewPaymentDialogOpen} onClose={handleCloseAddPagamentoDialog}>
        <DialogTitle>Novo Pagamento</DialogTitle>
        <DialogContent>
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
            name="valor"
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
            value={valorPagamento}
            sx={{
              backgroundColor: '#effbee'
            }}
            onValueChange={(values) => {
              handlePagamentoFieldChange(values.floatValue);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddPagamentoDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={addNewPayment} color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
