import './index.css';
import ErrorPage from './pages/Error/ErrorPage';
import UserProfile, {
  loader as userProfileLoader,
} from './pages/UserProfile/UserProfile';
import Home, { loader as HomeLoader } from './pages/Home/Home';
import Post, { loader as postLoader } from './pages/Post/Post';
import Blog, { loader as blogLoader } from './pages/Blog/Blog';
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
            element: <Post />,
            loader: postLoader,
          },
          {
            path: 'new-post',
            element: <EditPost />,
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
            path: 'dashboard/blog/:sidebarOption',
            element: <Dashboard />,
            children: [
              {
                path: ':blogId',
                element: <Dashboard />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routesConfig;
