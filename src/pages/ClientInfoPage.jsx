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
import { NumericFormat } from 'react-number-format';
import { formatOutputDate, formatInputDate } from '../utils/formatTime';

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
        creditoSoma: "",
        observacoesCredito: "",
        creditos: []
    });

    const [creditoValues, setCreditoValues] = useState({
        idCliente: "",
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


    const convertCurrencyToNumber = (currencyString) => {
        const numericString = currencyString.replace('R$', '').replace('.', '').replace(',', '.');
        const numericValue = parseFloat(numericString);
        return isNaN(numericValue) ? 0 : numericValue;
    };

    const addCredit = async () => {
        try {
            const valorConvertido = convertCurrencyToNumber(creditoValues.valor);
            creditoValues.valor = valorConvertido;
            const response = await axios.post(BACKEND_URL + 'credito', creditoValues);
            const novaListaDeCreditos = [...formValues.creditos, response.data];

            setFormValues((prevFormValues) => ({
                ...prevFormValues,
                creditos: novaListaDeCreditos,
            }));

            setCreditoValues({
                ...creditoValues,
                valor: 0,
                observacoes: '',
            });

            setHasChanges(true);

            calculateCreditAndObservations();
        } catch (error) {
            console.error('Erro ao adicionar crédito:', error);
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
        setCreditoValues({
            ...creditoValues,
            idCliente: formValues.idCliente, // Set the idCliente
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
        const clientIdToEdit = clientId;
        axios.get(BACKEND_URL + `cliente/${clientIdToEdit}`)
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
            formValues.dataNascimento = formatInputDate(formValues.dataNascimento)
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
                                        variant="filled"
                                        fullWidth
                                        style={estiloCampo}
                                        value={formValues.idCliente}
                                        onChange={handleFieldChange}
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
                                            <MenuItem key={estado} value={estado}>
                                                {estado}
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
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            decimalScale={2}
                                        />

                                        <TextField
                                            name="creditos"
                                            label="Créditos"
                                            variant="filled"
                                            multiline
                                            fullWidth
                                            style={estiloCampo}
                                            value={formValues.observacoesCredito}
                                            onChange={handleFieldChange}
                                            sx={{
                                                backgroundColor: '#fff'
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
