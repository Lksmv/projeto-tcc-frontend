import { Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from './components/context/authProvider';

import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import CatalogoLayout from './layouts/catalogo';


import ClientPage from './pages/ClientPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductPage from './pages/ProductPage';
import DashboardAppPage from './pages/DashboardAppPage';
import ClientCreatePage from './pages/ClientCreatePage';
import RentalPage from './pages/RentalPage';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import RentalCreatePage from './pages/RentalCreatePage';
import ProductCreatePage from './pages/ProductCreatePage';
import ClientInfoPage from './pages/ClientInfoPage';
import UserPage from './pages/UserPage';

export default function Router() {
  const { authState } = useAuth();
  const isAuthenticated = authState.isLoggedIn;

  const routes = useRoutes([
    {
      element: isAuthenticated ? (
        <DashboardLayout>
          <DashboardAppPage />
        </DashboardLayout>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          path: '/dashboard',
          element: isAuthenticated ? <DashboardAppPage /> : <Navigate to="/login" />,
          index: true,
        },
        {
          path: '/cliente',
          element: isAuthenticated ? <ClientPage /> : <Navigate to="/login" />,
        },
        {
          path: '/cliente/cadastro',
          element: isAuthenticated ? <ClientCreatePage /> : <Navigate to="/login" />,
        }, {
          path: '/cliente/detalhes/:clientId',
          element: isAuthenticated ? <ClientInfoPage /> : <Navigate to="/login" />,
        },
        {
          path: '/produto',
          element: isAuthenticated ? <ProductPage /> : <Navigate to="/login" />,
        },
        {
          path: '/produto/cadastro',
          element: isAuthenticated ? <ProductCreatePage /> : <Navigate to="/login" />,
        },
        {
          path: '/aluguel',
          element: isAuthenticated ? <RentalPage /> : <Navigate to="/login" />,
        },
        {
          path: '/aluguel/cadastro',
          element: isAuthenticated ? <RentalCreatePage /> : <Navigate to="/login" />,
        },
        {
          path: '/usuario',
          element: isAuthenticated ? <UserPage /> : <Navigate to="/login" />,
        },
      ],
    },
    {
      path: '/',
      element: (
        <CatalogoLayout>
        </CatalogoLayout>
      ),
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: '/catalogo',
          element: <CatalogPage />,
        },
      ],
    },
    {
      path: '/login',
      element: isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />,
    },
    {
      element: (
        <SimpleLayout>
        </SimpleLayout>),
      children: [
        {
          path: '/*',
          index: true,
          element: <Page404 />
        },
      ]
    },
  ]);

  return routes;
}
