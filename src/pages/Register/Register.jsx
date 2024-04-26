import { Form, NavLink } from 'react-router-dom';
import styles from './Register.module.css';
import { useState, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import UserAPI from '../../api/UserAPI';
import underscoreToCamelCase from '../../utils/underscoreToCamelCase';

function Register() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state: locationState } = useLocation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UserAPI.createUser({
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
        confirm_password: confirmPassword,
      });

      await signIn(username, password);

      if (locationState) {
        const { redirectTo } = locationState;
        navigate(`${redirectTo.pathname}${redirectTo.search}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      const newErrors = {};
      let responseErrors = err?.data?.errors;
      if (responseErrors) {
        responseErrors.map((error) => {
          newErrors[`${underscoreToCamelCase(error.path)}`] = error.msg;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className={styles.registerPage}>
      <Form className={styles.registerForm} onSubmit={onSubmit}>
        <h1>Register</h1>
        <div className={styles.name}>
          <div className={styles.formField}>
            <label htmlFor='firstName'>First Name</label>
            <input
              type='text'
              id='firstName'
              name='first_name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <span className={styles.errorMsg}>{errors.firstName}</span>
          </div>
          <div className={styles.formField}>
            <label htmlFor='lastName'>Last Name</label>
            <input
              type='text'
              id='lastName'
              name='last_name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <span className={styles.errorMsg}>{errors.lastName}</span>
          </div>
        </div>
        <div className={styles.formField}>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            name='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className={styles.errorMsg}>{errors.password}</span>
        </div>
        <div className={styles.formField}>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            type='password'
            id='confirmPassword'
            name='confirm_password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className={styles.errorMsg}>{errors.confirmPassword}</span>
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
