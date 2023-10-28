import HomeIcon from '@mui/icons-material/Home';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { Typography } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export const navConfig = [
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Home
      </Typography>
    ),
    path: '/dashboard',
    icon: <HomeIcon sx={{ color: '#fff' }} />,
  },
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Cliente
      </Typography>
    ),
    path: '/cliente',
    icon: <PeopleAltIcon sx={{ color: '#fff' }} />,
  },
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Produto
      </Typography>
    ),
    path: '/produto',
    icon: <CheckroomIcon sx={{ color: '#fff' }} />,
  },
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Aluguel
      </Typography>
    ),
    path: '/aluguel',
    icon: <CurrencyExchangeIcon sx={{ color: '#fff' }} />,
  },
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Relatório
      </Typography>
    ),
    path: '/relatorio',
    icon: <SummarizeIcon sx={{ color: '#fff' }} />,
  }
];

export const navConfigAdmin = [

  ...navConfig, 
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Forma de Pagamento
      </Typography>
    ),
    path: '/formaPagamento',
    icon: <PaymentIcon sx={{ color: '#fff' }} />,
  },
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Categoria
      </Typography>
    ),
    path: '/categoria',
    icon: <LocalOfferIcon sx={{ color: '#fff' }} />,
  }

];
