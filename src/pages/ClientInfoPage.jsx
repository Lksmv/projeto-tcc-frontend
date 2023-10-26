import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Breadcrumbs,
    Link,
    Snackbar,
    MenuItem,
    IconButton,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InputMask from 'react-input-mask';
import { BACKEND_URL } from '../utils/backEndUrl';

export default function ClientEditPage() {
    const { clientId } = useParams();


    const [formValues, setFormValues] = useState({
        idCliente: clientId,
        nome: "",
        cpf: "",
        dataNascimento: "",
        telefone: "",
        redeSocial: "",
        pessoasAutorizadas: "",
        observacoes: "",
        cep: "",
        uf: "",
        endereco: "",
        bairro: "",
        creditos: []
    });

    const calculateCreditAndObservations = () => {
        const creditos = formValues.creditos;
        const totalCredito = creditos.reduce((total, credito) => total + parseFloat(credito.valor), 0);
        const todasObservacoes = creditos.map(credito => credito.observacoes).join('\n');
        setFormValues({
            ...formValues,
            credito: totalCredito,
            observacoesCredito: todasObservacoes,
        });
    };

    useEffect(() => {
        calculateCreditAndObservations();
    }, [formValues.creditos]);


    const handleAddCredit = async () => {
        const novoCredito = {
            idCliente: "",
            data: "",
            valor: "",
            observacoes: ""
        };

        try {
            const response = await axios.post(BACKEND_URL + 'credito', novoCredito);
            const novaListaDeCreditos = [...formValues.creditos, novoCredito];

            setFormValues({
                ...formValues,
                creditos: novaListaDeCreditos,
                credito: '',
            });
        } catch (error) {
            console.error('Erro ao adicionar crédito:', error);
        }
    };
    const estiloCampo = {
        margin: '8px',
        borderRadius: '10px',
        width: '90%',
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


    const estados = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
        'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [originalClientDetails, setOriginalClientDetails] = useState({ ...formValues });
    const [isAddCreditDialogOpen, setAddCreditDialogOpen] = useState(false);

    const handleOpenAddCreditDialog = () => {
        setAddCreditDialogOpen(true);
    };

    const handleCloseAddCreditDialog = () => {
        setAddCreditDialogOpen(false);
    };

    useEffect(() => {
        const clientIdToEdit = clientId;
        axios.get(BACKEND_URL + `cliente/${clientIdToEdit}`)
            .then((response) => {
                const clientDetails = response.data;
                setFormValues(clientDetails);
                setOriginalClientDetails(clientDetails); // Salvar as informações originais
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [clientId]);

    const [hasChanges, setHasChanges] = useState(false);

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        setHasChanges(true);
    };

    const handleCancel = () => {
        setFormValues({ ...originalClientDetails });
        setHasChanges(false);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(BACKEND_URL + `cliente/${formValues.idCliente}`, formValues);
            setSuccess(true);
            setOpenSnackbar(true);
            setHasChanges(false);
        } catch (error) {
            setError(error);
        }
    };

    return (
        <>
            <Helmet>
                <title>Edição de cliente</title>
            </Helmet>
            <Container>
                <Container maxWidth="lg" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                    <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
                        Edição de cliente
                    </Typography>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
                        <Link color="inherit" href="/dashboard">
                            Dashboard
                        </Link>
                        <Link color="inherit" href="/cliente">
                            Cliente
                        </Link>
                        <Typography variant="subtitle1" color="text.primary">Editar Cliente</Typography>
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
                    marginBottom: '20px'
                }}>

                    {loading ? (
                        <Typography variant="body2">Carregando detalhes do cliente...</Typography>
                    ) : error ? (
                        <Typography variant="body2" color="error">Erro ao carregar os detalhes do cliente.</Typography>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} display="flex" flexDirection="column" alignItems='center'>
                                    <TextField
                                        name="idCliente"
                                        label="Código"
                                        variant="outlined"
                                        fullWidth
                                        style={estiloCampo}
                                        value={formValues.idCliente}
                                        onChange={handleFieldChange}
                                        disabled={true}
                                        sx={{
                                            backgroundColor: '#e9e9e9'
                                        }}
                                        InputLabelProps={{
                                            style: { color: '#9d9d9d' }
                                        }}

                                    />
                                    <TextField
                                        name="nome"
                                        label="Nome"
                                        variant="outlined"
                                        fullWidth
                                        style={estiloCampo}
                                        value={formValues.nome}
                                        onChange={handleFieldChange}
                                        sx={{
                                            backgroundColor: '#fff'
                                        }}
                                        required
                                    />
                                    <InputMask
                                        mask="999.999.999-99"
                                        value={formValues.cpf}
                                        onChange={handleFieldChange}
                                    >
                                        {() => (
                                            <TextField
                                                name="cpf"
                                                label="CPF"
                                                variant="outlined"
                                                fullWidth
                                                style={estiloCampo}
                                                sx={{
                                                    backgroundColor: '#fff'
                                                }}
                                                required
                                            />
                                        )}
                                    </InputMask>
                                    <InputMask
                                        mask="99-99-9999"
                                        value={formValues.dataNascimento}
                                        onChange={handleFieldChange}
                                    >
                                        {() => (
                                            <TextField
                                                name="dataNascimento"
                                                label="Data de Nascimento"
                                                variant="outlined"
                                                fullWidth
                                                style={estiloCampo}
                                                sx={{
                                                    backgroundColor: '#fff'
                                                }}
                                                required
                                            />
                                        )}
                                    </InputMask>
                                    <InputMask
                                        mask="(99)99999-9999"
                                        value={formValues.telefone}
                                        onChange={handleFieldChange}
                                        maskChar="_"
                                    >
                                        {() => (
                                            <TextField
                                                name="telefone"
                                                label="Telefone"
                                                variant="outlined"
                                                fullWidth
                                                style={estiloCampo}
                                                sx={{
                                                    backgroundColor: '#fff'
                                                }}
                                                required
                                            />
                                        )}
                                    </InputMask>
                                    <TextField
                                        name="redeSocial"
                                        label="Rede Social"
                                        variant="outlined"
                                        fullWidth
                                        style={estiloCampo}
                                        value={formValues.redeSocial}
                                        onChange={handleFieldChange}
                                        sx={{
                                            backgroundColor: '#fff'
                                        }}
                                    />
                                    <TextField
                                        name="pessoasAutorizadas"
                                        label="Pessoas Autorizadas"
                                        variant="outlined"
                                        fullWidth
                                        style={estiloCampo}
                                        value={formValues.pessoasAutorizadas}
                                        onChange={handleFieldChange}
                                        sx={{
                                            backgroundColor: '#fff'
                                        }}
                                    />
                                    <TextField
                                        name="observacoes"
                                        label="Observações"
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        style={estiloCampo}
                                        value={formValues.observacoes}
                                        onChange={handleFieldChange}
                                        sx={{
                                            backgroundColor: '#fff'
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} display="flex" flexDirection="column" sx={{ alignItems: 'center' }}>
                                    <InputMask
                                        mask="99999-999"
                                        value={formValues.cep}
                                        onChange={handleFieldChange}
                                    >
                                        {() => (
                                            <TextField
                                                name="cep"
                                                label="CEP"
                                                variant="outlined"
                                                fullWidth
                                                style={estiloCampo}
                                                sx={{
                                                    backgroundColor: '#fff'
                                                }}
                                            />
                                        )}
                                    </InputMask>
                                    <TextField
                                        name="uf"
                                        variant="outlined"
                                        select
                                        label="Estado"
                                        fullWidth
                                        required
                                        style={estiloCampo}
                                        sx={{
                                            backgroundColor: '#fff',
                                        }}
                                        value={formValues.uf}
                                        onChange={handleFieldChange}
                                        SelectProps={{
                                            MenuProps: {
                                                style: {
                                                    maxHeight: 300,
                                                },
                                            }
                                        }}
                                    >
                                        {estados.map((estado) => (
                                            <MenuItem key={estado} value={estado}>
                                                {estado}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        name="endereco"
                                        label="Endereço"
                                        style={estiloCampo}
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#fff'
                                        }}
                                        value={formValues.endereco}
                                        onChange={handleFieldChange}
                                    />
                                    <TextField
                                        name="bairro"
                                        label="Bairro"
                                        variant="outlined"
                                        style={estiloCampo}
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#fff'
                                        }}
                                        value={formValues.bairro}
                                        onChange={handleFieldChange}
                                    />

                                    <Grid container style={{
                                        backgroundColor: '#d9d9d9',
                                        width: '90%',
                                        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        marginBottom: '20px',
                                        marginTop: '20px'
                                    }}>
                                        <Typography variant="subtitle1" color="text.primary" sx={{ mb: 1, mt: 1 }}>
                                            Créditos
                                        </Typography>
                                        <TextField
                                            name="credito"
                                            label="Crédito"
                                            variant="outlined"
                                            fullWidth
                                            style={estiloCampo}
                                            value={formValues.credito}
                                            onChange={handleFieldChange}
                                            sx={{
                                                backgroundColor: '#fff',
                                            }}
                                            type="number"
                                            inputProps={{
                                                min: "0",
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={handleOpenAddCreditDialog}>
                                                            <AddIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            disabled
                                        />
                                        <TextField
                                            name="observacoesCredito"
                                            label="Observações"
                                            variant="outlined"
                                            multiline
                                            rows={4}
                                            fullWidth
                                            style={estiloCampo}
                                            value={formValues.observacoesCredito}
                                            onChange={handleFieldChange}
                                            sx={{
                                                backgroundColor: '#fff',
                                            }}
                                        />
                                    </Grid>
                                    <Dialog open={isAddCreditDialogOpen} onClose={handleCloseAddCreditDialog}>
                                        <DialogTitle>Adicionar Crédito</DialogTitle>
                                        <DialogContent>
                                            <TextField
                                                label="Crédito"
                                                variant="outlined"
                                                fullWidth
                                                type="number"
                                                inputProps={{ min: "0" }}
                                                style={{ marginBottom: '15px', marginTop: '7px' }}
                                            />
                                            <TextField
                                                label="Observações de Crédito"
                                                variant="outlined"
                                                multiline
                                                rows={4}
                                                fullWidth
                                            />
                                            <Button onClick={handleCloseAddCreditDialog} style={{
                                                marginTop: '10px',
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
                                            }}> Adicionar</Button>
                                        </DialogContent>
                                    </Dialog>

                                </Grid>
                            </Grid>
                            <Grid className="botoes-cadastro-cliente" item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'end' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={salvarButtonStyle}
                                    disabled={!hasChanges}
                                >
                                    SALVAR
                                </Button>

                                <Button
                                    type="reset"
                                    variant="contained"
                                    style={cancelarButtonStyle}
                                    onClick={handleCancel}
                                    disabled={!hasChanges}
                                >
                                    CANCELAR
                                </Button>
                            </Grid>
                        </form>
                    )}
                </Container>
            </Container>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity={success ? 'success' : 'error'}
                    onClose={handleSnackbarClose}
                >
                    {success ? 'Cliente atualizado com sucesso' : 'Erro ao atualizar o cliente'}
                </MuiAlert>
            </Snackbar>
        </>
    );
}
