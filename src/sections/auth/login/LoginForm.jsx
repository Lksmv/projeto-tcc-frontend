import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { BACKEND_URL } from '../../../utils/backEndUrl';
import axios from 'axios';
import { AuthProvider, useAuth } from '../../../components/context/authProvider';


export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginError, setLoginError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginData, setLoginData] = useState({ login: '', senha: '' });

  const handleChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    const storedLogin = localStorage.getItem('login');
    const storedSenha = localStorage.getItem('senha');

    if (storedLogin && storedSenha) {
      setLoginData({ login: storedLogin, senha: storedSenha });
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(BACKEND_URL + 'auth/login', loginData);

      if (response.status === 200) {
        login(response.data);

        if (rememberMe) {
          localStorage.setItem('login', loginData.login);
          localStorage.setItem('senha', loginData.senha);
        } else {
          localStorage.removeItem('login');
          localStorage.removeItem('senha');
        }

        navigate('/dashboard', { replace: true });
      } else {
        setLoginError(true);
        console.error('Falha no login');
      }
    } catch (error) {
      setLoginError(true);
      console.error('Erro ao fazer a solicitação de login:', error);
    }
  };



  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          name="login"
          label="Login"
          value={loginData.login}
          onChange={handleChange}
          error={loginError}
          helperText={loginError ? 'Credenciais inválidas' : ''}
          fullWidth
        />
        <TextField
          name="senha"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          value={loginData.senha}
          onChange={handleChange}
          error={loginError}
          helperText={loginError ? 'Credenciais inválidas' : ''}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" alignItems="center">
          <Checkbox
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          Lembrar de mim
        </Stack>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#57B846',
            color: '#fff',
            padding: '15px 30px',
            borderRadius: '25px',
          }}
        >
          Login
        </LoadingButton>
      </Stack>
    </form>
  );
}
