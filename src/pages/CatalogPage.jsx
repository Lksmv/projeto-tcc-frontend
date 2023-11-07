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
  const { genero } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [filterName, setFilterName] = useState('');
  const [productList, setProductList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  const fetchProductList = async () => {
    try {
      const response = await axios.get(BACKEND_URL + 'produto/com-imagem', {
        params: {
          page: page,
          size: rowsPerPage,
          filtro: filterName,
        },
      });

      // Se for a primeira página, substitua a lista, senão, adicione à lista atual.
      setProductList((prevProductList) => (page === 0 ? response.data.content : [...prevProductList, ...response.data.content]));
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error('Erro ao buscar a lista de produtos:', error);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, [page, rowsPerPage, filterName]);

  const filterOptions = [
    {
      area: 'Gênero',
      options: ['Masculino', 'Feminino'],
    },
    {
      area: 'Tamanho',
      options: ['Pequeno', 'Médio', 'Grande'],
    },
    {
      area: 'Cores',
      options: ['Preto', 'Branco', 'Vermelho'],
    },
  ];

  const [filterState, setFilterState] = useState({});

  const handleShowMore = () => {
    setPage(page + 1);
  };

  const toggleFilterArea = (area) => {
    setFilterState((prevState) => ({
      ...prevState,
      [area]: !prevState[area],
    }));
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
              <div key={index}>
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
                  optionGroup.options.map((option, i) => (
                    <div key={i}>
                      <FormControlLabel
                        control={<Checkbox />}
                        label={option}
                      />
                    </div>
                  ))
                )}
              </div>
            ))}
            <Button
              variant="contained"
              sx={{ color: '#fff', marginTop: '20px' }}
            >
              Aplicar Filtros
            </Button>
          </Grid>
          <Grid item xs={12} md={9} className="product-list-container">
            <ProductList products={productList} />

            {totalItems > productList.length && (
              <div className="show-more-container">
                <Button
                  variant="contained"
                  onClick={handleShowMore}
                  sx={{ color: '#fff' }}
                  className="show-more-button"
                >
                  Mostrar Mais
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
}
