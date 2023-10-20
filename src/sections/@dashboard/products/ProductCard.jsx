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

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { id, imagem, nome, tamanho, cor, preco } = product;

  return (
    <Link href={`/product/${id}`} style={{ textDecoration: 'none' }}>
      <Card>
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
          <StyledProductImg alt={nome} src={imagem} />
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
            {fCurrency(preco)}
          </Typography>
        </Stack>
      </Card>
    </Link>
  );
}
