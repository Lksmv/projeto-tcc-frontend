import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Dialog, DialogTitle, DialogContent, Button, Typography, Divider } from '@mui/material';
import ShopProductCard from './ProductCard';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ImageIcon from '@mui/icons-material/Image';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function ProductList({ products, ...other }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <Grid container spacing={4} {...other}>
      {products.map((product) => (
        <Grid key={product.codigo} item xs={12} sm={3} md={3} lg={3}>
          <ShopProductCard
            product={product}
            onProductClick={() => handleProductClick(product)}
          />
        </Grid>
      ))}

      {/* Dialog para exibir informações detalhadas do produto */}
      <Dialog open={!!selectedProduct} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedProduct && (
          <>
            <DialogTitle>
              {selectedProduct.nome}
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <img
                    src={selectedProduct.imagens[selectedImageIndex].caminhoImagem}
                    alt={selectedProduct.nome}
                    style={{ width: '100%' }}
                  />
                  {selectedProduct.imagens.length > 1 && (
                    <div style={{ marginTop: '8px', textAlign: 'center' }}>
                      {selectedProduct.imagens.map((image, index) => (
                        <ImageIcon
                          key={index}
                          style={{
                            cursor: 'pointer',
                            marginRight: '8px',
                            fontSize: '24px',
                            color: index === selectedImageIndex ? 'primary' : 'action',
                          }}
                          onClick={() => handleImageClick(index)}
                        />
                      ))}
                    </div>
                  )}
                </Grid>
                <Grid item xs={12} md={6} sx={{ backgroundColor: '#f5f5f5', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="h6" align="center" gutterBottom>
                    Informações do Produto
                  </Typography>
                  <Divider />
                  <Typography variant="body1">
                    <strong>Tamanho:</strong> {selectedProduct.tamanho}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Cor:</strong> {selectedProduct.cor}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Valor:</strong> {selectedProduct.valor}
                  </Typography>
                  <Button
                    startIcon={<WhatsAppIcon />}
                    href={`https://api.whatsapp.com/send?phone=5547999631565&text=Ol%C3%A1%2C%20Roberta%20Trajes!%20Tenho%20interesse%20no%20Traje%20C%C3%B3digo%3A%20[${selectedProduct.codigo}]
                    ${encodeURIComponent(selectedProduct.nome)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="secondary"
                    variant="contained"
                    style={{ marginTop: '16px', color: '#fff' }}
                  >
                    Entrar em contato pelo WhatsApp
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Grid>
  );
}
