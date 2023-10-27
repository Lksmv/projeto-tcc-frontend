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
  Button
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';
import { ListHead, ListToolBar } from '../sections/@dashboard/list';

const TABLE_HEAD = [
  { id: 'idUsuario', label: 'Código', alignRight: false },
  { id: 'nome', label: 'Nome', alignRight: false },
  { id: 'login', label: 'Login', alignRight: false },
  { id: 'cargo', label: 'Cargo', alignRight: false },
];

export default function UserPage() {
  const estiloCampo = {
    margin: '8px',
    borderRadius: '5px 5px 0 0',
    maxWidth: '50%'
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtro, setFiltro] = useState('');
  const [userList, setUserList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const cargos = [
    'Nenhum', 'Administrador', 'Funcionário'
  ];

  const [formValues, setFormValues] = useState({
    codigo: "",
    nome: "",
    cargo: "",
    login: "",
    senha: "",
  });

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
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const codigoAsInteger = parseInt(formValues.codigo, 10);

    const requestData = {
      ...formValues,
      codigo: codigoAsInteger,
    };

    try {
      const response = await axios.post(BACKEND_URL + 'usuario', requestData);
      console.log('Usuário salvo com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao salvar o usuário:', error);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalItems) : 0;

  return (
    <>
      <Helmet>
        <title>Usuário</title>
      </Helmet>
      <Container maxWidth="xl" sx={{ marginBottom: "30px" }}>
        <Container maxWidth="100%" style={{ marginTop: '16px', alignContent: 'left' }}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
            Usuário
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Typography variant="subtitle1" color="text.primary">Usuário</Typography>
          </Breadcrumbs>
        </Container>

        <Card>
          <ListToolBar
            filtro={filtro}
            onfiltro={handleFilterByName}
            placeHolder={'Procurar por Código ou Nome'}
          />

          <TableContainer>
            <Table>
              <ListHead headLabel={TABLE_HEAD} rowCount={totalItems} />
              <TableBody>
                {userList.map((row) => {
                  const { idUsuario, nome, login, cargo } = row;

                  return (
                    <TableRow key={idUsuario} hover tabIndex={-1}>
                      <TableCell component="th" scope="row" padding="normal">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {idUsuario}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{nome}</TableCell>
                      <TableCell align="left">{login}</TableCell>
                      <TableCell align="left">{cargo}</TableCell>
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
          />
        </Card>

        <Container>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} margin={2}>
              <Grid item xs={12} sm={6} display="flex" flexDirection="column" alignItems='left'>
                <TextField
                  name="codigo"
                  label="Código"
                  variant="filled"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.codigo}
                  onChange={handleFieldChange}
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
                  value={formValues.nome}
                  onChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                />
                <TextField
                  name="cargo"
                  variant="filled"
                  select
                  label="Cargo"
                  fullWidth
                  style={estiloCampo}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                  value={formValues.cargo}
                  onChange={handleFieldChange}
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    }
                  }}
                >
                  {cargos.map((cargo) => (
                    <MenuItem key={cargo} value={cargo}>
                      {cargo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} display="flex" flexDirection="column" sx={{ alignItems: 'left' }}>
                <TextField
                  name="login"
                  label="Login"
                  variant="filled"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.login}
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
                  value={formValues.senha}
                  onChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                />
              </Grid>
            </Grid>

            <div className="botoes-cadastro-produto" style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', marginBottom: '16px' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{
                  width: '90px',
                  height: '36px',
                  marginRight: '8px',
                  fontFamily: 'Rubik, sans-serif',
                  backgroundColor: '#336DC3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  boxSizing: 'border-box',
                }}
              >
                SALVAR
              </Button>
              <Button
                type="reset"
                variant="contained"
                color="error"
                style={{ width: '117px', height: '36px', marginLeft: '8px', fontFamily: 'Rubik, sans-serif', backgroundColor: '#B21447', color: '#fff', border: 'none', borderRadius: '5px', boxSizing: 'border-box' }}
              >
                CANCELAR
              </Button>
            </div>
          </form>
        </Container>

      </Container>
    </>
  );
}
