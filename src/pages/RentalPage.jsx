import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState } from 'react';
import Divider from '@mui/material/Divider';
import {
  Card,
  Table,
  Stack,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { ListHead, ListToolBar } from '../sections/@dashboard/list';
import LIST from '../__mock/rental';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Código', alignRight: false },
  { id: 'cliente', label: 'Cliente', alignRight: false },
  { id: 'produto', label: 'Produto', alignRight: false },
  { id: 'qtdProdutos', label: 'Quantidade', alignRight: false },
  { id: 'saida', label: 'Saída', alignRight: false },
  { id: 'devolucao', label: 'Devolução', alignRight: false },
  { id: 'valor', label: 'Valor', alignRight: false },
  { id: 'finalizado', label: 'Finalizado', alignRight: false},
];

// ----------------------------------------------------------------------

function applySortFilter(array, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  if (query) {
    return filter(array, (rental) =>
    rental.cliente.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
    rental.id.indexOf(query) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function RentalPage() {
  const [page, setPage] = useState(0);

  const [order] = useState('asc');

  const [orderBy] = useState('cliente');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);


  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - LIST.length) : 0;

  const filteredList = applySortFilter(LIST, filterName);

  const isNotFound = !filteredList.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Aluguel</title>
      </Helmet>

      <Container maxWidth="xl">
      <Typography variant="subtitle1" sx={{ mb: 2}}>
        {'>'} Aluguel
        <Divider sx={{backgroundColor: '#606060', mb: 3}} />
      </Typography>

        <Card>
          <ListToolBar 
          filterName={filterName} 
          onFilterName={handleFilterByName}
          placeHolder={'Procurar por Código ou Nome'}
          buttonText={'Adicionar Aluguel'}
          toPage={"/aluguel/cadastro"}
          />

          <TableContainer>
            <Table>
              <ListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={LIST.length}
              />
              <TableBody>
                {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { id, cliente, produto, qtdProdutos, saida, devolucao, valor, finalizado } = row;

                  return (
                    <TableRow hover key={id} tabIndex={-1}>

                      <TableCell component="th" scope="row" padding="normal" >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {id}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell align="left">{cliente}</TableCell>

                      <TableCell align="left">{produto}</TableCell>

                      <TableCell align="left">{qtdProdutos}</TableCell>

                      <TableCell align="left">{saida}</TableCell>

                      <TableCell align="left">{devolucao}</TableCell>

                      <TableCell align="left">{valor}</TableCell>

                      <TableCell align="left">{finalizado}</TableCell>

                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <Paper
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="h6" paragraph>
                          Not found
                        </Typography>

                        <Typography variant="body2">
                          No results found for &nbsp;
                          <strong>&quot;{filterName}&quot;</strong>.
                          <br /> Try checking for typos or using complete words.
                        </Typography>
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 15, 25]}
            component="div"
            count={LIST.length}
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
