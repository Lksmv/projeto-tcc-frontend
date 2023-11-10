import { Helmet } from 'react-helmet-async';
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  MenuItem,
  ImageList,
  ImageListItem,
  IconButton,
  Snackbar,
  Autocomplete
} from '@mui/material';
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';
import Dropzone, { useDropzone } from 'react-dropzone';
import { NumericFormat } from 'react-number-format';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';

export default function ProductCreatePage() {
  const [categorias, setCategorias] = useState([]);
  const [corSuggestions, setCorSuggestions] = useState([]);
  const navigate = useNavigate()

  const estiloCampo = {
    margin: '8px',
    borderRadius: '5px 5px 0 0',
    maxWidth: '90%',
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

  const tamanhos = [
    'Nenhum', 'PP', 'P', 'M', 'G', 'GG',
  ];

  const generos = [
    'Nenhum', 'Feminino', 'Masculino'
  ];

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(BACKEND_URL + 'categoria', {
          params: {
            page: 0,
            size: 100,
            filtro: "",
          },
        });
        setCategorias(response.data.content);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategorias();
  }, []);

  const [formValues, setFormValues] = useState({
    codigo: 0,
    nome: '',
    codigoCategoria: '',
    marca: '',
    tamanho: '',
    cor: '',
    genero: '',
    valor: 0,
    observacoes: '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [imagens, setImagens] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      setImagens((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((imagem) =>
          Object.assign(imagem, { preview: URL.createObjectURL(imagem) })
        ),
      ]);
    }
  }, [imagens]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeImage = (index) => {
    const updatedFiles = [...imagens];
    updatedFiles.splice(index, 1);
    setImagens(updatedFiles);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target || e.currentTarget;

    if (name) {
      setFormValues({ ...formValues, [name]: value });
    }
  };
  const handleCodigoFieldChange = (event) => {
    const inputValue = event.target.value;

    const numericValue = inputValue.replace(/\D/g, '');

    setFormValues({
      ...formValues,
      codigo: numericValue,
    });
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleCorChange = (event, newValue) => {
    setFormValues({ ...formValues, cor: newValue });
  };

  const handleCorInputChange = (event, newInputValue) => {
    setFormValues({ ...formValues, cor: newInputValue });
  };

  useEffect(() => {
    axios.get(BACKEND_URL + 'cor')
      .then((response) => {
        const cores = response.data.map((cor) => cor.nome);
        setCorSuggestions(cores);
      })
      .catch((error) => {
        console.error('Erro ao buscar sugestões de cores:', error);
      });
  }, [formValues.cor]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const codigoAsInteger = parseInt(formValues.codigo, 10);
    const valorConvertido = formValues.valor;
    const generoChar = formValues.genero.charAt(0);

    const requestData = {
      ...formValues,
      codigo: codigoAsInteger,
      valor: valorConvertido,
      genero: generoChar,
    };

    try {
      const response = await axios.post(BACKEND_URL + 'produto', requestData);
      console.log('Produto salvo com sucesso:', response.data);
      const codigo = response.data.codigo;

      if (imagens.length > 0) {
        const uploadPromises = imagens.map(async (img) => {
          const formData = new FormData();
          formData.append('file', img);
          formData.append('codigo', codigo);

          return axios.post(BACKEND_URL + 'imagens', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        });
        await Promise.all(uploadPromises);
      }
      showSnackbar('Produto criado com sucesso', 'success');
      setTimeout(() => {
        navigate(`/produto/detalhes/${codigo}`);
      }, 1000);
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
        showSnackbar(`Erro ao salvar o Aluguel: ${error.message}`, 'error');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Cadastro de produto</title>
      </Helmet>
      <Container>
        <Container maxWidth="100%" style={{ alignContent: 'left', marginTop: '30px' }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Link color="inherit" href="/produto">
              Produto
            </Link>
            <Typography variant="subtitle1" color="text.primary">Novo Produto</Typography>
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
        }}>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} display="flex" flexDirection="column" alignItems='center'>
                <TextField
                  name="codigo"
                  label="Código"
                  variant="filled"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.codigo}
                  onChange={handleCodigoFieldChange}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                  helperText="Deixe 0 para preencher automaticamente ou insira um valor personalizado."
                />
                <TextField
                  name="nome"
                  label="Nome"
                  variant="filled"
                  required
                  fullWidth
                  style={estiloCampo}
                  value={formValues.nome}
                  onChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                />
                <TextField
                  name="codigoCategoria"
                  variant="filled"
                  required
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
                  name="marca"
                  label="Marca"
                  variant="filled"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.marca}
                  onChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                />
                <TextField
                  name="tamanho"
                  variant="filled"
                  select
                  required
                  label="Tamanho"
                  fullWidth
                  style={estiloCampo}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                  value={formValues.tamanho}
                  onChange={handleFieldChange}
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {tamanhos.map((tamanho) => (
                    <MenuItem key={tamanho} value={tamanho}>
                      {tamanho}
                    </MenuItem>
                  ))}
                </TextField>
                <Autocomplete
                  options={corSuggestions}
                  value={formValues.cor}
                  onChange={handleCorChange}
                  onInputChange={handleCorInputChange}
                  isOptionEqualToValue={(option, value) => option.nome === value.nome}
                  style={estiloCampo}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cor"
                      variant="filled"
                      required
                      sx={{
                        borderRadius: '5px 5px 0 0',
                        backgroundColor: '#fff',
                      }}
                    />
                  )}
                />
                <TextField
                  name="genero"
                  variant="filled"
                  select
                  required
                  label="Gênero"
                  fullWidth
                  style={estiloCampo}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                  value={formValues.genero}
                  onChange={handleFieldChange}
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                >
                  {generos.map((genero) => (
                    <MenuItem key={genero} value={genero}>
                      {genero}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} display="flex" flexDirection="column" sx={{ alignItems: 'center' }}>
                <NumericFormat
                  name="valor"
                  variant="filled"
                  customInput={TextField}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  label="Valor"
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  fullWidth
                  style={estiloCampo}
                  value={formValues.valor}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                  onValueChange={(values) => {
                    handleFieldChange({ target: { name: 'valor', value: values.floatValue } });
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
                    backgroundColor: '#fff',
                  }}
                />
                {/* Upload Imagem */}
                <div style={{ cursor: 'pointer', backgroundColor: '#fff', borderRadius: '10px', margin: '8px', width: '90%' }}>
                  <input {...getInputProps()} />
                  <label {...getRootProps()} style={{ cursor: 'pointer', width: '100%' }}>
                    <IconButton color="#8E8E8E" textalign="center" fontSize="13px" component="span">
                      <ImageIcon />
                      <p style={{ paddingLeft: '8px', textAlign: 'center', fontSize: '15px' }}>Arraste e solte os arquivos ou clique para selecionar...</p>
                    </IconButton>
                  </label>
                </div>
                {/* Preview Imagem */}
                <div style={{ maxHeight: '200px', overflow: 'auto', margin: '8px', width: '90%' }}>
                  <ImageList cols={3} rowHeight={'200px'}>
                    {imagens.map((imagem, index) => (

                      <ImageListItem key={index} sx={{ width: '100%', height: 'auto' }}>
                        <img
                          src={imagem.preview}
                          alt={`Imagem ${index}`}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                        <IconButton
                          onClick={() => removeImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: '#8E8E8E',
                            borderRadius: '50%',
                            width: '15px',
                            height: '15px',
                            '&:hover': {
                              backgroundColor: '#B21447',
                            },
                          }}
                        >
                          <CloseIcon sx={{ color: '#fff', fontSize: '15px' }} />
                        </IconButton>
                      </ImageListItem>


                    ))}
                  </ImageList>
                </div>
              </Grid>
            </Grid>
            <div className="botoes-cadastro-produto" xs={12} sm={6} style={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                type="submit"
                variant="contained"
                style={salvarButtonStyle}
              >
                SALVAR
              </Button>
              <Button
                type="reset"
                variant="contained"
                style={cancelarButtonStyle}
              >
                CANCELAR
              </Button>
            </div>
          </form>
        </Container>
      </Container>
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
