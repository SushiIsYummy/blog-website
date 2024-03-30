import { useEffect, useRef } from 'react';

const useEffectAfterMount = (callback, dependencies) => {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      callback();
    } else {
      hasMounted.current = true;
    }
  }, dependencies);
};

export default useEffectAfterMount;
