import { useRouteError, NavLink } from 'react-router-dom';
import styles from './ErrorPage.module.css';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  return (
    <div id='error-page' className={styles.errorPage}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error && (error.statusText || error.message)}</i>
      </p>
      <p>
        Back to <NavLink to={'/'}>Home</NavLink>
      </p>
    </div>
  );
}
