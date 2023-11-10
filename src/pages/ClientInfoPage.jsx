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
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InputMask from 'react-input-mask';
import { BACKEND_URL } from '../utils/backEndUrl';
import { NumericFormat } from 'react-number-format';
import { formatOutputDate, formatInputDate } from '../utils/formatTime';
import { useNavigate } from 'react-router-dom';

export default function ClienInfoPage() {
    const { codigo } = useParams();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddCreditDialogOpen, setAddCreditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const navigate = useNavigate()

    const [formValues, setFormValues] = useState({
        codigo: parseInt(codigo, 10),
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
        creditoSoma: "",
        observacoesCredito: "",
        creditos: []
    });
    const [originalClientDetails, setOriginalClientDetails] = useState({ ...formValues });

    const [creditoValues, setCreditoValues] = useState({
        codigoCliente: "",
        data: "",
        valor: 0,
        observacoes: ""
    });

    const calculateCreditAndObservations = () => {
        const creditos = formValues.creditos;

        if (creditos && creditos.length > 0) {
            const observacoesCredito = creditos.reduce((observacoes, credito) => {
                observacoes += `R$ ${credito.valor}  ${credito.observacoes} \n`;
                return observacoes;
            }, []);
            const totalCredito = creditos.reduce((total, credito) => {
                return total + parseFloat(credito.valor);
            }, 0);

            setFormValues((prevFormValues) => ({
                ...prevFormValues,
                observacoesCredito: observacoesCredito,
                creditoSoma: totalCredito,
            }));
        } else {
            setFormValues((prevFormValues) => ({
                ...prevFormValues,
                creditoSoma: 0,
            }));
        }
    };

    useEffect(() => {
        calculateCreditAndObservations();
    }, [formValues.creditos]);

    const handleDeleteProduct = () => {
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(BACKEND_URL + `cliente/${formValues.codigo}`);

            navigate(`/cliente`);
        } catch (error) {
            console.error('Erro ao excluir o produto:', error);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
    };

    const convertCurrencyToNumber = (currencyString) => {
        const numericString = currencyString.replace('R$', '').replace('.', '').replace(',', '.');
        const numericValue = parseFloat(numericString);
        return isNaN(numericValue) ? 0 : numericValue;
    };

    const addCredit = async () => {
        try {
            if (creditoValues.valor > 0) {
                const valorConvertido = convertCurrencyToNumber(creditoValues.valor);
                const newCreditoValues = {
                    ...creditoValues,
                    valor: valorConvertido,
                };
                const response = await axios.post(BACKEND_URL + 'credito', newCreditoValues);
                const novaListaDeCreditos = [...formValues.creditos, response.data];


                setFormValues((prevFormValues) => ({
                    ...prevFormValues,
                    creditos: novaListaDeCreditos,
                }));
                setCreditoValues({
                    codigoCliente: formValues.codigo,
                    data: new Date().toISOString(),
                    valor: 0,
                    observacoes: '',
                });
                setHasChanges(true);
                calculateCreditAndObservations();
            } else {
                showSnackbar('Crédito precisa ser maior que 0.', 'error');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    showSnackbar(`${errorMessage}`, 'error');
                } else {
                    let errorMessage = error.response.data.errors[0];
                    const colonIndex = errorMessage.indexOf(':');
                    if (colonIndex !== -1) {
                        errorMessage = errorMessage.substring(colonIndex + 1).trim();
                    }
                    showSnackbar(`${errorMessage}`, 'error');
                }
            } else if (error.request) {
                showSnackbar(`Erro de requisição: ${error.request}`, 'error');
            } else {
                showSnackbar(`Erro ao adicionar crédito: ${error.message}`, 'error');
            }
        }
    };




    const estiloCampo = {
        margin: '8px',
        borderRadius: '5px 5px 0 0',
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
        width: '117px',
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
        transition: 'background-color 0.3s',
        '&:hover': {
            backgroundColor: '#D81B60',
        },
    };

    const deleteButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#F44336',
        color: '#fff',
        width: '117px',
        height: '36px',
        marginLeft: '8px',
        transition: 'background-color 0.3s',
        '&:hover': {
            backgroundColor: '#D32F2F',
        },
    };


    const estados = [
        { sigla: 'AC', nome: 'Acre' },
        { sigla: 'AL', nome: 'Alagoas' },
        { sigla: 'AP', nome: 'Amapá' },
        { sigla: 'AM', nome: 'Amazonas' },
        { sigla: 'BA', nome: 'Bahia' },
        { sigla: 'CE', nome: 'Ceará' },
        { sigla: 'DF', nome: 'Distrito Federal' },
        { sigla: 'ES', nome: 'Espírito Santo' },
        { sigla: 'GO', nome: 'Goiás' },
        { sigla: 'MA', nome: 'Maranhão' },
        { sigla: 'MT', nome: 'Mato Grosso' },
        { sigla: 'MS', nome: 'Mato Grosso do Sul' },
        { sigla: 'MG', nome: 'Minas Gerais' },
        { sigla: 'PA', nome: 'Pará' },
        { sigla: 'PB', nome: 'Paraíba' },
        { sigla: 'PR', nome: 'Paraná' },
        { sigla: 'PE', nome: 'Pernambuco' },
        { sigla: 'PI', nome: 'Piauí' },
        { sigla: 'RJ', nome: 'Rio de Janeiro' },
        { sigla: 'RN', nome: 'Rio Grande do Norte' },
        { sigla: 'RS', nome: 'Rio Grande do Sul' },
        { sigla: 'RO', nome: 'Rondônia' },
        { sigla: 'RR', nome: 'Roraima' },
        { sigla: 'SC', nome: 'Santa Catarina' },
        { sigla: 'SP', nome: 'São Paulo' },
        { sigla: 'SE', nome: 'Sergipe' },
        { sigla: 'TO', nome: 'Tocantins' }
    ];


    const handleOpenAddCreditDialog = () => {
        setAddCreditDialogOpen(true);
        setCreditoValues({
            ...creditoValues,
            codigoCliente: formValues.codigo,
            data: new Date().toISOString(),
        });
    };

    const handleCreditFieldChange = (e) => {
        const { name, value } = e.target;
        setCreditoValues({ ...creditoValues, [name]: value });
    };

    const handleCloseAddCreditDialog = () => {
        setAddCreditDialogOpen(false);
    };

    useEffect(() => {
        const codigoClientToEdit = codigo;
        axios.get(BACKEND_URL + `cliente/${codigoClientToEdit}`)
            .then((response) => {
                const clientDetails = response.data;
                setFormValues({
                    ...clientDetails,
                    creditos: clientDetails.listaCreditos || [],
                });
                setOriginalClientDetails({
                    ...clientDetails,
                    creditos: clientDetails.listaCreditos || [],
                });
                setLoading(false);

                calculateCreditAndObservations();
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [codigo]);

    const [hasChanges, setHasChanges] = useState(false);

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        setHasChanges(true);
    };

    const handleCodigoFieldChange = (e) => {
        const inputValue = e.target.value;
    
        const numericValue = inputValue.replace(/\D/g, '');
        const { name, value } = e.target;
        
        setUserValues({ ...userValues, [name]: numericValue });
      };

    const handleCancel = () => {
        setFormValues({ ...originalClientDetails });
        navigate(`/cliente`);
        setHasChanges(false);
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formatedData = formatInputDate(formValues.dataNascimento);

        const requestData = {
            ...formValues,
            codigo: formValues.codigo,
            dataNascimento: formatedData,
        };

        try {
            const response = await axios.put(BACKEND_URL + `cliente/${formValues.codigo}`, requestData);
            setFormValues({
                ...formValues,
                dataNascimento: formatOutputDate(formValues.dataNascimento),
            });
            showSnackbar('Cliente atualizado com sucesso', 'success');
            setHasChanges(false);
        } catch (error) {
            if (error.response) {
                if (error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    showSnackbar(`${errorMessage}`, 'error');
                } else {
                    let errorMessage = error.response.data.errors[0];
                    const colonIndex = errorMessage.indexOf(':');
                    if (colonIndex !== -1) {
                        errorMessage = errorMessage.substring(colonIndex + 1).trim();
                    }
                    showSnackbar(`${errorMessage}`, 'error');
                }
            } else if (error.request) {
                showSnackbar(`Erro de requisição: ${error.request}`, 'error');
            } else {
                showSnackbar(`Erro ao salvar o Cliente: ${error.message}`, 'error');
            }
        }
    };


    return (
        <>
            <Helmet>
                <title>Informações de cliente</title>
            </Helmet>
            <Container>
                <Container maxWidth="100%" style={{ alignContent: 'left', marginTop: '30px' }}>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
                        <Link color="inherit" href="/dashboard">
                            Dashboard
                        </Link>
                        <Link color="inherit" href="/cliente">
                            Cliente
                        </Link>
                        <Typography variant="subtitle1" color="text.primary">Informações</Typography>
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
                                        name="codigo"
                                        label="Código"
                                        variant="filled"
                                        numericValue
                                        fullWidth
                                        style={estiloCampo}
                                        value={formValues.codigo}
                                        onChange={handleCodigoFieldChange}
                                        sx={{
                                            backgroundColor: '#fff'
                                        }}
                                        inputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        name="nome"
                                        label="Nome"
                                        variant="filled"
                                        fullWidth
                                        style={estiloCampo}
                                        value={formValues.nome}
                                        onChange={handleFieldChange}
                                        required
                                        sx={{
                                            backgroundColor: '#fff'
                                        }}
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
                                                variant="filled"
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
                                        value={formatOutputDate(formValues.dataNascimento)}
                                        onChange={handleFieldChange}
                                    >
                                        {() => (
                                            <TextField
                                                name="dataNascimento"
                                                label="Data de Nascimento"
                                                variant="filled"
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
                                                variant="filled"
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
                                        variant="filled"
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
                                        variant="filled"
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
                                        variant="filled"
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
                                                variant="filled"
                                                fullWidth
                                                style={estiloCampo}
                                                sx={{
                                                    backgroundColor: '#fff'
                                                }}
                                            />
                                        )}
                                    </InputMask>
                                    <TextField
                                        name="cidade"
                                        label="Cidade"
                                        style={estiloCampo}
                                        variant="filled"
                                        fullWidth
                                        sx={{
                                            backgroundColor: '#fff'
                                        }}
                                        value={formValues.cidade}
                                        onChange={handleFieldChange}
                                    />
                                    <TextField
                                        name="uf"
                                        variant="filled"
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
                                            <MenuItem key={estado.sigla} value={estado.sigla}>
                                                {estado.sigla + ' - ' + estado.nome}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        name="endereco"
                                        label="Endereço"
                                        style={estiloCampo}
                                        variant="filled"
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
                                        variant="filled"
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
                                        <Typography variant="subtitle1" color="text.primary" sx={{ mb: 1 }}>
                                            Créditos
                                        </Typography>
                                        <TextField
                                            name="creditoSoma"
                                            label="Crédito"
                                            variant="filled"
                                            fullWidth
                                            style={estiloCampo}
                                            value={`R$ ${formValues.creditoSoma}`} // Update this line
                                            onChange={handleFieldChange}
                                            sx={{
                                                backgroundColor: '#fff',
                                            }}
                                            inputProps={{
                                                min: "0",
                                                readOnly: true, // Campo somente leitura
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
                                        />

                                        <TextField
                                            name="creditos"
                                            variant="filled"
                                            multiline
                                            fullWidth
                                            style={{ ...estiloCampo, paddingTop: 0 }}
                                            value={formValues.observacoesCredito}
                                            onChange={handleFieldChange}
                                            sx={{
                                                backgroundColor: '#fff',
                                                pt: 0,
                                            }}
                                            inputProps={{
                                                readOnly: true, // Campo somente leitura
                                            }}
                                        />
                                    </Grid>
                                    <Dialog open={isAddCreditDialogOpen} onClose={handleCloseAddCreditDialog}>
                                        <DialogTitle>Adicionar Crédito</DialogTitle>
                                        <DialogContent>
                                            <NumericFormat
                                                label="Crédito"
                                                variant="filled"
                                                fullWidth
                                                inputProps={{ min: "0" }}
                                                style={{ marginBottom: '15px', marginTop: '7px' }}
                                                value={creditoValues.valor}
                                                name="valor"
                                                customInput={TextField}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                prefix="R$ "
                                                required={true}
                                                allowNegative={false}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                onChange={handleCreditFieldChange}
                                                sx={{
                                                    backgroundColor: '#fff'
                                                }}
                                            />
                                            <TextField
                                                label="Observações de Crédito"
                                                variant="filled"
                                                multiline
                                                rows={4}
                                                fullWidth
                                                value={creditoValues.observacoes}
                                                name="observacoes"
                                                onChange={handleCreditFieldChange}
                                            />
                                            <Button onClick={() => {
                                                addCredit();
                                                handleCloseAddCreditDialog();
                                            }} style={{
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
                            <div xs={12} sm={6} style={{ display: 'flex', justifyContent: 'end', paddingRight: '24px' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={salvarButtonStyle}
                                >
                                    ATUALIZAR
                                </Button>
                                <Button
                                    type="reset"
                                    variant="contained"
                                    onClick={handleCancel}
                                    style={cancelarButtonStyle}
                                >
                                    CANCELAR
                                </Button>
                                <Button
                                    variant="contained"
                                    style={deleteButtonStyle}
                                    onClick={handleDeleteProduct}
                                >
                                    EXCLUIR
                                </Button>
                            </div>
                        </form>
                    )}
                </Container>
            </Container>
            <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirmação de Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza de que deseja excluir este produto?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </>
    );
}
