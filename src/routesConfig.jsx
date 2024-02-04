import { Outlet } from 'react-router-dom';
import './index.css';
import Header from './pages/Header/Header';
import ErrorPage from './pages/Error/ErrorPage';
import Home from './pages/Home/Home';
import { loader as HomeLoader } from './pages/Home/Home';

const routesConfig = [
  {
    path: '/',
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Home />,
            loader: HomeLoader,
          },
        ],
      },
    ],
  },
];

export default routesConfig;
