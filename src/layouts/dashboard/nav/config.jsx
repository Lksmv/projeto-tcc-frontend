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
        Dasboard
      </Typography>
    ),
    path: '/dashboard',
    icon: <HomeIcon sx={{ color: '#fff' }} />,
  },
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Clientes
      </Typography>
    ),
    path: '/cliente',
    icon: <PeopleAltIcon sx={{ color: '#fff' }} />,
  },
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Produtos
      </Typography>
    ),
    path: '/produto',
    icon: <CheckroomIcon sx={{ color: '#fff' }} />,
  },
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Aluguéis
      </Typography>
    ),
    path: '/aluguel',
    icon: <CurrencyExchangeIcon sx={{ color: '#fff' }} />,
  },
  {
    title: 'Relatórios',
    icon: <SummarizeIcon />,
    subitems: [
      {
        title: 'Clientes',
        path: '/cliente/relatorio',
      },
      {
        title: 'Produtos',
        path: '/produto/relatorio',
      },
      {
        title: 'Aluguel',
        path: '/aluguel/relatorio',
      },
    ],
  },
];

export const navConfigAdmin = [

  ...navConfig,
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Formas de Pagamento
      </Typography>
    ),
    path: '/formaPagamento',
    icon: <PaymentIcon sx={{ color: '#fff' }} />,
  },
  {
    title: (
      <Typography variant="body1" sx={{ color: '#FFF' }}>
        Categorias
      </Typography>
    ),
    path: '/categoria',
    icon: <LocalOfferIcon sx={{ color: '#fff' }} />,
  }
];
