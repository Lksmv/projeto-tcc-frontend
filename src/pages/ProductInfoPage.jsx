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
  Snackbar,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';
import Dropzone, { useDropzone } from 'react-dropzone';
import { NumericFormat } from 'react-number-format';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import { Helmet } from 'react-helmet-async';

import { useNavigate } from 'react-router-dom';

export default function ProductInfoPage() {
  const estiloCampo = {
    margin: '8px',
    borderRadius: '5px 5px 0 0',
    maxWidth: '90%',
    backgroundColor: '#fff',
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

  const navigate = useNavigate()

  const tamanhos = ['Nenhum', 'PP', 'P', 'M', 'G', 'GG'];

  const generos = [
    { char: 'N', nome: 'Nenhum' },
    { char: 'M', nome: 'Masculino' },
    { char: 'F', nome: 'Feminino' },
  ];

  const { codigo } = useParams();

  const [formValues, setFormValues] = useState({
    codigo: parseInt(codigo, 10),
    nome: '',
    codigoCategoria: '',
    marca: '',
    tamanho: '',
    cor: '',
    genero: '',
    valor: '',
    observacoes: '',
    imagens: [],
    trajeVendido: ''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [originalProductDetails, setOriginalProductDetails] = useState({ ...formValues });
  const [categorias, setCategorias] = useState([]);
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteProduct = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(BACKEND_URL + `produto/${formValues.codigo}`);
      navigate(`/produto`);
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles?.length) {
      try {
        const uploadPromises = acceptedFiles.map(async (img) => {
          const formData = new FormData();
          formData.append('file', img);
          formData.append('codigo', codigo);
          const response = await axios.post(BACKEND_URL + 'imagens', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          return response.data;
        });

        const uploadedImages = await Promise.all(uploadPromises);

        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          imagens: [...prevFormValues.imagens, ...uploadedImages],
        }));

        setSuccess(true);
        setSnackbarSeverity('success');
        setSnackbarMessage('Imagem(s) salva(s) com sucesso');
      } catch (error) {
        console.error('Erro ao fazer o upload das imagens:', error);
        setSuccess(false);
        setSnackbarSeverity('error');
        setSnackbarMessage('Erro ao fazer o upload das imagens');
      }
    }
  }, [formValues, codigo]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeImage = async (id, index) => {
    try {
      await axios.delete(BACKEND_URL + `imagens/${id}`);

      const updatedFiles = [...formValues.imagens];
      updatedFiles.splice(index, 1);
      setFormValues({ ...formValues, imagens: updatedFiles });
    } catch (error) {
      console.error('Erro ao excluir a imagem:', error);
    }
  };

  const [hasChanges, setHasChanges] = useState(false);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setHasChanges(true);
  };
  const handleFieldChangeCheck = (e) => {
    const { name, checked } = e.target;
    const value = checked ? 'T' : 'F';
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

  useEffect(() => {
    const codigoProduct = codigo;
    axios
      .get(BACKEND_URL + `produto/${codigoProduct}`)
      .then((response) => {
        const productDetails = response.data;

        setFormValues({
          ...productDetails,
          imagens: productDetails.imagens || [],
          codigoCategoria: productDetails.categoria.codigo,
        });
        setOriginalProductDetails({
          ...productDetails,
          imagens: productDetails.imagens || [],
          codigoCategoria: productDetails.categoria.codigo,
        });
      })
      .catch((error) => {
        setError(error);
      });

    const fetchCategorias = async () => {
      try {
        const response = await axios.get(BACKEND_URL + 'categoria', {
          params: {
            page: 0,
            size: 100,
            filtro: '',
          },
        });
        setCategorias(response.data.content);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchCategorias();
  }, [codigo]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const codigoAsInteger = parseInt(formValues.codigo, 10);

    const requestData = {
      ...formValues,
      codigo: codigoAsInteger,
    };

    try {
      const response = await axios.put(BACKEND_URL + `produto/${codigoAsInteger}`, requestData);
      console.log('Produto atualizado com sucesso:', response.data);
      setSuccess(true);
      setOpenSnackbar(true);
      setHasChanges(false);
    } catch (error) {
      console.error('Erro ao atualizar o produto:', error);
      setSuccess(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Informações de produto</title>
      </Helmet>
      <Container>
        <Container
          maxWidth="lg"
          style={{ paddingLeft: '20px', paddingRight: '20px' }}
        >
          <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
            Informações de produto
          </Typography>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
          >
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Link color="inherit" href="/produto">
              Produto
            </Link>
            <Typography variant="subtitle1" color="text.primary">
              Informações
            </Typography>
          </Breadcrumbs>
        </Container>

        <Container
          style={{
            backgroundColor: '#c4c4c4',
            transition:
              'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            overflow: 'hidden',
            position: 'relative',
            boxShadow:
              'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
          }}
        >
          <form onSubmit={handleUpdate}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} display="flex" flexDirection="column" alignItems="left">
                <TextField
                  name="codigo"
                  label="Código"
                  variant="filled"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.codigo}
                  InputProps={{
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
                />
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
                  name="marca"
                  label="Marca"
                  variant="filled"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.marca}
                  onChange={handleFieldChange}
                />
                <TextField
                  name="tamanho"
                  variant="filled"
                  select
                  label="Tamanho"
                  fullWidth
                  style={estiloCampo}
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
                <TextField
                  name="cor"
                  label="Cor"
                  variant="filled"
                  fullWidth
                  style={estiloCampo}
                  value={formValues.cor}
                  onChange={handleFieldChange}
                />
                <TextField
                  name="genero"
                  variant="filled"
                  select
                  label="Gênero"
                  fullWidth
                  style={estiloCampo}
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
                    <MenuItem key={genero.char} value={genero.char}>
                      {genero.nome}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="trajeVendido"
                      color="primary"
                      checked={formValues.trajeVendido == 'T' ? true : false}
                      onChange={handleFieldChangeCheck}
                    />
                  }
                  label="Traje Vendido"
                  sx={{ marginLeft: 0 }}
                />
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
                />
                {/* Upload Imagem */}
                <div style={{ cursor: 'pointer', backgroundColor: '#fff', borderRadius: '10px', margin: '8px', width: '90%' }}>
                  <input {...getInputProps()} />
                  <label {...getRootProps()} style={{ cursor: 'pointer', width: '100%' }}>
                    <IconButton color="#8E8E8E" textalign="center" fontSize="13px" component="span" >
                      <ImageIcon />
                      <p style={{ paddingLeft: '8px', textAlign: 'center', fontSize: '15px' }}>Arraste e solte os arquivos ou clique para selecionar...</p>
                    </IconButton>
                  </label>
                </div>
                {/* Preview Imagem */}
                <div style={{ maxHeight: '200px', overflow: 'auto', margin: '8px', width: '90%' }}>
                  <ImageList cols={3} rowHeight={'200px'}>
                    {formValues.imagens.map((imagem, index) => (
                      <ImageListItem key={imagem.idImagem} sx={{ width: '100%', height: 'auto' }}>
                        <img
                          src={imagem.caminhoImagem}
                          alt={`Imagem ${imagem.idImagem}`}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                        <IconButton
                          onClick={() => removeImage(imagem.idImagem, index)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: '#8E8E8E',
                            borderRadius: '50%',
                            fontSize: '15px',
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
        </Container>
      </Container >
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
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={snackbarSeverity}
          onClose={handleSnackbarClose}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

