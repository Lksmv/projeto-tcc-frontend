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
import RentalInfoPage from './pages/RentalInfoPage';
import ProductCreatePage from './pages/ProductCreatePage';
import ProductInfoPage from './pages/ProductInfoPage';
import ClientInfoPage from './pages/ClientInfoPage';
import UserPage from './pages/UserPage';
import PaymentPage from './pages/PaymentPage';
import CategoryPage from './pages/CategoryPage';
import EmployeePage from './pages/EmployeePage';
import ReportClientPage from './pages/ReportClientPage';
import ReportProductPage from './pages/ReportProductPage';
import ReportRentalPage from './pages/ReportRentalPage';
import ReportInfoClientPage from './pages/ReportInfoClientPage';
import ReportInfoProductPage from './pages/ReportInfoProductPage';
import ReportInfoRentalPage from './pages/ReportInfoRentalPage';

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
      path: '/funcionario',
      element: isAuthenticated ? (
        <DashboardLayout>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          index: true,
          element: <EmployeePage />
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
        },
        {
          path: '/aluguel/detalhes/:codigo',
          element: <RentalInfoPage />
        },
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
          path: '/produto/detalhes/:codigo',
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
          path: '/cliente/detalhes/:codigo',
          element: <ClientInfoPage />
        },
      ]
    },
    {
      path: '/filtro/clientes',
      element: isAuthenticated ? (
        <DashboardLayout>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          index: true,
          element: <ReportClientPage />
        },
        {
          path: '/filtro/clientes/relatorio',
          element: <ReportInfoClientPage />
        },
      ]
    },
    {
      path: '/filtro/produtos',
      element: isAuthenticated ? (
        <DashboardLayout>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          index: true,
          element: <ReportProductPage />
        },
        {
          path: '/filtro/produtos/relatorio',
          element: <ReportInfoProductPage />
        },
      ]
    },
    {
      path: '/filtro/aluguel',
      element: isAuthenticated ? (
        <DashboardLayout>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" />
      ),
      children: [
        {
          index: true,
          element: <ReportRentalPage />
        },
        {
          path: '/filtro/aluguel/relatorio',
          element: <ReportInfoRentalPage />
        },
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
        <CatalogoLayout catalogo={false}>
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
      path: '/catalogo/:genero',
      element: (
        <CatalogoLayout catalogo={true} >
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
