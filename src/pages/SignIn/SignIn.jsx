import { Form, NavLink } from 'react-router-dom';
import styles from './SignIn.module.css';
import { useState, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';

function SignIn() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state: locationState } = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    usernameAndPassword: '',
  });

  const onUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('signing in!');
      await signIn(username, password);
      console.log('signed in!');
      if (locationState) {
        const { redirectTo } = locationState;
        navigate(`${redirectTo.pathname}${redirectTo.search}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrors({ usernameAndPassword: err.message });
    }
  };

  return (
    <div className={styles.signInPage}>
      <Form className={styles.signInForm} onSubmit={onSubmit}>
        <h1>Sign In</h1>
        <div className={styles.formField}>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            name='username'
            value={username}
            onChange={onUsernameChange}
          />
          <span className={styles.errorMsg}>{errors.username}</span>
        </div>
        <div className={styles.formField}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            value={password}
            onChange={onPasswordChange}
          />
          <span className={styles.errorMsg}>{errors.usernameAndPassword}</span>
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
