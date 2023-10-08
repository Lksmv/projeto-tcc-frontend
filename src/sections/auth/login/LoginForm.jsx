import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    navigate('/dashboard', { replace: true });
  };


  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack sx={{  my: 2, display: 'inline-block', justifyContent: 'flex-start'}}>
          <Checkbox />
          Lembrar de mim
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" sx={{
        backgroundColor: '#57B846',
        color: '#fff',
        padding: '15px 30px',
        borderRadius: '25px',
        width: '290px',
        height: '50px'
      }} onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
