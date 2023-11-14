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
  DialogContent,
  Snackbar,
  IconButton,
  SnackbarContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';
import { ListHead, ListToolBar } from '../sections/@dashboard/list';
import MuiAlert from '@mui/material/Alert';

const TABLE_HEAD = [
  { id: 'codigo', label: 'Código', alignRight: false },
  { id: 'nome', label: 'Nome', alignRight: false },
];

export default function EmployeePage() {
  const estiloCampo = {
    margin: '8px',
    borderRadius: '5px 5px 0 0',
    width: '100%',
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtro, setFiltro] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isAddEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [employeeValues, setEmployeeValues] = useState({
    codigo: 0,
    nome: '',
    update: ''
  });

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleDeleteEmployee = async () => {
    try {
      if (employeeValues.update) {
        const response = await axios.delete(
          `${BACKEND_URL}funcionario/${employeeValues.update}`
        );
        showSnackbar('Funcionário excluído com sucesso.', 'success');
        fetchEmployeeList();
        handleCloseAddEmployeeDialog();
      }
    } catch (error) {
      showSnackbar('Erro ao excluir o funcionário.', 'error');
      console.error('Erro ao excluir o funcionário:', error);
    }
  };

  const handleEditEmployee = (employee) => {
    setEmployeeValues({
      ...employee,
      update: employee.codigo
    });
    setAddEmployeeDialogOpen(true)
  };

  const handleOpenAddEmployeeDialog = () => {
    setEmployeeValues({
      ...employeeValues,
      update: ''
    });
    setAddEmployeeDialogOpen(true)
  };

  const handleCloseAddEmployeeDialog = () => {
    setAddEmployeeDialogOpen(false);
    setEmployeeValues({
      codigo: 0,
      nome: '',
      update: ''
    })
  };

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'funcionario', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filtro,
        },
      });
      setEmployeeList(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar a lista de funcionario:', error);
    }
  };

  useEffect(() => {
    fetchEmployeeList();
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
    setEmployeeValues({ ...employeeValues, [name]: value });
  };

  const handleCodigoFieldChange = (e) => {
    const inputValue = e.target.value;

    const numericValue = inputValue.replace(/\D/g, '');
    const { name, value } = e.target;

    setUserValues({ ...userValues, [name]: numericValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleCreateOrUpdateEmployee();
  }

  const handleCreateOrUpdateEmployee = async () => {
    const requestData = {
      ...employeeValues,
    };

    try {
      if (employeeValues.update) {
        const response = await axios.put(
          `${BACKEND_URL}funcionario/${employeeValues.update}`,
          requestData
        );
        showSnackbar('Funcionario atualizada com sucesso.', 'success');
      } else {
        const response = await axios.post(
          BACKEND_URL + 'funcionario',
          requestData
        );
        showSnackbar('Funcionario criada com sucesso.', 'success');
      }
      handleCloseAddEmployeeDialog();
      fetchEmployeeList();
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
        showSnackbar(`Erro ao salvar a categoria: ${error.message}`, 'error');
      }
    }
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalItems) : 0;

  return (
    <>
      <Helmet>
        <title>Categoria</title>
      </Helmet>
      <Container sx={{ marginBottom: '30px' }}>
        <Container maxWidth="100%" style={{ alignContent: 'left', marginTop: '30px' }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
          >
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Typography variant="subtitle1" color="text.primary">
              Funcionário
            </Typography>
          </Breadcrumbs>
        </Container>

        <Card>
          <ListToolBar
            filtro={filtro}
            onfiltro={handleFilterByName}
            placeHolder={'Procurar por Código ou Nome'}
            buttonText={'Adicionar'}
            popup={handleOpenAddEmployeeDialog}
          />

          <TableContainer>
            <Table>
              <ListHead headLabel={TABLE_HEAD} rowCount={totalItems} />
              <TableBody>
                {employeeList.map((row) => {
                  const { codigo, nome } = row;

                  return (
                    <TableRow
                      key={codigo}
                      hover
                      tabIndex={-1}
                      onClick={() => handleEditEmployee(row)}
                    >
                      <TableCell component="th" scope="row" padding="normal">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {codigo}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{nome}</TableCell>
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
            labelRowsPerPage="Funcionários por página"
          />
        </Card>

        <Dialog open={isAddEmployeeDialogOpen} onClose={handleCloseAddEmployeeDialog}>
          <DialogTitle>Adicionar Funcionário</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <TextField
                name="codigo"
                label="Código"
                variant="filled"
                fullWidth
                style={estiloCampo}
                value={employeeValues.codigo}
                onChange={handleCodigoFieldChange}
                sx={{
                  backgroundColor: '#fff',
                }}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                name="nome"
                label="Nome"
                variant="filled"
                fullWidth
                style={estiloCampo}
                value={employeeValues.nome}
                onChange={handleFieldChange}
                sx={{
                  backgroundColor: '#fff',
                }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <Button
                  type='submit'
                  style={{
                    backgroundColor: '#1976D2',
                    color: '#fff',
                    width: '120px',
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
                  Salvar
                </Button>
                {employeeValues.update && (
                  <Button
                    onClick={() => {
                      handleDeleteEmployee();
                      handleCloseAddEmployeeDialog();
                    }}
                    style={{
                      backgroundColor: '#E91E63',
                      color: '#fff',
                      width: '120px',
                      height: '36px',
                      marginRight: '8px',
                      marginLeft: '8px',
                      transition: 'background-color 0.3s',
                      '&:hover': {
                        backgroundColor: '#D81B60',
                      },
                      '&:active': {
                        backgroundColor: '#C2185B',
                      },
                    }}
                  >
                    Excluir
                  </Button>
                )}
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Container>
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
