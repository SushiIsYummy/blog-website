import { Form, redirect } from 'react-router-dom';
import styles from './SignIn.module.css';
import AuthAPI from '../../api/AuthAPI';
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthProvider';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

function SignIn() {
  const { setUser, signIn, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state: locationState } = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(username, password);
      if (locationState) {
        const { redirectTo } = locationState;
        navigate(`${redirectTo.pathname}${redirectTo.search}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoggedIn) {
    return navigate(-1, { replace: true });
  }
  // if (!locationState) {
  //   return navigate(-1);
  // }

  return (
    <div className={styles.signInPage}>
      <Form className={styles.signInForm} onSubmit={onSubmit}>
        <h1>Sign In</h1>
        <p>Username</p>
        <input
          type='text'
          name='username'
          value={username}
          onChange={onUsernameChange}
        />
        <p>Password</p>
        <input
          type='password'
          name='password'
          value={password}
          onChange={onPasswordChange}
        />
        <button>Sign In</button>
      </Form>
    </div>
  );
}

export default SignIn;
