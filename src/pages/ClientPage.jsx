import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Breadcrumbs,
  Link,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';
import { ListHead, ListToolBar } from '../sections/@dashboard/list';

const TABLE_HEAD = [
  { id: 'codigo', label: 'Código', alignRight: false },
  { id: 'nome', label: 'Nome', alignRight: false },
  { id: 'telefone', label: 'Telefone', alignRight: false },
  { id: 'cpf', label: 'CPF', alignRight: false },
];

export default function ClientPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtro, setFiltro] = useState('');
  const [clientList, setClientList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  const fetchClientList = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'cliente', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filtro,
        },
      });
      setClientList(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar a lista de clientes:', error);
    }
  };

  useEffect(() => {
    fetchClientList();
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

  return (
    <>
      <Helmet>
        <title>Cliente</title>
      </Helmet>
      <Container maxWidth="xl" sx={{ marginBottom: "30px" }}>
        <Container maxWidth="100%" style={{ alignContent: 'left', marginTop: '30px'}}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Typography variant="subtitle1" color="text.primary">Cliente</Typography>
          </Breadcrumbs>
        </Container>

        <Card>
          <ListToolBar
            filtro={filtro}
            onfiltro={handleFilterByName}
            placeHolder={'Procurar por Código, Nome ou CPF'}
            buttonText={'Adicionar Cliente'}
            toPage={"/cliente/cadastro"}
          />

          <TableContainer>
            <Table>
              <ListHead headLabel={TABLE_HEAD} rowCount={totalItems} />
              <TableBody>
                {clientList.map((row) => {
                  const { codigo, nome, telefone, cpf } = row;

                  return (
                    <TableRow
                      key={codigo}
                      onClick={() => {
                        navigate(`/cliente/detalhes/${codigo}`);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell align="left">{codigo}</TableCell>
                      <TableCell align="left">{nome}</TableCell>
                      <TableCell align="left">{telefone}</TableCell>
                      <TableCell align="left">{cpf}</TableCell>
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
            labelRowsPerPage="Clientes por página"
          />
        </Card>
      </Container>
    </>
  );
}
