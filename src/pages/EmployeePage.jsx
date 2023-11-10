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

const TABLE_HEAD = [
  { id: 'codigo', label: 'Código', alignRight: false },
  { id: 'nome', label: 'Nome', alignRight: false },
];

export default function EmployeePage() {
  const estiloCampo = {
    margin: '8px',
    borderRadius: '5px 5px 0 0',
    maxWidth: '50%',
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtro, setFiltro] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isAddEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);

  const [employeeValues, setEmployeeValues] = useState({
    codigo: 0,
    nome: '',
    update: ''
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
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
        showSnackbar('Funcionario atualizada com sucesso.');
      } else {
        const response = await axios.post(
          BACKEND_URL + 'funcionario',
          requestData
        );
        showSnackbar('Funcionario criada com sucesso.');
      }
      handleCloseAddEmployeeDialog();
      fetchEmployeeList();
    } catch (error) {
      showSnackbar('Erro ao salvar a Funcionario.');
      console.error('Erro ao salvar a Funcionario:', error);
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
            <form style={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                name="codigo"
                label="Código"
                variant="filled"
                fullWidth
                style={estiloCampo}
                value={employeeValues.codigo}
                onChange={handleFieldChange}
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
              />
            </form>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={() => {
                  handleCreateOrUpdateEmployee();
                  handleCloseAddEmployeeDialog();
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
            </div>
          </DialogContent>
        </Dialog>
      </Container>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>
    </>
  );
}
