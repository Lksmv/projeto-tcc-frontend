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
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';
import { ListHead, ListToolBar } from '../sections/@dashboard/list';

const TABLE_HEAD = [
  { id: 'codigo', label: 'Código', alignRight: false },
  { id: 'nome', label: 'Nome', alignRight: false },
];

export default function CategoryPage() {
  const estiloCampo = {
    margin: '8px',
    borderRadius: '5px 5px 0 0',
    maxWidth: '100%',
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
  const [categoryList, setCategoryList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isAddCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [categoryValues, setCategoryValues] = useState({
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

  const handleDeleteCategory = async (codigo) => {
    try {
      await axios.delete(`${BACKEND_URL}categoria/${codigo}`);
      showSnackbar('Categoria excluída com sucesso', 'success');
      handleCloseAddCategoryDialog();
      fetchCategoryList();
    } catch (error) {
      console.error('Erro ao excluir a categoria:', error);
      showSnackbar(`Erro ao excluir a categoria: ${error.message}`, 'error');
    }
  };


  const handleEditCategory = (category) => {
    setCategoryValues({
      ...category,
      update: category.codigo
    });
    setAddCategoryDialogOpen(true)
  };

  const handleOpenAddCategoryDialog = () => {
    setCategoryValues({
      ...categoryValues,
      update: ''
    });
    setAddCategoryDialogOpen(true)
  };

  const handleCloseAddCategoryDialog = () => {
    setAddCategoryDialogOpen(false);
    setCategoryValues({
      codigo: 0,
      nome: '',
      update: ''
    })
  };

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'categoria', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filtro,
        },
      });
      setCategoryList(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar a lista de categorias:', error);
    }
  };

  useEffect(() => {
    fetchCategoryList();
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
    setCategoryValues({ ...categoryValues, [name]: value });
  };

  const handleCodigoFieldChange = (e) => {
    const inputValue = e.target.value;

    const numericValue = inputValue.replace(/\D/g, '');
    const { name, value } = e.target;

    setUserValues({ ...userValues, [name]: numericValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleCreateOrUpdateCategory();
  }

  const handleCreateOrUpdateCategory = async () => {
    const requestData = {
      ...categoryValues,
    };

    try {
      if (categoryValues.update) {
        const response = await axios.put(
          `${BACKEND_URL}categoria/${categoryValues.update}`,
          requestData
        );

        showSnackbar('Categoria atualizada com sucesso', 'success');
      } else {
        const response = await axios.post(
          BACKEND_URL + 'categoria',
          requestData
        );
        showSnackbar('Categoria criada com sucesso', 'success');
      }
      handleCloseAddCategoryDialog();
      fetchCategoryList();
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
      <Container maxWidth="xl" sx={{ marginBottom: '30px' }}>
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
              Categoria
            </Typography>
          </Breadcrumbs>
        </Container>

        <Card>
          <ListToolBar
            filtro={filtro}
            onfiltro={handleFilterByName}
            placeHolder={'Procurar por Código ou Nome'}
            buttonText={'Adicionar'}
            popup={handleOpenAddCategoryDialog}
          />

          <TableContainer>
            <Table>
              <ListHead headLabel={TABLE_HEAD} rowCount={totalItems} />
              <TableBody>
                {categoryList.map((row) => {
                  const { codigo, nome } = row;

                  return (
                    <TableRow
                      key={codigo}
                      hover
                      tabIndex={-1}
                      onClick={() => handleEditCategory(row)}
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
            labelRowsPerPage="Categorias por página"
          />
        </Card>

        <Dialog open={isAddCategoryDialogOpen} onClose={handleCloseAddCategoryDialog}>
          <DialogTitle>Adicionar Categoria</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                name="codigo"
                label="Código"
                variant="filled"
                fullWidth
                style={estiloCampo}
                value={categoryValues.codigo}
                onChange={handleCodigoFieldChange}
                sx={{
                  backgroundColor: '#fff',
                }}
                required
              />
              <TextField
                name="nome"
                label="Nome"
                variant="filled"
                fullWidth
                style={estiloCampo}
                value={categoryValues.nome}
                onChange={handleFieldChange}
                sx={{
                  backgroundColor: '#fff',
                }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="submit" style={salvarButtonStyle}>
                  {categoryValues.update ? 'Salvar' : 'Adicionar'}
                </Button>
                {categoryValues.update && (
                  <Button
                    onClick={() => handleDeleteCategory(categoryValues.update)}
                    style={excluirButtonStyle}
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
