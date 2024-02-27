import { Outlet } from 'react-router-dom';
import Header from './pages/Header/Header';
import { useRef } from 'react';

function Layout() {
  const headerRef = useRef(null);

  return (
    <>
      <Header headerRef={headerRef} />
      <Outlet context={{ headerRef }} />
    </>
  );
}
export default Layout;
