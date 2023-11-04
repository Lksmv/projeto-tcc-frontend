import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import {
    Table,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    Breadcrumbs,
    Link,
    TableContainer,
    Paper,
    TableHead,
    Button,
    Grid
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';

export default function ReportInfoProductPage() {

    const buttonStyle = {
        fontFamily: 'Roboto, sans-serif',
        borderRadius: '4px',
        boxSizing: 'border-box',
        textTransform: 'none',
    };

    const imprimirButtonStyle = {
        ...buttonStyle,
        marginTop: '-25px',
        backgroundColor: '#808080',
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

    const [clientList, setClientList] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    const [rows, setRows] = useState([
        { codigo: 1, cliente: '1 - Luis', produtos: '1 - Vestido, 1 - Terno', dataRetirada: '1', dataDevolucao: '', status: 'Aberto' },
        { codigo: 2, cliente: '2 - Luis', produtos: '2 - Vestido, 2 - Terno', dataRetirada: '1', dataDevolucao: '', status: 'Aberto' },
        { codigo: 3, cliente: '3 - Luis', produtos: '3 - Vestido, 3 - Terno', dataRetirada: '1', dataDevolucao: '', status: 'Aberto' },
        { codigo: 4, cliente: '4 - Luis', produtos: '4 - Vestido, 4 - Terno', dataRetirada: '1', dataDevolucao: '', status: 'Aberto' },
        { codigo: 5, cliente: '5 - Luis', produtos: '5 - Vestido, 5 - Terno', dataRetirada: '1', dataDevolucao: '', status: 'Aberto' },
        { codigo: 6, cliente: '6 - Luis', produtos: '6 - Vestido, 6 - Terno', dataRetirada: '1', dataDevolucao: '', status: 'Aberto' },
    ]);

    const fetchClientList = async () => {
        try {
            const response = await axios.get(BACKEND_URL + 'cliente', {
                params: {
                    size: rows,
                },
            });
            setClientList(response.data.content);
            setTotalItems(response.data.totalElements);
        } catch (error) {
            console.error('Erro ao buscar a lista de clientes:', error);
        }
    };

    useEffect(() => {
    }, [rows]);

    const handlePrint = () => {
        // Handle the print action here, for example, by opening the print dialog.
        window.print();
    };

    return (
        <>
            <Helmet>
                <title>Relatório Produto</title>
            </Helmet>
            <Container maxWidth="xl" sx={{ marginBottom: "30px" }}>
                <Container maxWidth="100%" style={{ alignContent: 'left' }}>
                    <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
                        Relatório Produto
                    </Typography>
                    <Grid container >
                        <Grid item xs={6}>
                            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
                                <Link color="inherit" href="/dashboard">
                                    Dashboard
                                </Link>
                                <Typography variant="subtitle1" color="text.primary">Relatório Produto</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Button variant="filled" onClick={handlePrint} style={imprimirButtonStyle}>Imprimir</Button>
                        </Grid>
                    </Grid>
                </Container>

                <div style={{ width: '100%' }}>
                    <TableContainer component={Paper} style={{ maxHeight: '550px', overflowY: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Código</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Cliente</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Produtos</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Data Retirada</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Data Devolução</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.codigo}>
                                        <TableCell>{row.codigo}</TableCell>
                                        <TableCell>{row.cliente}</TableCell>
                                        <TableCell>{row.produtos}</TableCell>
                                        <TableCell>{row.dataRetirada}</TableCell>
                                        <TableCell>{row.dataDevolucao}</TableCell>
                                        <TableCell>{row.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Container >
        </>
    );
}
