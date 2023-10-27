import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, OutlinedInput, InputAdornment, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink } from 'react-router-dom';

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 90,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 700,
  height: 50,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[900], 0.32)} !important`,
  },
}));

ListToolBar.propTypes = {
  filtro: PropTypes.string,
  onfiltro: PropTypes.func,
  placeHolder: PropTypes.string,
  buttonText: PropTypes.string,
  toPage: PropTypes.string,
};

export default function ListToolBar({ filtro, onfiltro, placeHolder, buttonText, toPage }) {
  return (
    <StyledRoot>
      <StyledSearch
        value={filtro}
        onChange={onfiltro}
        placeholder={placeHolder}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />

      {buttonText && toPage && (
        <Box sx={{ display: 'flex' }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#336DC3',
              color: '#fff',
              maxWidth: '190px',
            }}
            startIcon={<AddIcon />}
            to={toPage}
            component={RouterLink}
          >
            {buttonText}
          </Button>
        </Box>
      )}
    </StyledRoot>
  );
}
