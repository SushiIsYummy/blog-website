import { useMediaQuery } from '@react-hook/media-query';
import { createContext, useContext, useState, useEffect } from 'react';

const DashboardSidebarContext = createContext();

export const DashboardSidebarProvider = ({ children }) => {
  const [dashboardSidebarIsOpen, setDashboardSidebarIsOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');

  useEffect(() => {
    if (isSmallScreen) {
      setDashboardSidebarIsOpen(false);
    } else {
      setDashboardSidebarIsOpen(true);
    }
  }, [isSmallScreen]);

  const toggleDashboardSidebar = (event) => {
    event.stopPropagation();
    setDashboardSidebarIsOpen(!dashboardSidebarIsOpen);
  };

  const closeDashboardSidebar = () => {
    setDashboardSidebarIsOpen(false);
  };
  const openDashboardSidebar = () => {
    setDashboardSidebarIsOpen(true);
  };

  return (
    <DashboardSidebarContext.Provider
      value={{
        dashboardSidebarIsOpen,
        closeDashboardSidebar,
        openDashboardSidebar,
        toggleDashboardSidebar,
        setDashboardSidebarIsOpen,
      }}
    >
      {children}
    </DashboardSidebarContext.Provider>
  );
};

export const useDashboardSidebar = () => {
  const context = useContext(DashboardSidebarContext);
  if (!context) {
    throw new Error(
      'useDashboardSidebar must be used within a DashboardSidebarProvider',
    );
  }
  return context;
};
