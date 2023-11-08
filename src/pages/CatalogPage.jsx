import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, Breadcrumbs, Link, FormControlLabel, Checkbox, Button, IconButton } from '@mui/material';
import axios from 'axios';
import { BACKEND_URL } from '../utils/backEndUrl';
import imagemMostragem from '../assets/ft.png';
import ProductList from '../sections/@dashboard/products/ProductList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useParams } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import '../utils/CatalogPage.css';

export default function CatalogPage() {
  const { param } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [filterName, setFilterName] = useState('');
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCategoriaFilter, setSelectedCategoriaFilter] = useState(param == null ? null : param == 'masculino' ? null : param == 'feminino' ? null : param);
  const [selectedGenderFilter, setSelectedGenderFilter] = useState(param == null ? null : param == 'masculino' ? param : param == 'feminino' ? param : null);
  const [filterState, setFilterState] = useState(selectedCategoriaFilter != null ? { Categoria: true } : selectedGenderFilter != null ? { Gênero: true } : {});
  const [selectedSizeFilter, setSelectedSizeFilter] = useState(null);
  const [selectedColorFilter, setSelectedColorFilter] = useState(null);

  const navigate = useNavigate();

  const fetchProductList = async () => {
    const params = {
      page: page,
      size: rowsPerPage,
      categoria: selectedCategoriaFilter,
      cor: selectedColorFilter,
      genero: selectedGenderFilter.toLowerCase() == 'masculino' ? 'M' : selectedGenderFilter.toLowerCase() == 'feminino' ? 'F' : null,
      tamanho: selectedSizeFilter,
    };

    try {
      const response = await axios.get(BACKEND_URL + 'produto/com-imagem-filtro', { params });
      setProductList((prevProductList) => (page === 0 ? response.data.content : [...prevProductList, ...response.data.content]));
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar a lista de produtos:', error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'cor');
      setColorList(response.data);
    } catch (error) {
      console.error('Erro ao buscar sugestões de cores:', error);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'categoria', {
        params: {
          page: 0,
          size: 100,
          filtro: '',
        },
      });
      setCategoryList(response.data.content);
    } catch (error) {
      console.error('Erro ao buscar a lista de categorias:', error);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  useEffect(() => {
    fetchProductList();
  }, [page, rowsPerPage, filterName, selectedCategoriaFilter, selectedColorFilter, selectedGenderFilter, selectedSizeFilter]);

  const filterOptions = [
    {
      area: 'Gênero',
      options: [{ nome: 'Masculino' }, { nome: 'Feminino' }],
    },
    {
      area: 'Tamanho',
      options: [{ nome: 'PP' }, { nome: 'P' }, { nome: 'M' }, { nome: 'G' }, { nome: 'GG' }],
    },
    {
      area: 'Cores',
      options: colorList,
    },
    {
      area: 'Categoria',
      options: categoryList,
    },

  ];

  const handleCategoriaChange = (categoria) => {
    if (selectedCategoriaFilter === categoria) {
      setSelectedCategoriaFilter(null);
    } else {
      setSelectedCategoriaFilter(categoria);
    }
  };


  const handleSizeChange = (size) => {
    if (selectedSizeFilter === size) {
      setSelectedSizeFilter(null);
    } else {
      setSelectedSizeFilter(size);
    }
  };

  const handleColorChange = (color) => {
    if (selectedColorFilter === color) {
      setSelectedColorFilter(null);
    } else {
      setSelectedColorFilter(color);
    }
  };

  const handleGenderChange = (gender) => {
    if (selectedGenderFilter === gender) {
      setSelectedGenderFilter('');
    } else {
      setSelectedGenderFilter(gender);
    }
  };


  const toggleFilterArea = (area) => {
    setFilterState((prevState) => ({
      ...prevState,
      [area]: !prevState[area],
    }));
    console.log(area)
    console.log(filterState)
  };

  const handleShowMore = () => {
    setPage(page + 1);
  };

  return (
    <Grid className="catalog-page">
      <Grid className="image-container">
        <img src={imagemMostragem} alt="Imagem de Mostragem" className="featured-image" />
      </Grid>
      <Container sx={{ marginTop: "50px", marginBottom: "100px" }}>
        <Grid item xs={12} paddingBottom='26px'>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link color="inherit" href="/">
              Home
            </Link>
            <Link color="inherit" href="/catalogo">
              Catálogo
            </Link>
            <Typography variant="subtitle1" color="text.primary">Vestidos</Typography>
          </Breadcrumbs>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3} sx={{ padding: '25px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Filtros:</Typography>
            {filterOptions.map((optionGroup, index) => (
              <div key={optionGroup.area}>
                <Grid container alignItems="center">
                  <Grid item xs={10}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{optionGroup.area}:</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      onClick={() => toggleFilterArea(optionGroup.area)}
                      sx={{ p: 0, ml: 1 }}
                    >
                      {filterState[optionGroup.area] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
                {filterState[optionGroup.area] && (
                  optionGroup.options.map((option) => (
                    <div key={option.nome}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={() => {
                              if (optionGroup.area === 'Gênero') {
                                handleGenderChange(option.nome);
                              } else if (optionGroup.area === 'Tamanho') {
                                handleSizeChange(option.nome);
                              } else if (optionGroup.area === 'Cores') {
                                handleColorChange(option.nome);
                              } else if (optionGroup.area === 'Categoria') {
                                handleCategoriaChange(option.codigo);
                              }
                            }}
                            checked={optionGroup.area === 'Gênero' && option.nome.toLowerCase() == selectedGenderFilter.toLowerCase()
                              || optionGroup.area === 'Tamanho' && option.nome.toLowerCase() == selectedSizeFilter.toLowerCase()
                              || optionGroup.area === 'Cores' && option.nome.toLowerCase() == selectedColorFilter.toLowerCase()
                              || optionGroup.area === 'Categoria' && option.codigo == selectedCategoriaFilter}
                          />
                        }
                        label={option.nome}
                      />
                    </div>
                  ))
                )}
              </div>
            ))}
          </Grid>
          <Grid item xs={12} md={9} className="product-list-container">
            <ProductList products={productList} />

            {totalItems > productList.length && (
              <div className="show-more-container">
                <Button
                  variant="contained"
                  sx={{ color: '#fff', marginTop: '20px' }}
                  onClick={handleShowMore}
                >
                  Carregar Mais
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </Container >
    </Grid >
  );
}
