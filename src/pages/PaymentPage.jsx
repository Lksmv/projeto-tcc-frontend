import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Breadcrumbs,
  Link,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';
import { ListHead, ListToolBar } from '../sections/@dashboard/list';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const TABLE_HEAD = [
  { id: 'idFormaDePagamento', label: 'Código', alignRight: false },
  { id: 'nome', label: 'Nome', alignRight: false },
  { id: 'taxa', label: 'Taxa (%)', alignRight: false },
];

export default function PaymentPage() {
  const estiloCampo = {
    margin: '8px',
    borderRadius: '5px 5px 0 0',
    maxWidth: '50%'
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtro, setFiltro] = useState('');
  const [paymentList, setPaymentList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isAddPaymentDialogOpen, setAddPaymentDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [paymentValues, setPaymentValues] = useState({
    idFormaDePagamento: "",
    nome: "",
    taxa: ""
  });


  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      await axios.delete(`${BACKEND_URL}forma-de-pagamento/${paymentId}`);
      showSnackbar(`Forma de pagamento excluída com sucesso`, 'success');
      handleCloseAddPaymentDialog();
      fetchPaymentList();
    } catch (error) {
      console.error('Erro ao excluir a forma de pagamento:', error);
      showSnackbar(`Erro ao excluir a forma de pagamento: ${error.message}`, 'error');
    }
  };


  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleEditPayment = (payment) => {
    setPaymentValues({ ...payment });
    handleOpenEditPaymentDialog();
  };

  const handleCreateOrUpdatePayment = async () => {
    const requestData = {
      ...paymentValues
    };

    try {
      if (paymentValues.idFormaDePagamento) {
        const response = await axios.put(
          `${BACKEND_URL}forma-de-pagamento/${paymentValues.idFormaDePagamento}`,
          requestData
        );
        showSnackbar(`Forma de pagamento atualizada com Sucesso`, 'success');
      } else {
        const response = await axios.post(
          BACKEND_URL + 'forma-de-pagamento',
          requestData
        );
        showSnackbar(`Forma de pagamento Salva com Sucesso`, 'success');
      }
      handleCloseAddPaymentDialog();
      fetchPaymentList();
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
  };



  const handleOpenEditPaymentDialog = () => {
    setAddPaymentDialogOpen(true);
  };

  const handleOpenAddPaymentDialog = () => {
    setAddPaymentDialogOpen(true);
    setPaymentValues({
      ...paymentValues
    });
  };

  const handleCloseAddPaymentDialog = () => {
    setAddPaymentDialogOpen(false);
    setPaymentValues({
      idFormaDePagamento: "",
      nome: "",
      taxa: ""
    });
  };

  const fetchPaymentList = async () => {

    try {
      const response = await axios.get(BACKEND_URL + 'forma-de-pagamento', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filtro,
        },
      });
      setPaymentList(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar a lista de formas de pagamento:', error);
    }
  };

  useEffect(() => {
    fetchPaymentList();
  }, [page, rowsPerPage, filtro]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFiltro(event.target.value);
    setPage(0);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setPaymentValues({ ...paymentValues, [name]: value });
  };


  return (
    <>
      <Helmet>
        <title>Forma de Pagamento</title>
      </Helmet>
      <Container maxWidth="xl" sx={{ marginBottom: "30px" }}>
        <Container maxWidth="100%" style={{ alignContent: 'left', marginTop: '30px' }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Typography variant="subtitle1" color="text.primary">Forma de Pagamento</Typography>
          </Breadcrumbs>
        </Container>

        <Card>
          <ListToolBar
            filtro={filtro}
            onfiltro={handleFilterByName}
            placeHolder={'Procurar por Código ou Nome'}
            buttonText={'Adicionar'}
            popup={handleOpenAddPaymentDialog}
          />

          <TableContainer>
            <Table>
              <ListHead headLabel={TABLE_HEAD} rowCount={totalItems} />
              <TableBody>
                {paymentList.map((row) => {
                  const { idFormaDePagamento, nome, taxa } = row;

                  return (
                    <TableRow
                      key={idFormaDePagamento}
                      hover
                      tabIndex={-1}
                      onClick={() => handleEditPayment(row)} // Adicione esta linha
                    >
                      <TableCell component="th" scope="row" padding="normal">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {idFormaDePagamento}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{nome}</TableCell>
                      <TableCell align="left">{taxa + '%'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>

            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 15, 25]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Formas de pagamento por página"
          />
        </Card>

        <Dialog open={isAddPaymentDialogOpen} onClose={handleCloseAddPaymentDialog}>
          <DialogTitle>Adicionar Forma de Pagamento</DialogTitle>
          <DialogContent>

            <form style={{
              display: 'flex',
              justifyContent: 'center',
            }}>
              <TextField
                name="nome"
                label="Nome"
                variant="filled"
                fullWidth
                style={estiloCampo}
                value={paymentValues.nome}
                onChange={handleFieldChange}
                sx={{
                  backgroundColor: '#fff',
                }}
              />
              <TextField
                name="taxa"
                label="Taxa (%)"
                variant="filled"
                fullWidth
                style={estiloCampo}
                value={paymentValues.taxa}
                onChange={handleFieldChange}
                sx={{
                  backgroundColor: '#fff',
                }}
              />
            </form>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '10px',
            }}>
              <Button
                onClick={() => {
                  handleCreateOrUpdatePayment();
                  handleCloseAddPaymentDialog();
                }}
                style={{
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
                }}>
                Adicionar
              </Button>
              {paymentValues.idFormaDePagamento && (
                <Button
                  onClick={() => handleDeletePayment(paymentValues.idFormaDePagamento)}
                  style={{
                    backgroundColor: '#FF1744',
                    color: '#fff',
                    width: '90px',
                    height: '36px',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      backgroundColor: '#D50000',
                    },
                    '&:active': {
                      backgroundColor: '#B71C1C',
                    },
                  }}>
                  Excluir
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

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
    </>
  );
}
