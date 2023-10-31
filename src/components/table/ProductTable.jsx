import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
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
    Breadcrumbs,
    Link
} from '@mui/material';
import { ListHead, ListToolBar } from '../../sections/@dashboard/list';
import LIST from '../../__mock/products';

const TABLE_HEAD = [
    { id: 'id', label: 'Código', alignRight: false },
    { id: 'nome', label: 'Nome', alignRight: false },
];

function applySortFilter(array, query) {
    if (query) {
        return filter(array, (client) =>
            client.nome.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            client.id.indexOf(query) !== -1
        );
    }
    return array;
}

export default function ProductTable() {
    const [page, setPage] = useState(0);
    const [order] = useState('asc');
    const [orderBy] = useState('');
    const [filterName, setFilterName] = useState('');

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const filteredList = applySortFilter(LIST, filterName);

    const isNotFound = !filteredList.length && !!filterName;

    return (
        <>
            <Container maxWidth="xl" sx={{ marginBottom: "30px" }}>
                <Card>
                    <ListToolBar
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        placeHolder={'Procurar por Código ou Nome'}                        
                    />
                    <TableContainer>
                        <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                            <Table>
                                <ListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={LIST.length}
                                />
                                <TableBody>
                                    {filteredList.map((row) => {
                                        const { id, imagem, nome } = row;
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
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={2} sx={{ py: 3 }}>
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
                        </div>
                    </TableContainer>
                </Card>
            </Container>
        </>
    );
}
