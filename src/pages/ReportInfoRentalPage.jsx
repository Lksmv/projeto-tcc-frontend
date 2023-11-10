import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { formatOutputDate, formatInputDate } from '../utils/formatTime';
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
    Grid
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';
import ReportDownloadButton from '../components/downloadReport/donwloadReport';

export default function ReportInfoProductPage() {

    const [aluguelList, setAluguelList] = useState([]);
    const { dataInicial, dataFinal, codigoCategoria, status } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const content = {
            dataInicial: dataInicial,
            dataFinal: dataFinal,
            codigoCategoria: codigoCategoria == 0 ? "" : codigoCategoria,
            status: status == 4 ? "" : status,
        };

        axios
            .get(BACKEND_URL + `aluguel/por-data`, { params: content })
            .then((response) => {
                setAluguelList(response.data);
            })
    }, [dataInicial, dataFinal, codigoCategoria, status]);


    return (
        <>
            <Helmet>
                <title>Relatório Aluguel</title>
            </Helmet>
            <Container maxWidth="xl" sx={{ marginBottom: "30px", marginTop: '30px' }}>
                <Container maxWidth="100%" style={{ alignContent: 'left', marginTop: '30px' }}>
                    <Grid container >
                        <Grid item xs={6}>
                            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
                                <Link color="inherit" href="/dashboard">
                                    Dashboard
                                </Link>
                                <Link color="inherit" href="/aluguel/relatorio">
                                    Relatório de alugueis
                                </Link>
                                <Typography variant="subtitle1" color="text.primary">
                                    Relatório de alugueis de {formatOutputDate(dataInicial)} até {formatOutputDate(dataFinal)}
                                </Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <ReportDownloadButton nomeArquivo={"relatorioAluguel.docx"} url={BACKEND_URL + `aluguel/relatorio-por-data/download`} params={{
                                dataInicial: dataInicial,
                                dataFinal: dataFinal,
                                codigoCategoria: codigoCategoria == 0 ? "" : codigoCategoria,
                                status: status == 4 ? "" : status,
                            }} />
                        </Grid>
                    </Grid>
                </Container>

                <div style={{ width: '100%' }}>
                    <TableContainer component={Paper} style={{ maxHeight: '550px', overflowY: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Código Aluguel</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Nome Cliente</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Valor</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Status</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Data Devolução</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Data Retirada</TableCell>
                                    <TableCell style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>Produto(s)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {aluguelList && aluguelList.map((row) => (
                                    <TableRow
                                        key={row.codigo}
                                        style={{ cursor: 'pointer', background: row.statusAluguel === 'FECHADO' ? '#c6f68d' : row.status === 'CANCELADO' ? '#ffc8b9' : '#fddeb1' }}
                                        onClick={() => {
                                            navigate(`/aluguel/detalhes/${row.codigo}`);
                                        }}
                                    >
                                        <TableCell>{row.codigo}</TableCell>
                                        <TableCell>{row.clienteDTO.nome}</TableCell>
                                        <TableCell>{'R$ ' + row.valor}</TableCell>
                                        <TableCell>{row.statusAluguel}</TableCell>
                                        <TableCell>{formatOutputDate(row.dataDevolucao)}</TableCell>
                                        <TableCell>{formatOutputDate(row.dataSaida)}</TableCell>
                                        <TableCell>
                                            {row.listaProdutos.map((produto, index) => (
                                                <span key={produto.produtoDTO.codigo}>
                                                    {produto.produtoDTO.nome}
                                                    {index < row.listaProdutos.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </TableCell>

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
