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
  Grid,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';
import { ListHead, ListToolBar } from '../sections/@dashboard/list';
import MuiAlert from '@mui/material/Alert';

const TABLE_HEAD = [
  { id: 'codigo', label: 'Código', alignRight: false },
  { id: 'nome', label: 'Nome', alignRight: false },
  { id: 'login', label: 'Login', alignRight: false },
  { id: 'cargo', label: 'Cargo', alignRight: false },
];

export default function UserPage() {
  const estiloCampo = {
    margin: '8px',
    borderRadius: '5px 5px 0 0',
    maxWidth: '90%',
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


  const excluirButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#E91E63',
    color: '#fff',
    width: '90px',
    height: '36px',
    marginRight: '8px',
    marginLeft: '8px',  // Adicionando margem à esquerda
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#D81B60',
    },
    '&:active': {
      backgroundColor: '#C2185B',
    },
  };


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtro, setFiltro] = useState('');
  const [userList, setUserList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const cargos = [
    { nome: 'Selecione um cargo', id: 0 },
    { nome: 'Administrador', id: 1 },
    { nome: 'Funcionário', id: 2 }
  ];

  const [userValues, setUserValues] = useState({
    codigo: 0,
    nome: '',
    idCargo: 1,
    login: '',
    senha: '',
    update: ''
  });


  const handleOpenAddUserDialog = () => {
    setAddUserDialogOpen(true);
  };
  const handleOpenEditUserDialog = (row) => {
    setAddUserDialogOpen(true);
    setUserValues({
      ...row,
      senha: '',
      update: row.codigo,
      idCargo: row.cargoDTO.idCargo
    });
  };

  const handleCloseAddUserDialog = () => {
    setAddUserDialogOpen(false),
      setUserValues({
        codigo: 0,
        nome: '',
        idCargo: 2,
        login: '',
        senha: '',
        update: ''
      });
  };

  const handleDeleteUser = async () => {
    try {
      if (userValues.update) {
        const response = await axios.delete(
          `${BACKEND_URL}usuario/${userValues.update}`
        );
        showSnackbar('Usuário excluído com sucesso.', 'success');
        fetchUserList();
      }
    } catch (error) {
      showSnackbar('Erro ao excluir o Usuário.', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const fetchUserList = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'usuario', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filtro,
        },
      });
      setUserList(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar a lista de usuários:', error);
    }
  };

  useEffect(() => {
    fetchUserList();
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

    setUserValues({ ...userValues, [name]: value });
  };

  const handleCodigoFieldChange = (e) => {
    const inputValue = e.target.value;

    const numericValue = inputValue.replace(/\D/g, '');
    const { name, value } = e.target;

    setUserValues({ ...userValues, [name]: numericValue });
  };

  const handleCreateOrUpdateUser = async () => {
    const requestData = {
      ...userValues,
    };

    console.log(requestData);

    try {
      if (userValues.update) {
        const response = await axios.put(
          `${BACKEND_URL}usuario/${userValues.update}`,
          requestData
        );
        showSnackbar('Usuario atualizada com sucesso.', 'success');
      } else {
        const response = await axios.post(
          BACKEND_URL + 'usuario',
          requestData
        );
        showSnackbar('Usuario criado com sucesso.', 'success');
      }
      handleCloseAddUserDialog();
      fetchUserList();
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
        showSnackbar(`Erro ao salvar usuário: ${error.message}`, 'error');
      }
    }
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalItems) : 0;

  return (
    <>
      <Helmet>
        <title>Usuário</title>
      </Helmet>
      <Container maxWidth="xl" sx={{ marginBottom: '30px' }}>
        <Container
          maxWidth="100%"
          style={{ marginTop: '16px', alignContent: 'left' }}
        >
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
          >
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Typography variant="subtitle1" color="text.primary">
              Usuário
            </Typography>
          </Breadcrumbs>
        </Container>

        <Card>
          <ListToolBar
            filtro={filtro}
            onfiltro={handleFilterByName}
            placeHolder={'Procurar por Código ou Nome'}
            buttonText={'Adicionar'}
            popup={handleOpenAddUserDialog}
          />

          <TableContainer>
            <Table>
              <ListHead headLabel={TABLE_HEAD} rowCount={totalItems} />
              <TableBody>
                {userList.map((row) => {
                  const { codigo, nome, login, cargoDTO } = row;

                  return (
                    <TableRow
                      key={codigo}
                      hover
                      tabIndex={-1}
                      onClick={() => handleOpenEditUserDialog(row)}
                    >
                      <TableCell component="th" scope="row" padding="normal">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {codigo}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{nome}</TableCell>
                      <TableCell align="left">{login}</TableCell>
                      <TableCell align="left">{cargoDTO.idCargo == 1 ? 'Administrador' : 'Funcionário'}</TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
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
            labelRowsPerPage="Usuários por página"
          />
        </Card>

        <Dialog open={isAddUserDialogOpen} onClose={handleCloseAddUserDialog}>
          <DialogTitle>Adicionar Usuário</DialogTitle>
          <DialogContent>
            <form style={{ display: 'flex', justifyContent: 'center' }}>
              <Grid container spacing={2} padding={1}>
                <Grid item xs={12} sm={6} display="flex" flexDirection="column" alignItems='center'>
                  <TextField
                    name="codigo"
                    label="Código"
                    variant="filled"
                    fullWidth
                    style={estiloCampo}
                    value={userValues.codigo}
                    onChange={handleCodigoFieldChange}
                    sx={{
                      backgroundColor: '#fff',
                    }}
                  />
                  <TextField
                    name="nome"
                    label="Nome"
                    variant="filled"
                    fullWidth
                    style={estiloCampo}
                    value={userValues.nome}
                    onChange={handleFieldChange}
                    sx={{
                      backgroundColor: '#fff',
                    }}
                  />
                  <TextField
                    name="idCargo"
                    variant="filled"
                    select
                    label="Cargo"
                    fullWidth
                    style={estiloCampo}
                    sx={{
                      backgroundColor: '#fff',
                    }}
                    value={userValues.idCargo}
                    onChange={handleFieldChange}
                    SelectProps={{
                      MenuProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    {cargos.map((cargo) => (
                      <MenuItem key={cargo.id} value={cargo.id}>
                        {cargo.nome}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} display="flex" flexDirection="column" sx={{ alignItems: 'center' }}>
                  <TextField
                    name="login"
                    label="Login"
                    variant="filled"
                    fullWidth
                    style={estiloCampo}
                    value={userValues.login}
                    onChange={handleFieldChange}
                    sx={{
                      backgroundColor: '#fff'
                    }}
                  />
                  <TextField
                    name="senha"
                    label="Senha"
                    variant="filled"
                    fullWidth
                    style={estiloCampo}
                    value={userValues.senha}
                    onChange={handleFieldChange}
                    sx={{
                      backgroundColor: '#fff'
                    }}
                  />
                </Grid>
              </Grid>
            </form>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button
                onClick={() => {
                  handleCreateOrUpdateUser();
                  handleCloseAddUserDialog();
                }}
                style={salvarButtonStyle}
              >
                Adicionar
              </Button>
              {userValues.update && (
                <Button
                  onClick={() => {
                    handleDeleteUser();
                    handleCloseAddUserDialog();
                  }}
                  style={excluirButtonStyle}
                >
                  Excluir
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
