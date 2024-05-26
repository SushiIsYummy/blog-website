import './index.css';
import ErrorPage from './pages/Error/ErrorPage';
import UserProfile from './pages/UserProfile/UserProfile';
import Home from './pages/Home/Home';
import ViewPost from './pages/ViewPost/ViewPost';
import Blog from './pages/Blog/Blog';
import EditPost from './pages/EditPost/EditPost';
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
            loader: Home.loader,
          },
          {
            path: 'users/:userId',
            element: <UserProfile />,
            loader: UserProfile.loader,
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
            loader: Blog.loader,
          },
          {
            path: 'posts/:postId',
            element: <ViewPost />,
            loader: ViewPost.loader,
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
                loader: EditPost.loader,
              },
              {
                path: 'blogs/:blogId/posts/:postId/preview',
                element: <ViewPost isPreview={true} />,
                loader: ViewPost.previewLoader,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routesConfig;
