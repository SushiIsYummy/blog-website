import { Outlet } from 'react-router-dom';
import './index.css';
import Header from './pages/Header/Header';
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
          {
            path: 'posts/:postId',
            element: <Post />,
            loader: postLoader,
          },
          {
            path: 'new-post',
            element: <EditPost />,
            // loader: editPostLoader,
          },
          {
            path: 'sign-in',
            element: <SignIn />,
          },
          {
            path: 'register',
            element: <Register />,
          },
        ],
      },
    ],
  },
];

export default routesConfig;
