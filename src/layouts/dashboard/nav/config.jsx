import HomeIcon from '@mui/icons-material/Home';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SummarizeIcon from '@mui/icons-material/Summarize';
import {Typography} from '@mui/material';

const navConfig = [
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Home
      </Typography>
    ),
    path: '/dashboard/app',
    icon: <HomeIcon sx={{color:'#fff'}}/>,
  },
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Cliente
      </Typography>
    ),
    path: '/dashboard/cliente',
    icon: <PeopleAltIcon sx={{color:'#fff'}}/>,
  },
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Produto
      </Typography>
    ),
    path: '/dashboard/produto',
    icon: <CheckroomIcon sx={{color:'#fff'}}/>,
  },
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Movimentação
      </Typography>
    ),
    path: '/dashboard/aluguel',
    icon: <CurrencyExchangeIcon sx={{color:'#fff'}}/>,
  },
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Relatório
      </Typography>
    ),
    path: '/dashboard/relatorio',
    icon: <SummarizeIcon sx={{color:'#fff'}}/>,
  }
];

export default navConfig;
