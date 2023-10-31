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
  Link
} from '@mui/material';
import { BACKEND_URL } from '../utils/backEndUrl';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ListHead, ListToolBar } from '../sections/@dashboard/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'imagem', label: 'Imagem', alignRight: false },
  { id: 'codigo', label: 'Código', alignRight: false },
  { id: 'nome', label: 'Nome', alignRight: false },
  { id: 'tamanho', label: 'Tamanho', alignRight: false },
  { id: 'cor', label: 'Cores', alignRight: false },
  { id: 'valor', label: 'valor', alignRight: false }
];

// ----------------------------------------------------------------------

export default function ProductPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [productList, setProductList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  const fetchProductList = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'produto', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filterName,
        },
      });
      setProductList(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar a lista de produtos:', error);
    }
  };

  useEffect(() => {
    fetchProductList();
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalItems) : 0;


  return (
    <>
      <Helmet>
        <title>Produto</title>
      </Helmet>
      <Container maxWidth="xl" sx={{ marginBottom: "30px" }}>
        <Container maxWidth="100%" style={{ alignContent: 'left' }}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
            Produto
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Typography variant="subtitle1" color="text.primary">Produto</Typography>
          </Breadcrumbs>
        </Container>

        <Card>
          <ListToolBar
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeHolder={'Procurar por Código ou Nome'}
            buttonText={'Adicionar Produto'}
            toPage={"/produto/cadastro"}
          />

          <TableContainer>
            <Table>
              <ListHead headLabel={TABLE_HEAD} rowCount={totalItems} />
              <TableBody>
                {productList.map((row) => {
                  const { codigo, imagens, nome, tamanho, cor, valor } = row;
                  return (
                    <TableRow
                      key={codigo}
                      onClick={() => {
                        navigate(`/produto/detalhes/${codigo}`);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell align="left">{<img src={imagens[0]} style={{ maxWidth: '75px', borderRadius: '10px' }}></img>}</TableCell>

                      <TableCell align="left">{codigo}</TableCell>

                      <TableCell align="left">{nome}</TableCell>

                      <TableCell align="left">{tamanho}</TableCell>

                      <TableCell align="left">{cor}</TableCell>

                      <TableCell align="left">{valor}</TableCell>

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
          />
        </Card>
      </Container>
    </>
  );
}
