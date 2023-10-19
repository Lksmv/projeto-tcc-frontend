import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import CatalogoLayout from './layouts/catalogo';
//
import ClientPage from './pages/ClientPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductPage from './pages/ProductPage';
import DashboardAppPage from './pages/DashboardAppPage';
import ClientCreatePage from './pages/ClientCreatePage';
import RentalPage from './pages/RentalPage';
import HomePage from './pages/HomePage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard" /> },
        { path: 'dashboard', element: <DashboardAppPage />, index: true },
        { path: 'cliente', element: <ClientPage /> },
        { path: 'cliente/cadastro', element: <ClientCreatePage /> },
        { path: 'produto', element: <ProductPage /> },
        { path: 'aluguel', element: <RentalPage /> }
      ],
    },
    {
      path: '/',
      element: <CatalogoLayout />,
      children: [
        {
          index: true,
          element: <HomePage/>,
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { path: '404', element: <Page404 /> },
        { path: '/*', element: <Navigate to="/404" /> },
      ],
    }
  ]);

  return routes;
}