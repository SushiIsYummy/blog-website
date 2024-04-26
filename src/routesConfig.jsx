import './index.css';
import ErrorPage from './pages/Error/ErrorPage';
import UserProfile, {
  loader as userProfileLoader,
} from './pages/UserProfile/UserProfile';
import Home, { loader as HomeLoader } from './pages/Home/Home';
import ViewPost, {
  loader as postLoader,
  previewLoader,
} from './pages/ViewPost/ViewPost';
import Blog, { loader as blogLoader } from './pages/Blog/Blog';
import EditPost, { loader as editPostLoader } from './pages/EditPost/EditPost';
import SignIn from './pages/SignIn/SignIn';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Layout from './Layout';
import { ScrollRestoration } from 'react-router-dom';

const routesConfig = [
  {
    path: '/',
    element: (
      <>
        <Layout />
        <ScrollRestoration
          getKey={(location, matches) => {
            return location.key;
          }}
        />
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
                element: <UserProfile />,
              },
              {
                path: 'blogs',
                element: <UserProfile />,
              },
            ],
          },
          {
            path: 'blogs/:blogId',
            element: <Blog />,
            loader: blogLoader,
          },
          {
            path: 'posts/:postId',
            element: <ViewPost />,
            loader: postLoader,
          },
          {
            path: 'sign-in',
            element: <SignIn />,
          },
          {
            path: 'register',
            element: <Register />,
          },
          {
            path: 'dashboard',
            children: [
              {
                index: true,
                element: <Dashboard key='loading_data' />,
              },
              {
                path: 'blogs/:blogId/:sidebarOption',
                element: <Dashboard key='loaded_data' />,
              },
              {
                path: 'blogs/:blogId/posts/:postId/edit',
                element: <EditPost />,
                loader: editPostLoader,
              },
              {
                path: 'blogs/:blogId/posts/:postId/preview',
                element: <ViewPost isPreview={true} />,
                loader: previewLoader,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routesConfig;
