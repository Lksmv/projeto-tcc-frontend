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
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import USERLIST from '../__mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Código', alignRight: false },
  { id: 'nome', label: 'Nome', alignRight: false },
  { id: 'telefone', label: 'Telefone', alignRight: false },
  { id: 'cpf', label: 'CPF', alignRight: false }
];

// ----------------------------------------------------------------------

function applySortFilter(array, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  if (query) {
    return filter(array, (_user) =>
      _user.nome.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
      _user.id.indexOf(query) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order] = useState('asc');

  const [orderBy] = useState('name');

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Cliente</title>
      </Helmet>

      <Container maxWidth="xl">
      <Typography variant="subtitle1" sx={{ mb: 2, color: '#DFE3E8'}}>
        {'>'} Cliente
        <Divider sx={{backgroundColor: '#fff', mb: 3}} />
      </Typography>

        <Card>
          <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <TableContainer>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={USERLIST.length}
              />
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { id, nome, telefone, cpf } = row;

                  return (
                    <TableRow hover key={id} tabIndex={-1}>

                      <TableCell component="th" scope="row" padding="normal" >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {id}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell align="left">{nome}</TableCell>

                      <TableCell align="left">{telefone}</TableCell>

                      <TableCell align="left">{cpf}</TableCell>

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
            count={USERLIST.length}
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
