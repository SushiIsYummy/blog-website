import { Form, NavLink } from 'react-router-dom';
import styles from './SignIn.module.css';
import AuthAPI from '../../api/AuthAPI';
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthProvider';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import underscoreToCamelCase from '../../utils/underscoreToCamelCase';

function SignIn() {
  const { signIn, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state: locationState } = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    username: '',
    password: '',
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
      await signIn(username, password);
      if (locationState) {
        const { redirectTo } = locationState;
        navigate(`${redirectTo.pathname}${redirectTo.search}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.log(err);
      const newErrors = {};
      const errMessageParsed = JSON.parse(err.message ?? null);
      let responseErrors = errMessageParsed.data?.errors;
      if (responseErrors) {
        responseErrors.map((error) => {
          newErrors[`${underscoreToCamelCase(error.path)}`] = error.msg;
        });
        setErrors(newErrors);
      }
      let responseError = errMessageParsed.data?.error;
      console.log(responseError);
      if (responseError) {
        setErrors({
          username: '',
          password: '',
          usernameAndPassword: responseError.message,
        });
      }
      console.error(err.message);
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
          <span className={styles.errorMsg}>{errors.password}</span>
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
