import PropTypes from 'prop-types';
import { Box, Card, Link, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Label from '../../../components/label';
import { fCurrency } from '../../../utils/formatNumber';

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const ProductCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#DDDD', // Define o fundo branco
  border: '1px solid #ddd', // Adiciona uma borda
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Adiciona uma sombra
  borderRadius: '8px', // Arredonda as bordas
  overflow: 'hidden', // Garante que o conteúdo não derrame
  transition: 'transform 0.2s', // Adiciona uma animação de transformação

  '&:hover': {
    transform: 'scale(1.02)', // Escala um pouco ao passar o mouse
  },
}));

ProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product, onProductClick }) {
  const { codigo, imagens, nome, tamanho, cor, valor } = product;

  return (
    <Link onClick={onProductClick} style={{ cursor: 'pointer', textDecoration:'none'}}>
      <ProductCard>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {nome && (
            <Label
              variant="filled"
              sx={{
                zIndex: 9,
                top: 16,
                right: 16,
                position: 'absolute',
                textTransform: 'uppercase',
              }}
            >
              {nome}
            </Label>
          )}
          <StyledProductImg alt={nome} src={imagens[0].caminhoImagem} />
        </Box>

        <Stack sx={{ p: 2 }}>
          <Link color="inherit" underline="hover" style={{ textDecoration: 'none' }}>
            <Typography variant="subtitle2" noWrap>
              {nome}
            </Typography>
          </Link>

          <Typography variant="subtitle1">
            <Typography variant="body1">
              Tamanho: {tamanho}
            </Typography>
            <Typography variant="body1">
              Cor: {cor}
            </Typography>
            <br />
            {fCurrency(valor)}
          </Typography>
        </Stack>
      </ProductCard>
    </Link>
  );
}
