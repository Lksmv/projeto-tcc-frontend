import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import { BACKEND_URL } from '../utils/backEndUrl';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ListHead, ListToolBar } from '../sections/@dashboard/list';
import { formatOutputDate } from '../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'codigo', label: 'Código', alignRight: false },
  { id: 'cliente', label: 'Cliente', alignRight: false },
  { id: 'produto', label: 'Produto(s)', alignRight: false },
  { id: 'dataSaida', label: 'Data Saída', alignRight: false },
  { id: 'dataDevolucao', label: 'Data Devolução', alignRight: false },
  { id: 'statusAluguel', label: 'Status', alignRight: false },
];

// ----------------------------------------------------------------------

export default function RentalPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [rentalList, setRentalList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  const fetchRental = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'aluguel', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filterName,
        },
      });
      setRentalList(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar a lista de aluguel:', error);
    }
  };

  useEffect(() => {
    fetchRental();
  }, [page, rowsPerPage, filterName]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  return (
    <>
      <Helmet>
        <title>Aluguel</title>
      </Helmet>
      <Container maxWidth="xl" sx={{ marginBottom: "30px" }}>
        <Container maxWidth="100%" style={{ alignContent: 'left', marginTop: '30px' }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Typography variant="subtitle1" color="text.primary">Aluguel</Typography>
          </Breadcrumbs>
        </Container>

        <Card>
          <ListToolBar
            filtro={filterName}
            onfiltro={handleFilterByName}
            placeHolder={'Procurar por Código ou Nome'}
            buttonText={'Adicionar Aluguel'}
            toPage={"/aluguel/cadastro"}
          />
          <TableContainer>
            <Table>
              <ListHead headLabel={TABLE_HEAD} rowCount={totalItems} />
              <TableBody>
                {rentalList.map((row) => {
                  const listaProdutos = row.listaProdutos;
                  const produtos = row.listaProdutos.map((rowData) => {
                    return rowData.produtoDTO.codigo + " - " + rowData.produtoDTO.nome;
                  }).join(', ');

                  const cliente = row.clienteDTO.nome;

                  const { codigo, dataSaida, dataDevolucao, statusAluguel } = row;

                  return (
                    <TableRow
                      key={codigo}
                      onClick={() => {
                        navigate(`/aluguel/detalhes/${codigo}`);
                      }}
                      style={{
                        cursor: 'pointer',
                        background: row.statusAluguel == 'ABERTO' ? '#c6f68d' : row.statusAluguel == 'CANCELADO' ? '#ffc8b9' : '#fddeb1'
                      }}
                    >
                      <TableCell align="left">{codigo}</TableCell>
                      <TableCell align="left">{cliente}</TableCell>
                      <TableCell align="left">{produtos}</TableCell> {/* Exibir a lista de produtos aqui */}
                      <TableCell align="left">{formatOutputDate(dataSaida)}</TableCell>
                      <TableCell align="left">{formatOutputDate(dataDevolucao)}</TableCell>
                      <TableCell align="left">{statusAluguel}</TableCell>
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
            labelRowsPerPage="Aluguéis por página"
          />
        </Card>
      </Container>
    </>
  );
}
