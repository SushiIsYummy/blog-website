import { useOutletContext } from 'react-router-dom';

function getHeaderHeight() {
  const { headerRef } = useOutletContext();

  let headerHeight = null;

  if (headerRef.current) {
    headerHeight = parseFloat(
      window.getComputedStyle(headerRef.current).height,
    );
  }

  return headerHeight;
}

export default getHeaderHeight;
