import { Outlet } from 'react-router-dom';
import './index.css';
import Header from './pages/Header/Header';
import ErrorPage from './pages/Error/ErrorPage';
import Home from './pages/Home/Home';
import { loader as HomeLoader } from './pages/Home/Home';
import { loader as userProfileLoader } from './pages/UserProfile/UserProfile';
import Blog, { loader as blogLoader } from './pages/Blog/Blog';
import UserProfile from './pages/UserProfile/UserProfile';

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
          {
            path: 'users/:userId',
            element: <UserProfile />,
            loader: userProfileLoader,
            children: [
              {
                path: 'about',
              },
              {
                path: 'blogs',
              },
            ],
          },
          {
            path: 'blogs/:blogId',
            element: <Blog />,
            loader: blogLoader,
          },
        ],
      },
    ],
  },
];

export default routesConfig;
