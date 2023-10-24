import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
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
  ImageListItem
} from '@mui/material';
import axios from 'axios';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BACKEND_URL } from '../utils/backEndUrl';
import Dropzone from 'react-dropzone';
import { NumericFormat } from 'react-number-format';

export default function ProductCreatePage() {
  const estiloCampo = {
    margin: '8px',
    borderRadius: '10px',
    maxWidth: '50%'
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

  const [formValues, setFormValues] = useState({
    codigo: "",
    nome: "",
    categoria: "",
    marca: "",
    tamanho: "",
    cor: "",
    genero: "",
    imagens: [], // Armazenará as imagens após o upload
    valor: "",
    observacoes: "",
  });

  const handleImageUpload = (acceptedFiles) => {
    // Aqui você pode processar os arquivos de imagem, fazer o upload para o servidor, etc.
    // Em seguida, atualize o estado do formulário com as informações das imagens.
    setFormValues({ ...formValues, imagens: acceptedFiles });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const codigoAsInteger = parseInt(formValues.codigo, 10);

    const requestData = {
      ...formValues,
      codigo: codigoAsInteger,
    };

    try {
      const response = await axios.post(BACKEND_URL + 'cliente', requestData);
      console.log('Cliente salvo com sucesso:', response.data);
      // Redirecione o usuário para a página de clientes (ou qualquer outra página desejada)
    } catch (error) {
      console.error('Erro ao salvar o cliente:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Cadastro de produto</title>
      </Helmet>
      <Container>
        <Container maxWidth="lg" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1 }}>
            Cadastro de produto
          </Typography>
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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" flexDirection="column" alignItems='left'>
              <TextField
                name="codigo"
                label="Código"
                variant="outlined"
                fullWidth
                style={estiloCampo}
                value={formValues.codigo}
                onChange={handleFieldChange}
                sx={{
                  backgroundColor: '#aaa'
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
              />
              <TextField
                name="categoria"
                variant="outlined"
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
                variant="outlined"
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
                variant="outlined"
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
                variant="outlined"
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
                variant="outlined"
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
            <Grid item xs={12} sm={6} display="flex" flexDirection="column" sx={{ alignItems: 'left' }}>
              {/* Upload Imagem */}
              <Dropzone onDrop={(acceptedFiles) => handleImageUpload(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} style={{ cursor: 'pointer', backgroundColor: '#fff', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                    <input {...getInputProps()} />
                    <p>Arraste e solte as imagens ou clique para fazer upload</p>
                  </div>
                )}
              </Dropzone>
              {/* Exibir prévia das imagens após o upload */}
              {formValues.imagens.length > 0 && (
                <ImageList cols={3} rowHeight={160}>
                  {formValues.imagens.map((imagem, index) => (
                    <ImageListItem key={index}>
                      <img src={URL.createObjectURL(imagem)} alt={`Imagem ${index}`} />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
              <NumericFormat
                name="valor"
                customInput={TextField}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                label="Valor"
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale={true}
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
          </Grid>
          <div className="botoes-cadastro-produto" style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', marginBottom: '16px' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                width: '90px',
                height: '36px',
                marginRight: '8px',
                fontFamily: 'Rubik, sans-serif',
                backgroundColor: '#336DC3',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                boxSizing: 'border-box',
              }}
            >
              SALVAR
            </Button>
            <Button
              type="reset"
              variant="contained"
              color="error"
              style={{ width: '117px', height: '36px', marginLeft: '8px', fontFamily: 'Rubik, sans-serif', backgroundColor: '#B21447', color: '#fff', border: 'none', borderRadius: '5px', boxSizing: 'border-box' }}
            >
              CANCELAR
            </Button>
          </div>
        </form>
      </Container >
    </>
  );
}
