import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { formatInputDateWithouTS } from '../utils/formatTime';
import {
    Container,
    Typography,
    Breadcrumbs,
    Link,
    Grid,
    TextField,
    Button,
    Autocomplete,
    MenuItem
} from '@mui/material';
import InputMask from 'react-input-mask';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';

export default function ReportPage() {
    const navigate = useNavigate()
    const [categorias, setCategorias] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [filterName, setFilterName] = useState('');

    const statusLista = [
        { codigo: '1', nome: 'Aberto', value: 'ABERTO' },
        { codigo: '2', nome: 'Fechado', value: 'FECHADO' },
        { codigo: '3', nome: 'Cancelado', value: 'CANCELADO' },
    ];
    const [formValues, setFormValues] = useState({
        dataInicial: "",
        dataFinal: "",
        codigoCategoria: "",
        status: "",
    });


    const estiloCampo = {
        margin: '8px',
        borderRadius: '5px',
        width: '100%',
    };

    const buttonStyle = {
        fontFamily: 'Roboto, sans-serif',
        borderRadius: '4px',
        boxSizing: 'border-box',
        textTransform: 'none',
    };

    const salvarButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#1976D2',
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

    const cancelarButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#E91E63',
        color: '#fff',
        width: '117px',
        height: '36px',
        marginLeft: '8px',
        transition: 'background-color 0.3s',
        '&:hover': {
            backgroundColor: '#D81B60',
        },
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleCategoriaChange = (event, newValue) => {
        setFormValues({ ...formValues, codigoCategoria: newValue.codigo });
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/aluguel/relatorio/${formatInputDateWithouTS(formValues.dataInicial)}/${formatInputDateWithouTS(formValues.dataFinal)}/${formValues.codigoCategoria == "" ? 0 : formValues.codigoCategoria}/${formValues.status == "" ? 0 : formValues.status}`);
    };


    const fetchCategoria = async () => {
        try {
            const response = await axios.get(BACKEND_URL + 'categoria', {
                params: {
                    page: page,
                    size: rowsPerPage,
                    filtro: filterName,
                },
            });
            setCategorias(response.data.content);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    useEffect(() => {
        fetchCategoria();
    }, [page, rowsPerPage, filterName]);

    return (
        <>
            <Helmet>
                <title>Relatório de Aluguel</title>
            </Helmet>
            <Container>
                <Container maxWidth="xl" sx={{ marginBottom: "30px", marginTop: '30px' }}>
                    <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
                        Relatório de Aluguel
                    </Typography>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
                        <Link color="inherit" href="/dashboard">
                            Dashboard
                        </Link>
                        <Typography variant="subtitle1" color="text.primary">Relatório de Aluguel</Typography>
                    </Breadcrumbs>
                </Container>

                <Container style={{
                    backgroundColor: '#c4c4c4',
                    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '20px',
                    width: '700px',
                }}>

                    <form onSubmit={handleSubmit}>
                        <Grid display="flex" flexDirection="column" alignItems='center' style={{ paddingRight: '30px', paddingLeft: '30px' }}>
                            <Grid className='grid-datas' item xs={12} sm={12} style={{ display: 'flex', width: '100%' }}>
                                <Grid container>
                                    <Grid item xs={6} style={{ paddingRight: '8px', width: '100%' }}>
                                        <InputMask
                                            mask="99-99-9999"
                                            value={formValues.dataSaida}
                                            onChange={handleFieldChange}
                                        >
                                            {() => (
                                                <TextField
                                                    name="dataInicial"
                                                    label="Data Inicial"
                                                    variant="filled"
                                                    fullWidth
                                                    required
                                                    sx={{
                                                        backgroundColor: '#fff',
                                                        width: '100%',
                                                        borderRadius: '5px',
                                                        marginTop: '8px',
                                                        marginBottom: '8px'
                                                    }}
                                                />
                                            )}
                                        </InputMask>
                                    </Grid>
                                    <Grid item xs={6} style={{ paddingLeft: '8px', width: '100%' }}>
                                        <InputMask
                                            mask="99-99-9999"
                                            value={formValues.dataDevolucao}
                                            onChange={handleFieldChange}
                                        >
                                            {() => (
                                                <TextField
                                                    name="dataFinal"
                                                    label="Data Final"
                                                    variant="filled"
                                                    fullWidth
                                                    required
                                                    sx={{
                                                        backgroundColor: '#fff',
                                                        width: '100%',
                                                        borderRadius: '5px',
                                                        marginTop: '8px',
                                                        marginBottom: '8px'
                                                    }}
                                                />
                                            )}
                                        </InputMask>
                                    </Grid>
                                </Grid>
                            </Grid>


                            <TextField
                                name="codigoCategoria"
                                variant="filled"
                                select
                                label="Categoria"
                                fullWidth
                                style={estiloCampo}
                                sx={{
                                    backgroundColor: '#fff',
                                }}
                                value={formValues.codigoCategoria}
                                onChange={(e) => {
                                    const selectedCategoria = e.target.value;
                                    setFormValues({ ...formValues, codigoCategoria: selectedCategoria });
                                }}
                                SelectProps={{
                                    MenuProps: {
                                        style: {
                                            maxHeight: 300,
                                        },
                                    },
                                }}
                            >
                                {categorias.map((categoria) => (
                                    <MenuItem key={categoria.codigo} value={categoria.codigo}>
                                        {categoria.nome}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                name="status"
                                variant="filled"
                                select
                                label="Status"
                                fullWidth
                                style={estiloCampo}
                                sx={{
                                    backgroundColor: '#fff',
                                }}
                                value={formValues.status}
                                onChange={(e) => {
                                    const selectedStatus = e.target.value;
                                    setFormValues({ ...formValues, status: selectedStatus });
                                }}
                                SelectProps={{
                                    MenuProps: {
                                        style: {
                                            maxHeight: 300,
                                        },
                                    },
                                }}
                            >
                                {statusLista.map((status) => (
                                    <MenuItem key={status.codigo} value={status.codigo}>
                                        {status.nome}
                                    </MenuItem>
                                ))}
                            </TextField>

                        </Grid>
                        <Grid item xs={12} style={{ paddingTop: '8px' }}>
                            <Grid container justifyContent='center'>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={salvarButtonStyle}
                                >
                                    AVANÇAR
                                </Button>
                                <Button
                                    type="reset"
                                    variant="contained"
                                    style={cancelarButtonStyle}
                                    onClick={handleCancel}
                                >
                                    CANCELAR
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Container >
        </>
    );
}