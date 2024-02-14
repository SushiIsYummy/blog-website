import { Form, NavLink } from 'react-router-dom';
import styles from './SignIn.module.css';
import AuthAPI from '../../api/AuthAPI';
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthProvider';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

function SignIn() {
  const { signIn, isLoggedIn } = useContext(AuthContext);
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

  return (
    <div className={styles.signInPage}>
      <Form className={styles.signInForm} onSubmit={onSubmit}>
        <h1>Sign In</h1>
        <div className={styles.formField}>
          <label htmlFor=''>Username</label>
          <input
            type='text'
            name='username'
            value={username}
            onChange={onUsernameChange}
          />
        </div>
        <div className={styles.formField}>
          <label htmlFor=''>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onPasswordChange}
          />
        </div>
        <button className={styles.signInButton}>Sign In</button>
        <p>
          Don&apos;t have an account?{' '}
          <NavLink to={`/register`}>Register</NavLink>
        </p>
      </Form>
    </div>
  );
}

export default SignIn;
