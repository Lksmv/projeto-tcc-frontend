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
import ProductInfoPage from './pages/ProductInfoPage';
import ClientInfoPage from './pages/ClientInfoPage';
import UserPage from './pages/UserPage';
import PaymentPage from './pages/PaymentPage';
import CategoryPage from './pages/CategoryPage';
import ReportPage from './pages/ReportPage';

export default function Router() {
  const { authState } = useAuth();
  const isAuthenticated = authState.isLoggedIn;

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated ? (
        <DashboardLayout>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          index: true,
          element: <DashboardAppPage />
        }
      ]
    },
    {
      path: '/usuario',
      element: isAuthenticated ? (
        <DashboardLayout>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          index: true,
          element: <UserPage />
        }
      ]
    },
    {
      path: '/aluguel',
      element: isAuthenticated ? (
        <DashboardLayout>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          index: true,
          element: <RentalPage />
        },
        {
          path: '/aluguel/cadastro',
          element: <RentalCreatePage />
        }
      ]
    },
    {
      path: '/produto',
      element: isAuthenticated ? (
        <DashboardLayout>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          index: true,
          element: <ProductPage />
        },
        {
          path: '/produto/cadastro',
          element: <ProductCreatePage />
        },
        {
          path: '/produto/detalhes/:productId',
          element: <ProductInfoPage />
        },
      ]
    },
    {
      path: '/cliente',
      element: isAuthenticated ? (
        <DashboardLayout>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          index: true,
          element: <ClientPage />
        },
        {
          path: '/cliente/cadastro',
          element: <ClientCreatePage />
        },
        {
          path: '/cliente/detalhes/:clientId',
          element: <ClientInfoPage />
        },
      ]
    },
    {
      path: '/relatorio',
      element: isAuthenticated ? (
        <DashboardLayout>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          index: true,
          element: <ReportPage />
        }
      ]
    },
    {
      path: '/formaPagamento',
      element: isAuthenticated ? (
        <DashboardLayout>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          index: true,
          element: <PaymentPage />
        }
      ]
    },
    {
      path: '/categoria',
      element: isAuthenticated ? (
        <DashboardLayout>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          index: true,
          element: <CategoryPage />
        }
      ]
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
        }
      ],
    },
    {
      path: '/catalogo',
      element: (
        <CatalogoLayout>
        </CatalogoLayout>),
      children: [
        {
          index: true,
          element: <CatalogPage />
        },
      ]
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
