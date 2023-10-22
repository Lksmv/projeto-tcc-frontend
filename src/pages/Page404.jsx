import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Grid } from '@mui/material';

const StyledContent = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
  color: '#FFF',
  textAlign: 'center',
}));

const Background404 = styled('div')(({ theme }) => ({
  position: 'absolute',
  fontSize: '10rem',
  fontWeight: 'bold',
  color: '#C61C4A',
  opacity: 0.2,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)', // Centraliza no meio da tela
}));

const Page404 = () => {
  return (
    <>
      <title>Página 404 - Não Encontrada</title>

      <Container>
        <StyledContent>
          <Grid container direction="column" alignItems="center" spacing={4}>
            <Background404>404</Background404>
            <Grid >
              <Typography variant="h3" >
                WE ARE SORRY, PAGE NOT FOUND!
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="body1" sx={{ marginBottom: 5, marginTop: 5, width: '100%' }}>
                Desculpe, não conseguimos encontrar a página que você está procurando. Verifique se a URL está correta e tente novamente.
              </Typography>
            </Grid>
            <Grid sx={{ width: '100%', alignItems: 'center' }}>
              <Button
                to="/"
                size="large"
                variant="contained"
                component={RouterLink}
                sx={{ backgroundColor: '#C61C4A', color: '#FFF' }}
              >
                Voltar para a Página Inicial
              </Button>
            </Grid>
          </Grid>
        </StyledContent>
      </Container >
    </>
  );
};

export default Page404;
