import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { Typography, Divider } from '@mui/material';
import Logo from '../assets/logo_roberta.png';
import { LoginForm } from '../sections/auth/login';

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: `linear-gradient(180deg, #C61C4A 0%, #861C58 98%)`,
}));

const LogoImage = styled('img')(({ theme }) => ({
  width: '316px',
  height: '291px',
  borderRadius: '50px',
  marginRight: '32px',
  marginLeft: '30px',
}));

const LoginContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left'
}));

const StyledContent = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  border: '1px solid #DBDBDB',
  borderRadius: '50px',
  margin: '50px auto',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  maxWidth: '960px',
  width: '100%',
  maxHeight: '681px',
  height: '100%',
}));

const ContentLeft = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const ContentRight = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <StyledRoot>
        <StyledContent>
          <ContentLeft>
            <LogoImage src={Logo} />
          </ContentLeft>
          <ContentRight>
            <LoginContainer>
              <Typography variant="h3" style={{textAlign:'center'}} paragraph>
                Login
              </Typography>
              <Divider sx={{ marginBottom:'2vh'}} />      
              <LoginForm />
            </LoginContainer>
          </ContentRight>
        </StyledContent>
      </StyledRoot>
    </>
  );
}


