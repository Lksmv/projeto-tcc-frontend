import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import ClientPage from './pages/ClientPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import ClientCreatePage from './pages/ClientCreatePage';
import RentalPage from './pages/RentalPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard" />, index: true },
        { path: 'dashboard', element: <DashboardAppPage /> },
        { path: 'cliente', element: <ClientPage/>},
        { path: 'login', element: <LoginPage />},
        { path: 'products', element: <ProductsPage /> },
        { path: 'aluguel', element: <RentalPage /> },
      ],
    },
    {
      element:<DashboardLayout />,
      children: [
        { path: 'cliente/cadastro', element: <ClientCreatePage/> }
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: 'gg',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}