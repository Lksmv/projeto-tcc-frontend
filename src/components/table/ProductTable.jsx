import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Paper,
    TextField,
} from '@mui/material';

const ProductTable = () => {
    const [rows, setRows] = useState([
        { id: 1, nome: 'Produto A', valor: 10 },
        { id: 2, nome: 'Produto B', valor: 20 },
        { id: 3, nome: 'Produto C', valor: 30 },
        { id: 4, nome: 'Produto D', valor: 30 },
        { id: 5, nome: 'Produto E', valor: 30 },
        { id: 6, nome: 'Produto F', valor: 30 },
    ]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleRowSelect = (row) => {
        const selectedIndex = selectedRows.indexOf(row);
        const newSelected = [...selectedRows];

        if (selectedIndex === -1) {
            newSelected.push(row);
        } else {
            newSelected.splice(selectedIndex, 1);
        }

        setSelectedRows(newSelected);
    };

    const isSelected = (row) => selectedRows.indexOf(row) !== -1;

    const filteredRows = rows.filter((row) =>
        row.id.toString().includes(searchTerm) || row.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ width: '100%'}}>
            <TextField
                label="Produtos"
                variant="filled"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', borderRadius: '5px 5px 0 0' }}
                sx={{
                    backgroundColor: '#fff',
                }}
            />
            <TableContainer component={Paper} style={{ maxHeight: '220px', overflowY: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>
                                <Checkbox
                                    checked={selectedRows.length === rows.length}
                                    onChange={() => {
                                        if (selectedRows.length === rows.length) {
                                            setSelectedRows([]);
                                        } else {
                                            setSelectedRows(rows);
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Codigo</TableCell>
                            <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Nome</TableCell>
                            <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Valor</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.map((row) => (
                            <TableRow
                                key={row.id}
                                selected={isSelected(row)}
                                hover
                                onClick={() => handleRowSelect(row)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox checked={isSelected(row)} />
                                </TableCell>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.nome}</TableCell>
                                <TableCell>{row.valor}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ProductTable;
