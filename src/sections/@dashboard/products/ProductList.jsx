import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function ProductList({ products, ...other }) {
  return (
    <Grid container spacing={4} {...other}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={3} md={3} lg={3}>
          <ShopProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
