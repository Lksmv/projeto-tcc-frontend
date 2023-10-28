import { Helmet } from 'react-helmet-async';
import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  Snackbar
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
  const estiloCampo = {
    margin: '8px',
    borderRadius: '5px 5px 0 0',
    maxWidth: '90%'
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

  const categorias = [
    'Nenhum', 'Terno', 'Vestido', 'Bolsa', 'Acessórios', 'Sapato'
  ];

  const tamanhos = [
    'Nenhum', 'PP', 'P', 'M', 'G', 'GG'
  ];

  const generos = [
    'Nenhum', 'Feminino', 'Masculino'
  ];

  const { productId } = useParams();

  const [formValues, setFormValues] = useState({
    codigo: productId,
    nome: "",
    categoria: "",
    marca: "",
    tamanho: "",
    cor: "",
    genero: "",
    valor: "",
    observacoes: "",
    imagens: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [originalProductDetails, setOriginalProductDetails] = useState({ ...formValues });

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length) {
      setFormValues({
        ...formValues, imagens: (previousFiles => [
          ...previousFiles,
          ...acceptedFiles.map(imagem =>
            Object.assign(imagem, { preview: URL.createObjectURL(imagem) })
          )
        ])
      });
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeImage = (index) => {
    const updatedFiles = [...formValues.imagens];
    updatedFiles.splice(index, 1);
    setFormValues({ ...formValues, imagens: updatedFiles });
  };

  const [hasChanges, setHasChanges] = useState(false);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setHasChanges(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleCancel = () => {
    setFormValues({ ...originalProductDetails });
    setHasChanges(false);
  };

  // useEffect(() => {
  //   const productIdToEdit = productId;
  //   axios.get(BACKEND_URL + `produto/${productIdToEdit}`)
  //     .then((response) => {
  //       const productDetails = response.data;
  //       setFormValues({
  //         ...productDetails,
  //         imagens: productDetails.ImageList || [], //ver a lista certa de imagens
  //       });
  //       setOriginalProductDetails({
  //         ...productDetails,
  //         imagens: productDetails.ImageList || [], //ver a lista certa de imagens
  //       });
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       setError(error);
  //       setLoading(false);
  //     });
  // }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const codigoAsInteger = parseInt(formValues.codigo, 10);

    const requestData = {
      ...formValues,
      codigo: codigoAsInteger,
    };

    try {
      const response = await axios.post(BACKEND_URL + 'produto', requestData);
      console.log('Produto salvo com sucesso:', response.data);
      // Redirecione o usuário para a página de clientes (ou qualquer outra página desejada)
      setSuccess(true);
      setOpenSnackbar(true);
      setHasChanges(false);
    } catch (error) {
      console.error('Erro ao salvar o cliente:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Informações de produto</title>
      </Helmet>
      <Container>
        <Container maxWidth="lg" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
            Informações de produto
          </Typography>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Link color="inherit" href="/produto">
              Produto
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

          {/* {loading ? (
            <Typography variant="body2">Carregando cadastro do produtos...</Typography>
          ) : error ? (
            <Typography variant="body2" color="error">Erro ao carregar o cadastro de produtos.</Typography>
          ) : ( */}
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
                  sx={{
                    backgroundColor: '#fff'
                  }}
                />
                <TextField
                  name="categoria"
                  variant="filled"
                  select
                  label="Categoria"
                  fullWidth
                  style={estiloCampo}
                  sx={{
                    backgroundColor: '#fff',
                  }}
                  value={formValues.categoria}
                  onChange={handleFieldChange}
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: 300,
                      },
                    }
                  }}
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria} value={categoria}>
                      {categoria}
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
                    backgroundColor: '#fff'
                  }}
                />
                <TextField
                  name="tamanho"
                  variant="filled"
                  select
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
                    }
                  }}
                >
                  {tamanhos.map((tamanho) => (
                    <MenuItem key={tamanho} value={tamanho}>
                      {tamanho}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="cor"
                  label="Cor"
                  variant="filled"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.cor}
                  onChange={handleFieldChange}
                  sx={{
                    backgroundColor: '#fff'
                  }}
                />
                <TextField
                  name="genero"
                  variant="filled"
                  select
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
                    }
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
                  variant='filled'
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
                  onValueChange={handleFieldChange}
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
                {/* Upload Imagem */}
                <div {...getRootProps()} style={{ cursor: 'pointer', backgroundColor: '#fff', borderRadius: '10px', margin: '8px', maxWidth: '90%' }}>
                  <input {...getInputProps()} placeholder='Selecione' />
                  <IconButton color="#8E8E8E" textAlign='center' fontSize='13px'>
                    <ImageIcon />
                    <p style={{ paddingLeft: '8px', textAlign: 'center', fontSize: '15px' }} >Arraste e solte os arquivos ou clique para selecionar...</p>
                  </IconButton>
                </div>
                {/* Preview Imagem */}
                <div style={{ maxHeight: '200px', overflow: 'auto', margin: '8px' }}>
                  <ImageList cols={3} rowHeight={160}>
                    {formValues.imagens.map((imagem, index) => (
                      <ImageListItem key={index} sx={{ width: '100%', height: 'auto' }}>
                        <img
                          src={URL.createObjectURL(imagem)}
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
                            fontSize: '2px',
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
            <div className="botoes-cadastro-produto" item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'end' }}>
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
                onClick={handleCancel}
                style={cancelarButtonStyle}
              >
                CANCELAR
              </Button>
            </div>
          </form>
          {/* )} */}
        </Container>
      </Container >
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
          {success ? 'Produto adicionado com sucesso' : 'Erro ao adicionar produto'}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
