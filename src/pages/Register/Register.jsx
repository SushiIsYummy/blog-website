import { Form, NavLink } from 'react-router-dom';
import styles from './Register.module.css';
import AuthAPI from '../../api/AuthAPI';
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthProvider';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

function Register() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state: locationState } = useLocation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    <div className={styles.registerPage}>
      <Form className={styles.registerForm} onSubmit={onSubmit}>
        <h1>Register</h1>
        <div className={styles.name}>
          <div className={styles.formField}>
            <label htmlFor=''>First Name</label>
            <input
              type='text'
              name='first_name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <span className={styles.errorMsg}></span>
          </div>
          <div className={styles.formField}>
            <label htmlFor=''>Last Name</label>
            <input
              type='text'
              name='last_name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <span className={styles.errorMsg}></span>
          </div>
        </div>
        <div className={styles.formField}>
          <label htmlFor=''>Username</label>
          <input
            type='text'
            name='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span className={styles.errorMsg}></span>
        </div>
        <div className={styles.formField}>
          <label htmlFor=''>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className={styles.errorMsg}></span>
        </div>
        <div className={styles.formField}>
          <label htmlFor=''>Confirm Password</label>
          <input
            type='password'
            name='confirm_password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className={styles.errorMsg}></span>
        </div>
        <button className={styles.registerButton}>Register</button>
        <p>
          Already have an account? <NavLink to={`/sign-in`}>Sign in</NavLink>
        </p>
      </Form>
    </div>
  );
}

export default Register;
