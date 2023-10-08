import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';

const StyledContent = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  minWidth: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0)
}));

export default function Page404() {
  return (
    <>
      <title> 404 Page Not Found </title>

      <Container>
        <StyledContent variant="h6" sx={{ textAlign: 'center', zIndex: 1 ,color: '#FFF'}}>
          <Typography variant="h3" paragraph sx={{ zIndex: 1}} >
            Sorry, page not found!
          </Typography>

          <Typography variant="subtitle1" sx={{ zIndex: 1}}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your
            spelling.
          </Typography>

          <Box sx={{ height: 50, mx: 'auto', my: { xs: 5, sm: 10 } }}>
          </Box>

          <Button
          to="/"
          size="large"
          variant="contained"
          component={RouterLink}
          sx={{ backgroundColor: '#8f0642', color: '#FFF' }} 
          >
            <Typography variant="button">
              Return Home
            </Typography>
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}
